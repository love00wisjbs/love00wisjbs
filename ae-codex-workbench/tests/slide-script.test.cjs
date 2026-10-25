// Contract harness for the COMPLETE JSX. This is not an AE host emulator.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const scripts = path.join(__dirname, '../skills/after-effects-windows/scripts');
const core = fs.readFileSync(path.join(scripts, 'ease-core.js'), 'utf8');
const jsx = fs.readFileSync(path.join(scripts, 'slide-selected.jsx'), 'utf8');
// Resolve exactly this local include instead of silently stripping arbitrary includes.
assert.match(jsx, /^#include "ease-core\.js"\r?\n/);
const source = jsx.replace(/^#include "ease-core\.js"\r?\n/, core + '\n');

function host() {
  const alerts = [], undo = [];
  const types = { TwoD: 2, ThreeD: 3, TwoD_SPATIAL: 4, OneD: 1 };
  function property(value, valueType) {
    const keys = [];
    return {
      value, propertyValueType: valueType, expressionEnabled: false,
      dimensionsSeparated: false, keys, easeCalls: [], tangentCalls: [],
      get numKeys() { return keys.length; },
      setValueAtTime(time, next) {
        const record = keys.find(k => k.time === time);
        if (record) record.value = Array.isArray(next) ? Array.from(next) : next;
        else keys.push({ time, value: Array.isArray(next) ? Array.from(next) : next });
        keys.sort((a,b) => a.time - b.time);
      },
      nearestKeyIndex(time) {
        assert.ok(keys.length, 'nearestKeyIndex requires keys');
        return keys.reduce((best, key, index) => Math.abs(key.time-time) < Math.abs(keys[best].time-time) ? index : best, 0) + 1;
      },
      isInterpolationTypeValid() { return true; },
      setInterpolationTypeAtKey(key, incoming, outgoing) {
        assert.ok(key >= 1 && key <= keys.length);
        keys[key-1].interpolation = [incoming, outgoing];
      },
      setTemporalEaseAtKey(key, incoming, outgoing) {
        // In this fixture Position is spatial, opacity scalar: both require ONE.
        assert.equal(incoming.length, 1);
        assert.equal(outgoing.length, 1);
        assert.ok(keys[key-1].interpolation, 'Bezier must precede ease');
        this.easeCalls.push(key);
      },
      setSpatialAutoBezierAtKey(key, enabled) { assert.equal(enabled, false); },
      setSpatialContinuousAtKey(key, enabled) { assert.equal(enabled, false); },
      setSpatialTangentsAtKey(key, incoming, outgoing) {
        assert.equal(valueType, types.TwoD_SPATIAL);
        assert.deepEqual(Array.from(incoming), [0,0]);
        assert.deepEqual(Array.from(outgoing), [0,0]);
        this.tangentCalls.push(key);
      }
    };
  }
  const position = property([500, 300], types.TwoD_SPATIAL);
  const opacity = property(80, types.OneD);
  const transform = { property(name) {
    if (name === 'ADBE Position') return position;
    if (name === 'ADBE Opacity') return opacity;
    throw new Error('Unexpected property: ' + name);
  }};
  const layer = {locked:false,threeDLayer:false,parent:null,inPoint:0,outPoint:5,
    property(name) { assert.equal(name,'ADBE Transform Group'); return transform; }};
  function CompItem() { this.time = 0.5; this.duration = 5; this.selectedLayers = [layer]; }
  const comp = new CompItem();
  const context = vm.createContext({
    app: {project:{activeItem:comp},beginUndoGroup(name){undo.push('begin');},endUndoGroup(){undo.push('end');}},
    CompItem, PropertyValueType:types, KeyframeInterpolationType:{BEZIER:10},
    KeyframeEase:function(speed,influence){this.speed=speed;this.influence=influence;},
    alert(message){alerts.push(message);}
  });
  return {comp,layer,position,opacity,alerts,undo,context,run(){vm.runInContext(source,context);}};
}

test('full JSX creates expected keys, preserves source position and closes undo', () => {
  const h = host();h.run();
  assert.deepEqual(h.position.keys.map(({time,value})=>({time,value})),[
    {time:0.5,value:[300,300]}, {time:1.5,value:[500,300]}
  ]);
  assert.deepEqual(h.opacity.keys.map(({time,value})=>({time,value})),[
    {time:0.5,value:0}, {time:1.5,value:100}
  ]);
  assert.deepEqual(h.position.value,[500,300]);
  assert.deepEqual(h.position.easeCalls,[1,2]);
  assert.deepEqual(h.opacity.easeCalls,[1,2]);
  assert.deepEqual(h.position.tangentCalls,[1,2]);
  assert.deepEqual(h.undo,['begin','end']);
  assert.match(h.alerts[0],/^Created/);
});

test('full JSX rerun does not touch existing keys or open another undo group', () => {
  const h=host();h.run();
  const before=JSON.stringify([h.position.keys,h.opacity.keys]);
  h.run();
  assert.equal(JSON.stringify([h.position.keys,h.opacity.keys]),before);
  assert.deepEqual(h.undo,['begin','end']);
  assert.match(h.alerts[1],/Existing animation detected/);
});

test('full JSX fails closed for invalid input without opening undo or writing keys', () => {
  for (const change of [
    h=>h.comp.selectedLayers=[], h=>h.comp.selectedLayers.push(h.layer),
    h=>h.layer.locked=true, h=>h.layer.threeDLayer=true, h=>h.layer.parent={},
    h=>h.position.dimensionsSeparated=true, h=>h.opacity.expressionEnabled=true,
    h=>h.comp.time=4.5, h=>h.context.app.project.activeItem=null,
    h=>h.context.app.project=null
  ]) {
    const h=host();change(h);h.run();
    assert.equal(h.position.numKeys,0);assert.equal(h.opacity.numKeys,0);
    assert.deepEqual(h.undo,[]);assert.match(h.alerts[0],/^Portable AE:/);
  }
});

test('full JSX closes undo and reports partial failure without false success or retry', () => {
  const h=host();
  h.position.setTemporalEaseAtKey=()=>{throw new Error('simulated host failure');};
  h.run();
  assert.deepEqual(h.undo,['begin','end']);
  assert.equal(h.alerts.length,1);assert.match(h.alerts[0],/simulated host failure/);
  assert.match(h.alerts[0],/partially applied/);
  assert.equal(h.position.numKeys,2); // Deliberately not an automatic transaction.
  assert.equal(h.opacity.numKeys,2);
});

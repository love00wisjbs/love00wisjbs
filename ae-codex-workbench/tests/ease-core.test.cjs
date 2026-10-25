const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const corePath = path.join(__dirname, '../skills/after-effects-windows/scripts/ease-core.js');
test('portable helper implementation exists', () => assert.ok(fs.existsSync(corePath), 'ease-core.js has not been implemented'));
if (fs.existsSync(corePath)) {
 const types = {OneD:1,TwoD:2,ThreeD:3,TwoD_SPATIAL:4,ThreeD_SPATIAL:5,COLOR:6};
 const context = {PropertyValueType:types, KeyframeInterpolationType:{BEZIER:10}, KeyframeEase:function(speed,influence){this.speed=speed;this.influence=influence;}};
 vm.createContext(context); vm.runInContext(fs.readFileSync(corePath,'utf8'), context);
 const api=context.AEPortable;
 test('temporal ease uses property type, not value array length',()=>{
  for(const [type,count] of [[types.OneD,1],[types.TwoD,2],[types.ThreeD,3],[types.TwoD_SPATIAL,1],[types.ThreeD_SPATIAL,1],[types.COLOR,1]]) assert.equal(api.easeCount(type,types),count);
 });
 function prop(type=types.TwoD_SPATIAL) {return {propertyValueType:type,numKeys:2,calls:[],isInterpolationTypeValid(){return true;},setInterpolationTypeAtKey(...args){this.calls.push(['interpolation',...args]);},setTemporalEaseAtKey(...args){this.calls.push(['ease',...args]);}};}
 test('ease arrays and interpolation are correct for spatial and scale',()=>{
  for(const [type,count] of [[types.TwoD_SPATIAL,1],[types.ThreeD,3]]){const p=prop(type);api.applyEase(p,1,33.33);assert.equal(p.calls[0][0],'interpolation');assert.equal(p.calls[1][2].length,count);assert.equal(p.calls[1][3].length,count);assert.equal(p.calls[1][2][0].speed,0);}
 });
 test('influence boundaries valid; bad values rejected before mutation',()=>{
  for(const value of [0.1,100])api.applyEase(prop(),1,value);
  for(const value of [0,-1,100.1,NaN,Infinity,'50']){const p=prop();assert.throws(()=>api.applyEase(p,1,value));assert.equal(p.calls.length,0);}
 });
 test('invalid key index and unsupported interpolation never mutate',()=>{
  for(const k of [0,3,1.5,NaN]){const p=prop();assert.throws(()=>api.applyEase(p,k,50));assert.equal(p.calls.length,0);}
  const p=prop();p.isInterpolationTypeValid=()=>false;assert.throws(()=>api.applyEase(p,1,50));assert.equal(p.calls.length,0);
 });
 function comp(){const p={numKeys:0,expressionEnabled:false,dimensionsSeparated:false,value:[500,300]};const o={numKeys:0,expressionEnabled:false,value:100};const l={locked:false,threeDLayer:false,inPoint:0,outPoint:5,property(){return {property(n){return n==='ADBE Position'?p:o;}};}};return {time:0,duration:5,selectedLayers:[l],p,o,l};}
 test('valid slide preflight returns selected layer',()=>{const c=comp();assert.equal(api.validateSlide(c),c.l);});
 test('parent transforms cannot alter the advertised horizontal 200px slide',()=>{const c=comp();c.l.parent={rotation:45,scale:[200,200]};assert.throws(()=>api.validateSlide(c));});
 test('reject selection/locked/3D/separation/expression/keyed/timing before mutation',()=>{
  const mutations=[c=>c.selectedLayers=[],c=>c.selectedLayers.push(c.l),c=>c.l.locked=true,c=>c.l.threeDLayer=true,c=>c.p.dimensionsSeparated=true,c=>c.p.expressionEnabled=true,c=>c.o.expressionEnabled=true,c=>c.p.numKeys=2,c=>c.o.numKeys=1,c=>c.time=4.5,c=>c.l.inPoint=1,c=>c.l.outPoint=0.5];
  for(const change of mutations){const c=comp();change(c);assert.throws(()=>api.validateSlide(c));}
 });
}

/* Original ES3 helpers. MIT. Loaded by JSX and by Node contract tests. */
var AEPortable = (function () {
    function easeCount(valueType, types) {
        if (valueType === types.TwoD) return 2;
        if (valueType === types.ThreeD) return 3;
        return 1;
    }
    function applyEase(prop, key, influence) {
        if (typeof key !== 'number' || !isFinite(key) || key % 1 !== 0 || key < 1 || key > prop.numKeys) {
            throw new Error('Invalid key index');
        }
        if (typeof influence !== 'number' || !isFinite(influence) || influence < 0.1 || influence > 100) {
            throw new Error('Influence must be 0.1 through 100');
        }
        if (!prop.isInterpolationTypeValid(KeyframeInterpolationType.BEZIER)) {
            throw new Error('Property does not support Bezier interpolation');
        }
        var count = easeCount(prop.propertyValueType, PropertyValueType);
        var incoming = [], outgoing = [], i;
        for (i = 0; i < count; i++) {
            incoming.push(new KeyframeEase(0, influence));
            outgoing.push(new KeyframeEase(0, influence));
        }
        prop.setInterpolationTypeAtKey(key, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);
        prop.setTemporalEaseAtKey(key, incoming, outgoing);
    }
    function validateSlide(comp) {
        if (!comp || comp.selectedLayers.length !== 1) throw new Error('Select exactly one layer');
        var layer = comp.selectedLayers[0];
        if (layer.locked || layer.threeDLayer) throw new Error('Choose an unlocked 2D layer');
        if (layer.parent) throw new Error('Choose an unparented layer for a horizontal 200px slide');
        var transform = layer.property('ADBE Transform Group');
        if (!transform) throw new Error('Layer has no transform');
        var pos = transform.property('ADBE Position');
        var opa = transform.property('ADBE Opacity');
        if (!pos || !opa || pos.dimensionsSeparated) throw new Error('Requires unseparated Position and Opacity');
        if (pos.numKeys || opa.numKeys || pos.expressionEnabled || opa.expressionEnabled) {
            throw new Error('Existing animation detected; this example will not replace it');
        }
        if (comp.time < layer.inPoint || comp.time + 1 > comp.duration || comp.time + 1 > layer.outPoint) {
            throw new Error('One-second animation must fit inside comp and layer');
        }
        return layer;
    }
    return {easeCount: easeCount, applyEase: applyEase, validateSlide: validateSlide};
})();

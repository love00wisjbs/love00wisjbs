#include "ease-core.js"
/* Run on a saved COPY via File > Scripts > Run Script File. */
(function () {
    var comp = app.project ? app.project.activeItem : null;
    var opened = false;
    try {
        if (!(comp instanceof CompItem)) throw new Error('Open a composition first');
        var layer = AEPortable.validateSlide(comp);
        var xf = layer.property('ADBE Transform Group');
        var pos = xf.property('ADBE Position');
        var opa = xf.property('ADBE Opacity');
        var target = pos.value;
        var t = comp.time;
        app.beginUndoGroup('Portable AE: selected layer slide');
        opened = true;
        pos.setValueAtTime(t, [target[0] - 200, target[1]]);
        pos.setValueAtTime(t + 1, [target[0], target[1]]);
        opa.setValueAtTime(t, 0);
        opa.setValueAtTime(t + 1, 100);
        AEPortable.applyEase(pos, pos.nearestKeyIndex(t), 33.33);
        AEPortable.applyEase(pos, pos.nearestKeyIndex(t + 1), 33.33);
        AEPortable.applyEase(opa, opa.nearestKeyIndex(t), 33.33);
        AEPortable.applyEase(opa, opa.nearestKeyIndex(t + 1), 33.33);
        // Temporal ease does not set the spatial path. Tangents are 2D here.
        var k;
        for (k = 1; k <= pos.numKeys; k++) {
            pos.setSpatialAutoBezierAtKey(k, false);
            pos.setSpatialContinuousAtKey(k, false);
            pos.setSpatialTangentsAtKey(k, [0, 0], [0, 0]);
        }
        alert('Created one-second slide and fade. Preview, then Ctrl+Z to undo.');
    } catch (error) {
        alert('Portable AE: ' + error.toString() + '\nIf an edit partially applied, Ctrl+Z once before retrying.');
    } finally {
        if (opened) app.endUndoGroup();
    }
})();

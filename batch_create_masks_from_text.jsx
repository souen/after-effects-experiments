{
    /*
     * Batch create masks from text
     * (script for After Effects CS6)
     * 
     * In After Effects CS6, a right-click on a text layer
     * gives access to the command "Create masks from text" in
     * the contextual menu. Unfortunately, the command isn't available
     * if *several* text layers are selected. This script is intended
     * to fix that.
     *
     * Usage: select some text layers in a comp (it must be active) and apply script.
     *
     */

    function unselectAllLayersInComp(comp) {
        if (comp instanceof CompItem) {
            for (j = 1; j <= comp.layers.length; j++) {
                comp.layers[j].selected = false;
            }
        }
    }

    app.beginUndoGroup("create masks from text");

    var selected_text_layers = []
    var project = app.project;

    // Look for selected text layers in the current comp (if there is one)
    if (project.activeItem instanceof CompItem) {  // activeItem is a composition
        var comp = project.activeItem;
        var selected_layers = comp.selectedLayers;
        if (selected_layers.length > 0) {
            for (j = 0; j < selected_layers.length; j++) {
                var layer = selected_layers[j];
                if (layer instanceof TextLayer) {
                    selected_text_layers.push(layer);
                }
            }
        }
    }

    if (selected_text_layers.length > 0) {
        // Un-select all layers in order to have access to righ-click command "Create mask from text"
        for (i = 0; i < selected_text_layers.length; i++) {
            var layer = selected_text_layers[i];
            layer.selected = false;
        }
        // Loop again, select layers one by one and call command
        for (i = 0; i < selected_text_layers.length; i++) {
            var layer = selected_text_layers[i];
            layer.selected = true;
            var createMasksCommand = 2933; // result of app.findMenuCommandId("Créer des masques à partir du texte")
                                           // but since it is localized, we use the id...
                                           // FIXME: find a way to use localized labels ?
            app.executeCommand(createMasksCommand);
            // The "create masks from text" command create a shape layer (containing the mask)
            // and *select* it. So we have so deselect it to be sure
            // the right-click command will still be available in the next loop.
            unselectAllLayersInComp(layer.containingComp);
        }
    } else {
        alert('Please select at least one text layer.');
    }
    
    app.endUndoGroup();

}
{

    function unselectAllLayersInComp(comp) {
        if (comp instanceof CompItem) {
            for (j = 1; j <= comp.layers.length; j++) {
                comp.layers[j].selected = false;
            }
        }
    }

    app.beginUndoGroup("create masks from text");

    var msg = '';
    var selected_text_layers = []
    var project = app.project;

    // Loop on every comp of the project and look for selected text layers
    // NB: index in items collection is 1-indexed
    for (i = 1; i <= project.items.length; i++) {
        var item = project.items[i];
        if (item instanceof CompItem) {  // Item is a composition
            var selected_layers = item.selectedLayers;
            if (selected_layers.length > 0) {
                for (j = 0; j < selected_layers.length; j++) {
                    var layer = selected_layers[j];
                    if (layer instanceof TextLayer) {
                        selected_text_layers.push(layer);
                        msg += '- "' + layer.name + '" (from composition "' + layer.containingComp.name + '")\n';
                    }
                }
            }
        }
    }

    if (selected_text_layers.length > 0) {
        msg = 'Create masks from following layers ?\n' + msg;
        if (confirm(msg)) {
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
                unselectAllLayersInComp(layer.containingComp);
            }
        }
    } else {
        alert('Please select at least one text layer.');
    }
    
    app.endUndoGroup();

}
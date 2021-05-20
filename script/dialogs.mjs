/*
 * 
 */

import {getIconAsSVGImage} from './icon.mjs';

// TODO: possibly switch on constant names instead, or maybe a map or object?

export function setUpDialogs() {
    addEventListeners();
}

function addEventListeners() {
    // Open dialogs
    document.getElementById("save-icon-button").addEventListener("click", (event) => openDialog("save-icon-dialog", updateIconToSave));
    document.getElementById("new-icon-button").addEventListener("click", (event) => openDialog("new-icon-dialog"));
    document.getElementById("settings-button").addEventListener("click", (event) => openDialog("settings-dialog"));
    document.getElementById("help-button").addEventListener("click", (event) => openDialog("help-dialog"));

    // Close dialogs
    document.getElementById("close-save-icon-dialog-button").addEventListener("click", (event) => closeDialog("save-icon-dialog"));
    document.getElementById("close-new-icon-dialog-button").addEventListener("click", (event) => closeDialog("new-icon-dialog"));
    document.getElementById("close-settings-dialog-button").addEventListener("click", (event) => closeDialog("settings-dialog"));
    document.getElementById("close-help-dialog-button").addEventListener("click", (event) => closeDialog("help-dialog"));
}



function openDialog(id, onOpenDialog) {
    if (onOpenDialog)
        onOpenDialog();

    const dialog = document.getElementById(id);
    dialog.style.display = "grid";
}

function closeDialog(id, onCloseDialog) {
    if (onCloseDialog)
        onCloseDialog();

    const dialog = document.getElementById(id);
    dialog.style.display = "none";
}

function updateIconToSave() {
    const container = document.getElementById("icon-to-save");
    container.replaceChildren(getIconAsSVGImage());
}


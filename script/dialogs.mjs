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

    // Save icon dialog
    document.getElementById("save-icon-to-file-button").addEventListener("click", saveIconToFile);
    document.getElementById("copy-icon-to-clipboard-button").addEventListener("click", copyIconToClipobard);
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


/*
    Save icon dialog
*/

function updateIconToSave() {
    const previews = document.getElementsByClassName("icon-preview");
    for(const preview of previews){
        // innerHtml does not work, 
        preview.replaceChildren(getIconAsSVGImage());
    }


    const container = document.getElementById("icon-to-save");
    container.textContent = previews[0].innerHTML;
}


function saveIconToFile(){
    const container = document.getElementById("icon-to-save");
    console.log(container.textContent);
    const text = container.textContent;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', "test.svg");
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  
}

function copyIconToClipobard(){
    var text_to_copy = document.getElementById("icon-to-save").innerHTML;

    if (!navigator.clipboard){
        // use old commandExec() way
    } else{
        navigator.clipboard.writeText(text_to_copy).then(
            function(){
                alert("yeah!"); // success 
            })
          .catch(
             function() {
                alert("err"); // error
          });
    }  
}

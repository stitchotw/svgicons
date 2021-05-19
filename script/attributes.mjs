/*
 * 
 */

export function selectedShapeChanged(){
    
}

function showAttributesOfCurrentlySelectedShape() {
    const shape = getSelectedShapeNodel();
    removeClass(document.getElementsByClassName(shape.attributeClass), "hidden");

    addClass(document.getElementsByClassName("no-shape-selected-text"), "hidden");
    removeClass(document.getElementsByClassName("shape-functions"), "hidden");
}

function hideAllShapeAttributes() {
    addClass(document.getElementsByClassName("shape-attribute-name"), "hidden");
    addClass(document.getElementsByClassName("shape-attribute"), "hidden");

    removeClass(document.getElementsByClassName("no-shape-selected-text"), "hidden");
    addClass(document.getElementsByClassName("shape-functions"), "hidden");
}


export function setUpAttributes() {
    addEventListeners();
}

function addEventListeners() {
    // Current shape
    document.getElementById("delete-selected-shape-button").addEventListener("click", deleteCurrentlySelectedShape);
}

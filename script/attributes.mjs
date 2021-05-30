/*
 * 
 */

import { deleteCurrentlySelectedShape } from './workarea.mjs';
import { addClass, removeClass } from './dom.mjs';
import { shapeFromId } from './icon.mjs';

export function setUpAttributes() {
    addEventListeners();
}

function addEventListeners() {
    document.getElementById("delete-selected-shape-button").addEventListener("click", deleteCurrentlySelectedShape);

    const buttons = document.getElementsByClassName("attribute-button");

    for (const button of buttons) {
        button.addEventListener("click", (evt) => {
            changeAttribute(evt.target.dataset.attributeName, evt.target.dataset.operation);
        });
    }
}


export function selectedShapeChanged(id) {
    hideAllShapeAttributes();
    if (id){
        showShapeAttributes(id);
        updataShapeAttributesView(id);
    }
}

function hideAllShapeAttributes() {
    addClass(document.getElementsByClassName("shape-attribute-name"), "hidden");
    addClass(document.getElementsByClassName("shape-attribute"), "hidden");

    removeClass(document.getElementsByClassName("no-shape-selected-text"), "hidden");
    addClass(document.getElementsByClassName("shape-functions"), "hidden");
}

function showShapeAttributes(id) {
    removeClass(document.getElementsByClassName(shapeFromId(id).attributeClass), "hidden");

    addClass(document.getElementsByClassName("no-shape-selected-text"), "hidden");
    removeClass(document.getElementsByClassName("shape-functions"), "hidden");
}

function updataShapeAttributesView(id){

}

function changeAttribute(attributeName, operation) {
    console.log(attributeName + " " + operation);

    updataShapeAttributesView()
}



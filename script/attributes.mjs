/*
 * 
 */

import {deleteCurrentlySelectedShape} from './workarea.mjs';
import {addClass, removeClass} from './dom.mjs';
import {shapeFromId} from './icon.mjs';

export function setUpAttributes() {
    addEventListeners();
}

function addEventListeners() {
    document.getElementById("delete-selected-shape-button").addEventListener("click", deleteCurrentlySelectedShape);
}


export function selectedShapeChanged(id) {
    hideAllShapeAttributes();
    if (id)
        showShapeAttributes(id);
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




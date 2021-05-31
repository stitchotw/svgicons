/*
 * 
 */

import { currentlySelectedShapeId, deleteCurrentlySelectedShape } from './workarea.mjs';
import { shapeFromId } from "./icon.mjs";
import { addClass, removeClass } from './dom.mjs';
//import { shapeFromId } from './icon.mjs';

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


export function selectedShapeChanged() {
    hideAllShapeAttributes();
    if (currentlySelectedShapeId()) {
        showShapeAttributes();
        updateShapeAttributeValues();
    }
}

function hideAllShapeAttributes() {
    addClass(document.getElementsByClassName("shape-attribute-name"), "hidden");
    addClass(document.getElementsByClassName("shape-attribute"), "hidden");

    removeClass(document.getElementsByClassName("no-shape-selected-text"), "hidden");
    addClass(document.getElementsByClassName("shape-functions"), "hidden");
}

function showShapeAttributes() {
    const shape = shapeFromId(currentlySelectedShapeId());
    removeClass(document.getElementsByClassName(shape.attributeClass), "hidden");

    addClass(document.getElementsByClassName("no-shape-selected-text"), "hidden");
    removeClass(document.getElementsByClassName("shape-functions"), "hidden");
}

export function updateShapeAttributeValues() {
    const shape = shapeFromId(currentlySelectedShapeId());
    setAttribute("x", shape.x);
    setAttribute("y", shape.y);
    setAttribute("size", shape.size);
}

function setAttribute(name, value) {
    const label = document.getElementById("attribute-" + name);
    label.innerHTML = value;
}

function changeAttribute(attributeName, operation) {
    console.log(attributeName + " " + operation);

    updateShapeAttributeValues();
}



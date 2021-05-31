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
    shape.updateAttributesUI();
}

function changeAttribute(name, operation, value) {
    const shape = shapeFromId(currentlySelectedShapeId());
    shape.attributes.get(name).update(operation, value);
}

class Attribute {

    constructor(shape, name) {
        if (!shape || !name)
            throw "Both shape and name must be set";
        this.name = name;
        this.shape = shape;
    }

    update(operation, value) {
        switch (operation) {
            case "inc":
                this.increase();
                break;
            case "dec":
                this.decrease();
                break;
            case "set":
                this.set(value);
                break;
            default:
                throw "Unexpected operation: " + operation;
        }
        this.updateUI();
    }

    updateUI() {
        this.shape.updateSVGShape();

        const label = document.getElementById("attribute-" + this.name);
        label.innerHTML = this.value;
    }

}

export class NumericAttribute extends Attribute {

    constructor(shape, name, value) {
        super(shape, name);
        this.value = value ? value : 0;
    }

    increase() {
        this.value++;
        this.updateUI();
    }

    decrease() {
        this.value--;
        this.updateUI();
    }

    add(addend) {
        this.value += addend;
        this.updateUI();
    }
}

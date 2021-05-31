/*
 * 
 */

import { currentlySelectedShapeId, deleteCurrentlySelectedShape } from './workarea.mjs';
import { icon } from "./icon.mjs";
import { addClass, removeClass } from './dom.mjs';

export function setUpAttributes() {
    addEventListeners();
    initializeIconAttributesUI();
}

function addEventListeners() {
    document.getElementById("delete-selected-shape-button").addEventListener("click", deleteCurrentlySelectedShape);

    let buttons = document.getElementsByClassName("attribute-button");

    for (const button of buttons) {
        button.addEventListener("click", (evt) => {
            changeShapeAttribute(evt.target.dataset.attributeName, evt.target.dataset.operation);
        });
    }

    buttons = document.getElementsByClassName("icon-attribute-button");

    for (const button of buttons) {
        button.addEventListener("click", (evt) => {
            changeIconAttribute(evt.target.dataset.attributeName, evt.target.dataset.operation);
        });
    }
}

function initializeIconAttributesUI() {
    document.getElementById("attribute-stroke-width").innerHTML = icon.get("stroke-width").value;
}

function changeIconAttribute(name, operation, value) {
    icon.get(name).update(operation, value);
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
    const shape = icon.shapeFromId(currentlySelectedShapeId());
    removeClass(document.getElementsByClassName(shape.attributeClass), "hidden");

    addClass(document.getElementsByClassName("no-shape-selected-text"), "hidden");
    removeClass(document.getElementsByClassName("shape-functions"), "hidden");
}

export function updateShapeAttributeValues() {
    const shape = icon.shapeFromId(currentlySelectedShapeId());
    shape.updateAttributesUI();
}

function changeShapeAttribute(name, operation, value) {
    const shape = icon.shapeFromId(currentlySelectedShapeId());
    shape.attributes.get(name).update(operation, value);
}

class Attribute {

    constructor(item, name) {
        if (!item || !name)
            throw "Both item and name must be set";
        this.name = name;
        this.item = item;
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
        this.item.updateUI();

        const label = document.getElementById("attribute-" + this.name);
        if (!label)
            throw "Could not find div with id attribute-" + this.name;
            
        label.innerHTML = this.value;
    }

}

export class NumericAttribute extends Attribute {

    constructor(item, name, value) {
        super(item, name);
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

export class TextAttribute extends Attribute {

    constructor(item, name, value) {
        super(item, name);
        this.value = value ? value : undefined;
    }

}

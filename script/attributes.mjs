/*
 * 
 */

import { currentlySelectedShapeId, deleteCurrentlySelectedShape } from './workarea.mjs';
import { icon } from "./icon.mjs";
import { addClass, removeClass } from './dom.mjs';
import { copyCurrentlySelectedShape } from './workarea.mjs';

export function setUpAttributes() {
    addEventListeners();
    initializeIconAttributesUI();
    // Trigger hiding of shape attributes
    selectedShapeChanged();
}

function addEventListeners() {
    document.getElementById("delete-selected-shape-button").addEventListener("click", deleteCurrentlySelectedShape);
    document.getElementById("copy-selected-shape-button").addEventListener("click", copyCurrentlySelectedShape);

    addEventListenersToButtons("shape-attribute-button", changeShapeAttribute);
    addEventListenersToButtons("shape-style-attribute-button", changeShapeStyleAttribute);
    addEventListenersToButtons("icon-style-attribute-button", changeIconStyleAttribute);
}

function addEventListenersToButtons(className, listener) {
    let buttons = document.getElementsByClassName(className);

    for (const button of buttons) {
        button.addEventListener("click", (evt) => {
            listener(evt.target.dataset.attributeName, evt.target.dataset.operation);
        });
    }
}

// Shape attributes

export function selectedShapeChanged() {
    hideAllShapeAttributes();
    if (currentlySelectedShapeId()) {
        showShapeAttributes();
        showShapeStyleAttributes();

        addClass(document.getElementsByClassName("no-shape-selected-text"), "hidden");
        removeClass(document.getElementsByClassName("shape-functions"), "hidden");

        //updateShapeAttributeValues();
    }
}

function hideAllShapeAttributes() {
    addClass(document.getElementsByClassName("shape-attribute-name"), "hidden");

    addClass(document.getElementsByClassName("shape-attribute-button"), "hidden");
    addClass(document.getElementsByClassName("shape-attribute"), "hidden");

    addClass(document.getElementsByClassName("shape-style-attribute-button"), "hidden");
    addClass(document.getElementsByClassName("shape-style-attribute"), "hidden");

    removeClass(document.getElementsByClassName("no-shape-selected-text"), "hidden");
    addClass(document.getElementsByClassName("shape-functions"), "hidden");
}

function showShapeAttributes() {
    const shape = icon.shapeFromId(currentlySelectedShapeId());
    shape.svgAttributes.showAllInUI();
}

function showShapeStyleAttributes() {
    const shape = icon.shapeFromId(currentlySelectedShapeId());
    shape.svgStyle.showAllInUI();
}



// TODO: Used when dragging, should be possible to remove
export function updateShapeAttributeValues() {
    const shape = icon.shapeFromId(currentlySelectedShapeId());
    shape.updateUI();
}


function changeShapeAttribute(name, operation, value) {
    const shape = icon.shapeFromId(currentlySelectedShapeId());
    shape.svgAttributes.get(name).update(operation, value);
}

function changeShapeStyleAttribute(name, operation, value) {
    const shape = icon.shapeFromId(currentlySelectedShapeId());
    shape.svgStyle.get(name).update(operation, value);
}

// Global style attributes

function initializeIconAttributesUI() {
    document.getElementById("icon-style-attribute-stroke-width").innerHTML = icon.svgStyle.get("stroke-width").value;
}

function changeIconStyleAttribute(name, operation, value) {
    icon.svgStyle.get(name).update(operation, value);
}

export class SVGData {

    constructor(uiPrefix) {
        this.uiPrefix = uiPrefix;
        this.data = new Map();
    }

    get(name) {
        return this.data.get(name);
    }

    showAllInUI() {
        this.data.forEach((attribute) => {
            const elements = document.getElementsByClassName(attribute.uiName);
            if (elements.length === 0)
                console.warn("Could not find any UI elements for " + attribute.uiName);
            removeClass(elements, "hidden");
        });

        this.updateUI();
    }

    updateUI() {
        this.data.forEach((attribute) => {
            attribute.updateUI();
        });
    }

    asText() {
        let data = "";
        this.data.forEach((attribute, name) => {
            if (attribute.value !== undefined) {
                data += name + ":" + attribute.value + ";";
            }
        });
        return data;
    }

    addNumeric(item, name, value, min = 0, max = 32) {
        this.data.set(name, new NumericAttribute(item, name, this.uiPrefix, value, min, max));
    }

    addText(item, name, value) {
        this.data.set(name, new TextAttribute(item, name, this.uiPrefix, value));
    }

    addAll(source) {
        for (const [name, fromData] of source.data) {
            if (!name)
                throw `${name} does not exist`;

            const toData = this.data.get(name);
            toData.copy(fromData);
        }
    }

}

class Attribute {

    constructor(item, name, uiPrefix) {
        this.item = item;
        this.name = name;
        this.uiPrefix = uiPrefix;
    }

    get uiName() {
        return this.uiPrefix + this.name;
    }

    set(value) {
        this.value = value;
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
            case "clear":
                this.set(undefined);
                break;
            default:
                throw "Unexpected operation: " + operation;
        }
        this.updateUI();
    }

    updateUI() {
        this.item.updateSvgUI();

        const label = document.getElementById(this.uiPrefix + this.name);
        if (!label)
            throw "Could not find id " + this.uiPrefix + this.name;

        label.innerHTML = this.value === undefined ? "U/A" : this.value;
    }

}

class NumericAttribute extends Attribute {

    constructor(item, name, uiPrefix, value, min = 1, max = 32) {
        super(item, name, uiPrefix);
        this.value = value;
        this.min = min;
        this.max = max;
    }

    increase() {
        // Only things redefined from icon can be undefined
        if (this.value === undefined) {
            this.value = icon.svgStyle.get(this.name).value;
        }
        if (this.value < this.max) {
            this.value++;
            this.updateUI();
        }
    }

    decrease() {
        // Only things redefined from icon can be undefined
        if (this.value === undefined) {
            this.value = icon.svgStyle.get(this.name).value;
        }
        if (this.value > this.min) {
            this.value--;
            this.updateUI();
        }
    }

    add(addend) {
        this.value += addend;
        this.updateUI();
    }

    copy(source) {
        this.value = source.value;
        this.min = source.min;
        this.max = source.max;
    }
}

class TextAttribute extends Attribute {

    constructor(item, name, uiPrefix, value) {
        super(item, name, uiPrefix);
        this.value = value ? value : undefined;
    }

    copy(source) {
        this.value = source.value;
    }
}

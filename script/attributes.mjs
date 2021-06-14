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
    // Trigger setting of icon default attributes
    icon.updateUI();
}

function addEventListeners() {
    document.getElementById("delete-selected-shape-button").addEventListener("click", deleteCurrentlySelectedShape);
    document.getElementById("copy-selected-shape-button").addEventListener("click", copyCurrentlySelectedShape);

    addEventListenersToButtons("shape-attribute-button", changeShapeAttribute);

    addEventListenersToButtons("shape-style-attribute-button", changeShapeStyleAttribute);
    addEventListenersToSelects("shape-style-attribute-select", changeShapeStyleAttribute);

    addEventListenersToButtons("icon-style-attribute-button", changeIconStyleAttribute);
    addEventListenersToSelects("icon-style-attribute-select", changeIconStyleAttribute);
}

function addEventListenersToButtons(className, listener) {
    addEventListenersToItems(className, "click", listener);
}

function addEventListenersToSelects(className, listener) {
    addEventListenersToItems(className, "change", listener);
}

function addEventListenersToItems(className, eventName, listener) {
    const items = document.getElementsByClassName(className);

    for (const item of items) {
        item.addEventListener(eventName, (evt) => {
            listener(evt.target.dataset.attributeName, evt.target.dataset.operation, evt.target.value);
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

function changeAttribute(data, name, operation, value) {
    if (!data || !name || !operation) {
        console.trace("data:", data, "name:", name, "operation:", operation, "value:", value)
        return;
    }
    const attribute = data.get(name);
    if (!attribute) {
        console.trace("Attribute '" + name + "' not defiened");
        return;
    }
    attribute.update(operation, value);
}

function changeShapeAttribute(name, operation, value) {
    const shape = icon.shapeFromId(currentlySelectedShapeId());
    changeAttribute(shape.svgAttributes, name, operation, value);
}

function changeShapeStyleAttribute(name, operation, value) {
    const shape = icon.shapeFromId(currentlySelectedShapeId());
    changeAttribute(shape.svgStyle, name, operation, value);
}

// Global style attributes

function initializeIconAttributesUI() {
    document.getElementById("icon-style-attribute-stroke-width").innerHTML = icon.svgStyle.get("stroke-width").value;
}

function changeIconStyleAttribute(name, operation, value) {
    changeAttribute(icon.svgStyle, name, operation, value);
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
                console.trace("Could not find any UI elements for " + attribute.uiName, attribute);
            removeClass(elements, "hidden");
        });

        this.updateUI();
    }

    updateUI() {
        this.data.forEach((attribute) => {
            attribute.updateUI();
        });
    }

    get asSvgStyle() {
        let data = "";
        this.data.forEach((attribute, name) => {
            if (attribute.value !== undefined) {
                data += name + ":" + attribute.value + ";";
            }
        });
        return data;
    }

    get asObject(){
        const obj = new Object();

        this.data.forEach((attribute, name) => {
            if (attribute.value !== undefined) {
               obj[name]=attribute.value;
            }
        });

        return obj;
    }

    addNumeric(item, name, value, min = 0, max = 32) {
        this.data.set(name, new NumericAttribute(item, name, this.uiPrefix, value, min, max));
    }

    addText(item, name, value) {
        this.data.set(name, new TextAttribute(item, name, this.uiPrefix, value));
    }

    addTextData(item, name, value) {
        this.data.set(name, new TextDataAttribute(item, name, this.uiPrefix, value));
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
        this.value = value ? value : undefined;
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
            case "edit":
                this.editData();
                break;
            default:
                throw "Unexpected operation: " + operation;
        }
        this.updateUI();
    }

    updateUI() {
        this.item.updateSvgUI();

        const label = document.getElementById(this.uiPrefix + this.name);
        if (!label) {
            console.trace("Could not find id " + this.uiPrefix + this.name);
            return;
        }

        if (!label.type) {
            label.innerHTML = this.value === undefined ? "<div title='Icon default'>Id</div>" : this.value;
        } else {
            label.value = this.value === undefined ? "" : this.value;
        }
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

class TextDataAttribute extends Attribute {

    constructor(item, name, uiPrefix, value) {
        super(item, name, uiPrefix);
        this.value = value ? value : undefined;
    }

    copy(source) {
        this.value = source.value;
    }

    updateUI() {
        this.item.updateSvgUI();
    }

    editData() {
        this.item.editFunction(this.value, (data) => {
            this.value = data;
            this.updateUI();
        });
    }

}

/**
 * Most functions work with the 8x8 grid shown on the background image rather than pixels.
 * This constant defines how many pixels there are per grid cell.
 */
const PIXELS_PER_CELL = 50;

const DEFAULT_SVG_STYLE = "stroke: black; stroke-width: 20px; stroke-linecap: round; fill: none;"
const ROUND_CORNER_MARGIN = 10;
const PADDING_MARGIN = 20;

const DEFAULT_X_COORD = -ROUND_CORNER_MARGIN;
const DEFAULT_Y_COORD = -ROUND_CORNER_MARGIN;

var shapeIdCounter = 0;
var shapes = new Map();
var selectedUIShape = null;
var isDragging = false;
var dragOffsetX, dragOffsetY;


/**
 * Adds a line to the icon. 
 * 
 * @param {number} dx how many cells the line should cover horizontally.
 * @param {number} dy how many cells the line should cover vertically.
 */
function addLine(dx, dy) {
    const x = dx * PIXELS_PER_CELL + ROUND_CORNER_MARGIN * 2;
    const y = dy * PIXELS_PER_CELL + ROUND_CORNER_MARGIN * 2;

    const width = dx * PIXELS_PER_CELL;
    const height = dy * PIXELS_PER_CELL;

    const line = new Line(0, 0, width, height, null);
    addShape(line);
}

/**
 * Adds a circle to the icon.
 * 
 * @param {number} diameter diameter of circle in cells 
 */
function addCircle(diameter, fill) {
    diameter = diameter * PIXELS_PER_CELL;
    const circle = new Circle(0, 0, diameter, null, fill);
    addShape(circle);
}

function getIconImage() {
    return document.getElementById('workarea');
}

function addShape(shape) {
    if (shapes.has(shape.id)) {
        throw "Duplicate id when adding shape";
    }

    shapes.set(shape.id, shape);

    const element = shape.toDraggableHTMLElement();
    getIconImage().appendChild(element);
    selectShape(element);
}

function deleteCurrentlySelectedShape() {
    if (selectedUIShape) {
        shapes.delete(selectedUIShape.id);
        getIconImage().removeChild(selectedUIShape);
        unselectCurrentlySelectedShape();
    }
}

function selectShape(shape) {
    if (shape != selectedUIShape) {
        unselectCurrentlySelectedShape();
        shape.classList.add('selected-shape');
        selectedUIShape = shape;
        showAttributesOfCurrentlySelectedShape();
    }
}

function unselectCurrentlySelectedShape() {
    if (selectedUIShape) {
        selectedUIShape.classList.remove('selected-shape');
        selectedUIShape = null;
        hideAllShapeAttributes();
    }
}

function getSelectedShapeNodel() {
    if (!selectedUIShape) {
        throw "No UI shape selected";
    }

    return shapes.get(selectedUIShape.id);
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

function addClass(elements, className) {
    for (const element of elements) {
        element.classList.add(className);
    }
}

function removeClass(elements, className) {
    for (const element of elements) {
        element.classList.remove(className);
    }
}

/*
    Drag'n drop of shapes
*/

function selectShapeOnMouseDown(event) {
    let shape = event.target;
    while (!shape.classList.contains('shape-container')) {
        shape = shape.parentElement;
    }
    selectShape(shape);
}

function startDraggingShape(event) {
    isDragging = true;
    dragOffsetX = event.offsetX;
    dragOffsetY = event.offsetY;
}

function dropDraggedShape(event) {
    if (isDragging) {
        event.preventDefault();

        const x = Math.floor((event.offsetX - dragOffsetX + PIXELS_PER_CELL / 2) / PIXELS_PER_CELL) * PIXELS_PER_CELL - ROUND_CORNER_MARGIN + PADDING_MARGIN;
        const y = Math.floor((event.offsetY - dragOffsetY + PIXELS_PER_CELL / 2) / PIXELS_PER_CELL) * PIXELS_PER_CELL - ROUND_CORNER_MARGIN + PADDING_MARGIN;
        selectedUIShape.style.top = y + "px";
        selectedUIShape.style.left = x + "px";

        isDragging = false;
    }
}

function allowDrop(event) {
    event.preventDefault();
}



/*
    Dialogs
*/

function openDialog(id) {
    const dialog = document.getElementById(id);
    dialog.style.display = "grid";
}

function closeDialog(id) {
    const dialog = document.getElementById(id);
    dialog.style.display = "none";
}

/* 
    Shape types
*/

class Shape {
    constructor(type, top, left, width, height, stroke) {
        this.type = type;
        this.id = "shape" + (++shapeIdCounter);
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
        this.stroke = stroke;
    }

    get attributeClass() {
        return this.type+"-attribute";
    }

    toDraggableHTMLElement() {
        const div = document.createElement("div");
        div.classList.add("shape-container");
        div.style.top = `${DEFAULT_X_COORD + PADDING_MARGIN}px`;
        div.style.left = `${DEFAULT_Y_COORD + PADDING_MARGIN}px`;

        div.setAttribute("id", this.id);
        div.setAttribute("draggable", "true");
        div.addEventListener("mousedown", selectShapeOnMouseDown);
        div.addEventListener("dragstart", startDraggingShape);
        div.appendChild(this.toSVGImage());

        return div;
    }

    toSVGImage() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('style', DEFAULT_SVG_STYLE);
        svg.setAttribute("width", this.width + ROUND_CORNER_MARGIN * 2);
        svg.setAttribute("height", this.height + ROUND_CORNER_MARGIN * 2);
        svg.appendChild(this.toSVGFragment());
        return svg;
    }

    toSVGFragment() {
        return document.createElementNS('http://www.w3.org/2000/svg', this.type);
    }

}

class FilledShape extends Shape {
    constructor(type, top, left, width, height, stroke, fill) {
        super(type, top, left, width, height, stroke);
        this.fill = fill;
    }

    toSVGFragment() {
        const fragment = super.toSVGFragment();
        if (this.fill) {
            // TODO: will remove any other style on the fragment
            fragment.setAttribute('style', "fill: black;");
        }
        return fragment;

    }
}

class Line extends Shape {
    /**
     * 
     * @param {string} id 
     * @param {number} top 
     * @param {number} left 
     * @param {number} width 
     * @param {number} height 
     * @param {number} stroke 
     */
    constructor(top, left, width, height, stroke) {
        super("line", top, left, width, height, stroke);
    }

    toSVGFragment() {
        const fragment = super.toSVGFragment();
        fragment.setAttribute('x1', this.left + ROUND_CORNER_MARGIN);
        fragment.setAttribute('y1', this.top + ROUND_CORNER_MARGIN);
        fragment.setAttribute('x2', this.left + this.width + ROUND_CORNER_MARGIN);
        fragment.setAttribute('y2', this.top + this.height + ROUND_CORNER_MARGIN);
        return fragment;
    }
}

class Circle extends FilledShape {
    /**
      * 
      * @param {string} id 
      * @param {number} top 
      * @param {number} left 
      * @param {number} diameter 
      * @param {number} stroke 
      */
    constructor(top, left, diameter, stroke, fill) {
        super("circle", top, left, diameter, diameter, stroke, fill);
    }

    get centerX() {
        return this.top + this.radius;
    }

    get centerY() {
        return this.top + this.radius;
    }

    get radius() {
        return this.width / 2;
    }

    toSVGFragment() {
        const fragment = super.toSVGFragment();
        fragment.setAttribute('cx', this.centerX + ROUND_CORNER_MARGIN);
        fragment.setAttribute('cy', this.centerY + ROUND_CORNER_MARGIN);
        fragment.setAttribute('r', this.radius);
        return fragment;
    }
}
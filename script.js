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

    const svg = new Line("lineid", 0, 0, width, height, null);
    addSVGShape(svg);
}

/**
 * Adds a circle to the icon.
 * 
 * @param {number} diameter diameter of circle in cells 
 */
function addCircle(diameter) {
    diameter = diameter * PIXELS_PER_CELL;
    const svg = new Circle("circleid", 0, 0, diameter, null);
    addSVGShape(svg);
}

function addSVGShape(svg) {
    const div = document.createElement("div");
    div.classList.add("shape-container");
    div.style.top = `${DEFAULT_X_COORD + PADDING_MARGIN}px`;
    div.style.left = `${DEFAULT_Y_COORD + PADDING_MARGIN}px`;

    div.setAttribute("draggable", "true");
    div.addEventListener("mousedown", selectShapeOnMouseDown);
    div.addEventListener("dragstart", startDraggingShape);
    div.appendChild(svg.toSVGImage());

    const image = document.getElementById('workarea');
    image.appendChild(div);

    selectShape(div);
}

function allowDrop(event) {
    event.preventDefault();
}

var selectedShape = null;
var isDragging = false;
var dragOffsetX, dragOffsetY;

function selectShape(shape) {
    if (shape != selectedShape) {
        unselectCurrentlySelectedShape();
        shape.classList.add('selected-shape');
        selectedShape = shape;
        showAttributesOfCurrentlySelectedShape();
    }
}

function unselectCurrentlySelectedShape() {
    if (selectedShape) {
        selectedShape.classList.remove('selected-shape');
        selectedShape = null;
        hideAllShapeAttributes();
    }
}

function showAttributesOfCurrentlySelectedShape() {

}

function hideAllShapeAttributes() {

}

function selectShapeOnMouseDown(event) {
    let shape = event.target;
    while (!shape.classList.contains('shape-container')) {
        shape = shape.parentElement;
    }
    selectShape(shape);
}

function startDraggingShape(event) {
    console.log("startdrag " + event.target)
    isDragging = true;
    dragOffsetX = event.offsetX;
    dragOffsetY = event.offsetY;
}

function dropDraggedShape(event) {
    if (isDragging) {
        console.log("enddrag")
        event.preventDefault();

        const x = Math.floor((event.offsetX - dragOffsetX + PIXELS_PER_CELL / 2) / PIXELS_PER_CELL) * PIXELS_PER_CELL - ROUND_CORNER_MARGIN + PADDING_MARGIN;
        const y = Math.floor((event.offsetY - dragOffsetY + PIXELS_PER_CELL / 2) / PIXELS_PER_CELL) * PIXELS_PER_CELL - ROUND_CORNER_MARGIN + PADDING_MARGIN;
        selectedShape.style.top = y + "px";
        selectedShape.style.left = x + "px";

        isDragging = false;
    }
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
    constructor(cssClassId, id, top, left, width, height, stroke) {
        this.cssClassId = cssClassId;
        this.id = id;
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
        this.stroke = stroke;
        this.toSVGImage = () => {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute("width", this.width + ROUND_CORNER_MARGIN * 2);
            svg.setAttribute("height", this.height + ROUND_CORNER_MARGIN * 2);
            svg.appendChild(this.toSVGFragment());
            return svg;
        }
        this.toSVGFragment = () => {
            throw "Nothing to generate SVG fragment from";
        }
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
    constructor(id, top, left, width, height, stroke) {
        super("shape-line", id, top, left, width, height, stroke);

        this.toSVGFragment = () => {
            const fragment = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            fragment.setAttribute('style', DEFAULT_SVG_STYLE);
            fragment.setAttribute('x1', this.left + ROUND_CORNER_MARGIN);
            fragment.setAttribute('y1', this.top + ROUND_CORNER_MARGIN);
            fragment.setAttribute('x2', this.left + this.width + ROUND_CORNER_MARGIN);
            fragment.setAttribute('y2', this.top + this.height + ROUND_CORNER_MARGIN);
            return fragment;
        }
    }
}

class Circle extends Shape {
    /**
      * 
      * @param {string} id 
      * @param {number} top 
      * @param {number} left 
      * @param {number} diameter 
      * @param {number} stroke 
      */
    constructor(id, top, left, diameter, stroke) {
        super("shape-circle", id, top, left, diameter, diameter, stroke);

        this.toSVGFragment = () => {
            const fragment = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            fragment.setAttribute('style', DEFAULT_SVG_STYLE);
            fragment.setAttribute('cx', this.centerX + ROUND_CORNER_MARGIN);
            fragment.setAttribute('cy', this.centerY + ROUND_CORNER_MARGIN);
            fragment.setAttribute('r', this.radius);
            return fragment;
        }
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
}
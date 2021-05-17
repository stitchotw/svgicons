const DEFAULT_SVG_STYLE = "stroke: black; stroke-width: 20px; stroke-linecap: round; fill: none;"

/*
const ROUND_CORNER_MARGIN = 10;
const PADDING_MARGIN = 20;

const DEFAULT_X_COORD = -ROUND_CORNER_MARGIN;
const DEFAULT_Y_COORD = -ROUND_CORNER_MARGIN;
*/

var shapeIdCounter = 0;
var shapes = new Map();
var selectedUIShape = null;
var canStartDragging = false;
var isDragging = false;
var dragOffsetX, dragOffsetY;

function setup() {
    addEventListeners();
    makeSVGDraggable();
}

function addEventListeners() {
    // Work area
    document.getElementById("workarea").addEventListener("drop", dropDraggedShape);
    document.getElementById("workarea").addEventListener("dragover", allowDrop);

    // Current shape
    document.getElementById("delete-selected-shape-button").addEventListener("click", deleteCurrentlySelectedShape);

    // Open dialogs
    document.getElementById("save-icon-button").addEventListener("click", (event) => openDialog("save-icon-dialog", updateIconToSave));
    document.getElementById("new-icon-button").addEventListener("click", (event) => openDialog("new-icon-dialog"));
    document.getElementById("settings-button").addEventListener("click", (event) => openDialog("settings-dialog"));
    document.getElementById("help-button").addEventListener("click", (event) => openDialog("help-dialog"));

    // Close dialogs
    document.getElementById("close-save-icon-dialog-button").addEventListener("click", (event) => closeDialog("save-icon-dialog"));
    document.getElementById("close-new-icon-dialog-button").addEventListener("click", (event) => closeDialog("new-icon-dialog"));
    document.getElementById("close-settings-dialog-button").addEventListener("click", (event) => closeDialog("settings-dialog"));
    document.getElementById("close-help-dialog-button").addEventListener("click", (event) => closeDialog("help-dialog"));
}

/*
    Drag'n drop of shapes
    Based on https://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/
*/

function makeSVGDraggable() {
    var svg = getWorkArea();
    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('mousemove', drag);
    svg.addEventListener('mouseup', endDrag);
    svg.addEventListener('mouseleave', endDrag);

    var selectedElement = null;
    var offset;

    function startDrag(evt) {
        if (evt.target.classList.contains('draggable')) {
            selectedElement = evt.target;
            offset = getMousePosition(evt);
            offset.x -= parseFloat(selectedElement.getAttributeNS(null, "x"));
            offset.y -= parseFloat(selectedElement.getAttributeNS(null, "y"));
        }
    }

    function getMousePosition(evt) {
        var CTM = svg.getScreenCTM();
        return {
            x: (evt.clientX - CTM.e) / CTM.a,
            y: (evt.clientY - CTM.f) / CTM.d
        };
    }

    function getNewPosition(evt){
        var pos = getMousePosition(evt);
        pos.x = Math.round(pos.x - offset.x);
        pos.y = Math.round(pos.y - offset.y);
        return pos;
    }

    function drag(evt) {
        if (selectedElement) {
            evt.preventDefault();
            var pos = getNewPosition(evt);

            selectedElement.setAttributeNS(null, "x", pos.x );
            selectedElement.setAttributeNS(null, "y", pos.y );
        }
    }

    function endDrag(evt) {
        selectedElement = null;
    }
}



function getNewSVGElement(width, height) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('style', DEFAULT_SVG_STYLE);
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    return svg;
}

function getIconAsSVGImage() {
    const svg = getNewSVGElement(400, 400);
    for (const [id, shape] of shapes) {
        console.log(shape);
        svg.appendChild(shape.toSVGFragment());
    }
    return svg;
}

/**
 * Adds a line to the icon. 
 * 
 * @param {number} dx how many cells the line should cover horizontally.
 * @param {number} dy how many cells the line should cover vertically.
 */
function addLine(dx, dy, leftToRight) {
    const line = new Line(0, 0, dx * 10, dy * 10, leftToRight, null);
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

function addRectangle(x, y, width, height) {
    const rectangle = new Rectangle(x, y, width, height);
    addShape(rectangle);
}

function getWorkArea() {
    return document.getElementById('workarea');
}

function addShape(shape) {
    if (shapes.has(shape.id)) {
        throw "Duplicate id when adding shape";
    }

    shapes.set(shape.id, shape);

    const element = shape.toSVGFragment();
    getWorkArea().appendChild(element);
    selectShape(element);
}

function deleteCurrentlySelectedShape() {
    if (selectedUIShape) {
        shapes.delete(selectedUIShape.id);
        getWorkArea().removeChild(selectedUIShape);
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



function selectShapeOnMouseDown(event) {
    // console.log("Mouse down: " + event.target);
    // console.log(event.target instanceof SVGSVGElement);

    // Do nothing if outside of actual shape
    if (event.target instanceof SVGSVGElement)
        return;

    let shape = event.target;
    while (!shape.classList.contains('shape-container')) {
        shape = shape.parentElement;
    }
    selectShape(shape);
    canStartDragging = true;
}

function mouseup(event) {
    // console.log("Mouse up: " + event.target);
    canStartDragging = false;
}

function startDraggingShape(event) {
    // console.log("Start: " + event.target);
    if (canStartDragging) {
        isDragging = true;
        dragOffsetX = event.offsetX;
        dragOffsetY = event.offsetY;
    } else {
        event.preventDefault();
    }
}

function dropDraggedShape(event) {
    // console.log("Drop: " + event.target);
    if (isDragging) {
        event.preventDefault();

        const x = Math.floor((event.offsetX - dragOffsetX + PIXELS_PER_CELL / 2) / PIXELS_PER_CELL) * PIXELS_PER_CELL - ROUND_CORNER_MARGIN + PADDING_MARGIN;
        const y = Math.floor((event.offsetY - dragOffsetY + PIXELS_PER_CELL / 2) / PIXELS_PER_CELL) * PIXELS_PER_CELL - ROUND_CORNER_MARGIN + PADDING_MARGIN;
        selectedUIShape.style.top = y + "px";
        selectedUIShape.style.left = x + "px";

        isDragging = false;
        canStartDragging = false;
    }
}

function allowDrop(event) {
    if (isDragging) {
        event.preventDefault();
    }
}



/*
    Dialogs
*/

function openDialog(id, onOpenDialog) {
    if (onOpenDialog)
        onOpenDialog();

    const dialog = document.getElementById(id);
    dialog.style.display = "grid";
}

function closeDialog(id) {
    const dialog = document.getElementById(id);
    dialog.style.display = "none";
}

function updateIconToSave() {
    const container = document.getElementById("icon-to-save");
    container.replaceChildren(getIconAsSVGImage());
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
        return this.type + "-attribute";
    }
    /*
        toDraggableHTMLElement() {
            const div = document.createElement("div");
            div.classList.add("shape-container");
            div.style.top = `${DEFAULT_X_COORD + PADDING_MARGIN}px`;
            div.style.left = `${DEFAULT_Y_COORD + PADDING_MARGIN}px`;
    
            div.setAttribute("id", this.id);
            div.setAttribute("draggable", "true");
            div.addEventListener("dragstart", startDraggingShape);
            div.addEventListener("mousedown", selectShapeOnMouseDown);
            div.addEventListener("mouseup", mouseup);
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
    */
    toSVGFragment() {
        const fragment = document.createElementNS('http://www.w3.org/2000/svg', this.type);
        fragment.setAttribute("id", this.id);
        fragment.classList.add("draggable");
        return fragment;
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
     * @param {number} top 
     * @param {number} left 
     * @param {number} width 
     * @param {number} height 
     * @param {boolean} leftToRight
     * @param {number} stroke 
     */
    constructor(top, left, width, height, leftToRight, stroke) {
        super("line", top, left, width, height, stroke);
        this.leftToRight = leftToRight;
    }

    toSVGFragment() {
        const fragment = super.toSVGFragment();
        if (this.leftToRight) {
            fragment.setAttribute('x1', this.left);
            fragment.setAttribute('x2', this.left + this.width);
        } else {
            fragment.setAttribute('x2', this.left);
            fragment.setAttribute('x1', this.left + this.width);
        }
        fragment.setAttribute('y1', this.top);
        fragment.setAttribute('y2', this.top + this.height);
        return fragment;
    }
}

class Circle extends FilledShape {
    /**
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

class Rectangle extends FilledShape {
    constructor(x, y, width, height) {
        super("rect");
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    toSVGFragment() {
        const fragment = super.toSVGFragment();
        fragment.setAttribute("x", this.x);
        fragment.setAttribute("y", this.y);
        fragment.setAttribute("width", this.width);
        fragment.setAttribute("height", this.height);
        return fragment;
    }
}
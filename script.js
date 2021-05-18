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
    addBackgroundToWorkarea();
    makeWorkareaDraggable();
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

function addBackgroundToWorkarea() {

}

/*
    Drag'n drop of shapes
    Based on https://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/
*/

function makeWorkareaDraggable() {
    var svg = getWorkArea();
    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('mousemove', drag);
    svg.addEventListener('mouseup', endDrag);
    svg.addEventListener('mouseleave', endDrag);

    var selectedElement = null;
    var offset;
    var transform;

    function startDrag(evt) {
        if (evt.target.classList.contains('draggable')) {
            selectedElement = evt.target;

            // TODO: not a good place for it, this is getting convoluted,
            // especially since we have two representations of the selected
            // shape.
            selectShape(selectedElement);

            var transforms = selectedElement.transform.baseVal;
            transform = transforms.getItem(0);

            offset = getMousePosition(evt);
            offset.x -= transform.matrix.e;
            offset.y -= transform.matrix.f;
        }
    }

    function getMousePosition(evt) {
        var CTM = svg.getScreenCTM();
        return {
            x: (evt.clientX - CTM.e) / CTM.a,
            y: (evt.clientY - CTM.f) / CTM.d
        };
    }

    function getNewPosition(evt) {
        var pos = getMousePosition(evt);
        pos.x = Math.round(pos.x - offset.x);
        pos.y = Math.round(pos.y - offset.y);
        return pos;
    }

    function drag(evt) {
        if (selectedElement) {
            evt.preventDefault();

            var coord = getMousePosition(evt);
            transform.setTranslate(Math.round(coord.x - offset.x), Math.round(coord.y - offset.y));

            //            selectedElement.setAttribute("x", Math.round(coord.x - offset.x));
            /*            
                        var pos = getNewPosition(evt);
                        transform.setTranslate(pos.x - offset.x, pos.y - offset.y);
                        */
        }
    }

    function endDrag(evt) {
        selectedElement = null;
        offset = null;
        transform = null;
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
 */
function addLine(x1, y1, x2, y2) {
    const line = new Line(x1, y1, x2, y2);
    addShape(line);
}

/**
 * Adds a circle to the icon.
 */
function addCircle(cx, cy, r, filled) {
    const circle = new Circle(cx, cy, r, filled);
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
    const svg = getWorkArea();
    svg.appendChild(element);
    const translate = svg.createSVGTransform();
    translate.setTranslate(0, 0);
    element.transform.baseVal.insertItemBefore(translate, 0);
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
    constructor(type) {
        this.type = type;
        this.id = "shape" + (++shapeIdCounter);
    }

    get attributeClass() {
        return this.type + "-attribute";
    }

    toSVGFragment() {
        const fragment = document.createElementNS('http://www.w3.org/2000/svg', this.type);
        fragment.setAttribute("id", this.id);
        fragment.classList.add("draggable");
        return fragment;
    }

}

class FilledShape extends Shape {
    constructor(type, filled) {
        super(type);
        this.filled = filled;
    }

    toSVGFragment() {
        const fragment = super.toSVGFragment();
        if (this.filled) {
            // TODO: will remove any other style on the fragment
            fragment.setAttribute('style', "fill: black;");
        }
        return fragment;

    }
}

class Line extends Shape {

    constructor(x1, y1, x2, y2) {
        super("line");

        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    toSVGFragment() {
        const fragment = super.toSVGFragment();
        fragment.setAttribute('x1', this.x1);
        fragment.setAttribute('y1', this.y1);
        fragment.setAttribute('x2', this.x2);
        fragment.setAttribute('y2', this.y2);
        return fragment;
    }
}

class Circle extends FilledShape {
    constructor(cx, cy, r, filled) {
        super("circle", filled);
        this.cx = cx;
        this.cy = cy;
        this.r = r;
    }

    toSVGFragment() {
        const fragment = super.toSVGFragment();
        fragment.setAttribute('cx', this.cx);
        fragment.setAttribute('cy', this.cy);
        fragment.setAttribute('r', this.r);
        return fragment;
    }
}

class Rectangle extends FilledShape {
    constructor(x, y, width, height, filled) {
        super("rect", filled);
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
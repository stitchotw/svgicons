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

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute("width", `${x}`);
    svg.setAttribute("height", `${y}`);

    const shape = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    shape.setAttribute('style', DEFAULT_SVG_STYLE);
    shape.setAttribute('x1', ROUND_CORNER_MARGIN);
    shape.setAttribute('y1', ROUND_CORNER_MARGIN);
    shape.setAttribute('x2', `${x - ROUND_CORNER_MARGIN}`);
    shape.setAttribute('y2', `${y - ROUND_CORNER_MARGIN}`);
    svg.appendChild(shape);

    addSVGShape(svg);
}

/**
 * Adds a circle to the icon.
 * 
 * @param {number} d diameter of circle in cells 
 */
function addCircle(d) {
    const size = d * PIXELS_PER_CELL + ROUND_CORNER_MARGIN * 2;
    const center = size / 2;
    const radius = size / 2 - ROUND_CORNER_MARGIN;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute("width", `${size}`);
    svg.setAttribute("height", `${size}`);

    const shape = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    shape.setAttribute('style', DEFAULT_SVG_STYLE);
    shape.setAttribute('cx', center);
    shape.setAttribute('cy', center);
    shape.setAttribute('r', `${radius}`);
    svg.appendChild(shape);

    addSVGShape(svg);
}

function addSVGShape(svg) {
    const div = document.createElement("div");
    div.classList.add("shape-container");
    div.style.top = `${DEFAULT_X_COORD + PADDING_MARGIN}px`;
    div.style.left = `${DEFAULT_Y_COORD + PADDING_MARGIN}px`;

    div.setAttribute("draggable", "true");
    div.addEventListener("mousedown", selectShape);
    div.addEventListener("dragstart", startDraggingShape);
    div.appendChild(svg);

    const image = document.getElementById('workarea');
    image.appendChild(div);
}

function allowDrop(event) {
    event.preventDefault();
}

var selectedShape = null;
var isDragging = false;
var dragOffsetX, dragOffsetY;

function selectShape(event) {
    if (selectedShape) {
        selectedShape.classList.remove('selected-shape');
    }

    selectedShape = event.target;
    while (!selectedShape.classList.contains('shape-container')) {
        selectedShape = selectedShape.parentElement;
    }

    selectedShape.classList.add('selected-shape');
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


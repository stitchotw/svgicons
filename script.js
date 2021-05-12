/**
 * Most functions work with the 8x8 grid shown on the background image rather than pixels.
 * This constant defines how many pixels there are per gric cell.
 */
const PIXELS_PER_CELL = 50;

const DEFAULT_SVG_STYLE = "stroke: black; stroke-width: 20px; stroke-linecap: round; fill: none;"
const ROUND_CORNER_MARGIN = 10;

const DEFAULT_X_COORD = -ROUND_CORNER_MARGIN;
const DEFAULT_Y_COORD = -ROUND_CORNER_MARGIN;

/**
 * Adds a line to the icon. 
 * 
 * @param {number} dx how many cells the line should cover horizontally.
 * @param {number} dy how many cells the line should cover vertically.
 */
function addLine(dx, dy) {
    console.log(`Adding line: dx=${dx} dy=${dy}`);

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

function addSVGShape(svg) {
    const div = document.createElement("div");
    div.classList.add("shape-container");
    div.style.top = `${DEFAULT_X_COORD}px`;
    div.style.left = `${DEFAULT_Y_COORD}px`;

    div.setAttribute("draggable", "true");
    div.addEventListener("dragstart", dragIt);
    div.appendChild(svg);

    const image = document.getElementById('workarea');
    image.appendChild(div);
}

function allowDrop(ev) {
    console.log("allowDrop");
    ev.preventDefault();
}

var draggedShape;
var dx, dy;

function dragIt(ev) {
    //ev.dataTransfer.setData("text", ev.target.id);
    draggedShape = ev.target;
    dx = ev.offsetX;
    dy = ev.offsetY;
    console.log(ev);
}

function drop(ev) {
    //console.log("drop");
    //console.log(ev);
    ev.preventDefault();

    const x = Math.floor((ev.clientX - dx + PIXELS_PER_CELL / 2) / PIXELS_PER_CELL) * PIXELS_PER_CELL;
    const y = Math.floor((ev.clientY - dy + PIXELS_PER_CELL / 2) / PIXELS_PER_CELL) * PIXELS_PER_CELL;
    draggedShape.style.top = y + "px";
    draggedShape.style.left = x + "px";
}
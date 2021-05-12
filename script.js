/**
 * Most functions work with the 8x8 grid shown on the background image rather than pixels.
 * This constant defines how many pixels there are per gric cell.
 */
const PIXELS_PER_CELL = 50;

const DEFAULT_SVG_STYLE = "stroke: black; stroke-width: 20px; stroke-linecap: round; fill: none;"
const ROUND_CORNER_MARGIN = 10;

const DEFAULT_X_COORD = 100;
const DEFAULT_Y_COORD = 50;

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

    svg.style.top = `${DEFAULT_X_COORD}px`;
    svg.style.left = `${DEFAULT_Y_COORD}px`;

    addSVGShape(svg);
}

function addSVGShape(svg) {
    const image = document.getElementById('workarea');
    image.appendChild(svg);
}
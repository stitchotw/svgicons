/*
 * 
 */
import { Line, Circle, Rectangle } from './shapes.mjs';
import { addUIShape } from './workarea.mjs';


const DEFAULT_SVG_STYLE = "stroke: black; stroke-width: 1px; stroke-linecap: round; fill: none;"

let shapes = new Map();
// let lastMovedShape = new Line(0, 0, 0, 0);


export function getIconAsSVGImage() {
    const svg = getNewSVGElement(32, 32);
    for (const [id, shape] of shapes) {
        svg.appendChild(shape.svgShape());
    }
    return svg;
}


function getNewSVGElement(width, height) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('style', DEFAULT_SVG_STYLE);
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    return svg;
}


export function transformShape(shapeId, transform) {

}

export function shapeFromId(id) {
    return shapes.get(id);
}

function addShape(shape) {
    if (shapes.has(shape.id)) {
        throw "Duplicate id when adding shape: " + shape.id;
    }

    shapes.set(shape.id, shape);
    addUIShape(shape);
}

export function deleteShapeById(id) {
    shapes.delete(id);
}

/**
 * Adds a line to the icon. 
 */
export function addLine(x1, y1, x2, y2) {
    const line = new Line(x1, y1, x2, y2);
    addShape(line);
}

/**
 * Adds a circle to the icon.
 */
export function addCircle(cx, cy, r, filled) {
    const circle = new Circle(cx, cy, r, filled);
    addShape(circle);
}

export function addRectangle(x, y, width, height, filled) {
    const rectangle = new Rectangle(x, y, width, height, filled);
    addShape(rectangle);
}

/*
export function moveShape(id, dx, dy) {
    const shape = id === lastMovedShape.id ? lastMovedShape : shapeFromId(id);
    shape.move(dx, dy);
    lastMovedShape = shape;
}
*/

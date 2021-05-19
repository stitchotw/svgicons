/*
 * 
 */

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

function addRectangle(x, y, width, height, filled) {
    const rectangle = new Rectangle(x, y, width, height, filled);
    addShape(rectangle);
}

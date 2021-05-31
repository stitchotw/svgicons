/*
 * 
 */
import { Line, Circle, Rectangle } from './shapes.mjs';
import { addUIShape } from './workarea.mjs';


const DEFAULT_SVG_STYLE = "stroke: black; stroke-width: 3; stroke-linecap: round; fill: none;"

class Icon {

    constructor(width, height) {
        this.shapes = new Map();
    }

    isEmpty() {
        return this.shapes.size === 0;
    }

    getAsSVGImage() {
        const svg = this.getNewSVGElement(32, 32);
        for (const [_, shape] of this.shapes) {
            svg.appendChild(shape.createNewSvgShape());
        }
        return svg;
    }

    getNewSVGElement(width, height) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('style', DEFAULT_SVG_STYLE);
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
        svg.setAttribute('xmlns', "http://www.w3.org/2000/svg");
        return svg;
    }

    shapeFromId(id) {
        return this.shapes.get(id);
    }

    addShape(shape) {
        if (this.shapes.has(shape.id)) {
            throw "Duplicate id when adding shape: " + shape.id;
        }

        this.shapes.set(shape.id, shape);
        addUIShape(shape);
    }

    deleteShapeById(id) {
        this.shapes.delete(id);
    }

    /**
     * Adds a line to the icon. 
     */
    addLine(x1, y1, x2, y2) {
        const line = new Line(x1, y1, x2, y2);
        this.addShape(line);
    }

    /**
     * Adds a circle to the icon.
     */
    addCircle(cx, cy, r, filled) {
        const circle = new Circle(cx, cy, r, filled);
        this.addShape(circle);
    }

    addRectangle(x, y, width, height, filled) {
        const rectangle = new Rectangle(x, y, width, height, filled);
        this.addShape(rectangle);
    }

}

export const icon = new Icon(32, 32);


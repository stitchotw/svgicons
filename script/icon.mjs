/*
 * 
 */
import { Line, Circle, Rectangle } from './shapes.mjs';
import { SVGData } from "./attributes.mjs";
import { addUIShape } from './workarea.mjs';
import { Text } from './shapes.mjs';

const DEFAULT_STROKE_WIDTH = 3;

class Icon {

    constructor(width, height) {
        this.shapes = new Map();
        this.style = new SVGData("icon-style-attribute-");

        this.style.addText(null, "stroke", "black");
        this.style.addNumeric(null, "stroke-width", DEFAULT_STROKE_WIDTH);
        this.style.addText(null, "stroke-linecap", "round");
        this.style.addText(null, "fill", "none");
    }

    isEmpty() {
        return this.shapes.size === 0;
    }

    /* Style attributes */

    get svgStyle() {
        return this.style;
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
        console.log(this.style)
        console.log(this.style.asText(null))
        svg.setAttribute('style', this.style.asText());
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
        const shape = new Line(this, x1, y1, x2, y2);
        this.addShape(shape);
    }

    /**
     * Adds a circle to the icon.
     */
    addCircle(cx, cy, r, filled) {
        const shape = new Circle(this, cx, cy, r, filled);
        this.addShape(shape);
    }

    addRectangle(x, y, width, height, filled) {
        const shape = new Rectangle(this, x, y, width, height, filled);
        this.addShape(shape);
    }

    addText(text) {
        const shape = new Text(this, text, 16, 16);
        this.addShape(shape);
    }

}

export const icon = new Icon(32, 32);


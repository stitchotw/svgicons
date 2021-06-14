/*
 * 
 */
import { Line, Circle, Rectangle } from './shapes.mjs';
import { SVGData } from "./attributes.mjs";
import { addUIShape, updateSvgStyle } from './workarea.mjs';
import { Text } from './shapes.mjs';
import { Polyline } from './shapes.mjs';
import { Polygon } from './shapes.mjs';
import { Path } from './shapes.mjs';
import { Ellipse } from './shapes.mjs';

const DEFAULT_STROKE_WIDTH = 3;

class Icon {

    constructor(width, height) {
        this.shapes = new Map();
        this.style = new SVGData("icon-style-attribute-");

        this.style.addText(this, "stroke", "Black");
        this.style.addNumeric(this, "stroke-width", DEFAULT_STROKE_WIDTH, 1);
        this.style.addText(this, "stroke-linecap", "round");
        this.style.addText(this, "fill", "none");
    }

    get asObject() {
        const obj = new Object();

        obj.style = this.style.asObject;
        obj.shapes = [];

        this.shapes.forEach((shape, id) => {
            obj.shapes.push(shape.asObject);
        });

        return obj;
    }

    isEmpty() {
        return this.shapes.size === 0;
    }

    clear() {
        for (const [id, shape] of this.shapes) {
            this.deleteShapeById(id);
            // TODO: should probably be a method in workarea
            var element = document.getElementById(id);
            element.parentNode.removeChild(element);
        }
    }

    /* Style attributes */

    updateUI() {
        this.style.updateUI();
    }

    updateSvgUI() {
        updateSvgStyle();
    }

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
        svg.setAttribute('style', this.style.asSvgStyle);
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
        svg.setAttribute('xmlns', "http://www.w3.org/2000/svg");
        return svg;
    }

    shapeFromId(id) {
        return this.shapes.get(id);
    }

    copyShapeById(id) {
        const original = this.shapeFromId(id);
        const copy = original.copy();
        this.addShape(copy);
        // Attempt to move the shape slightly down to the right to make it stand out
        // Won't work for complex shapes since they have a fixed position
        copy.move(1, 1);
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

    addLine(x1, y1, x2, y2) {
        const shape = new Line(x1, y1, x2, y2);
        this.addShape(shape);
    }

    addCircle(cx, cy, r, filled) {
        const shape = new Circle(cx, cy, r, filled);
        this.addShape(shape);
    }

    addEllipse(cx, cy, rx, ry, filled) {
        const shape = new Ellipse(cx, cy, rx, ry, filled);
        this.addShape(shape);
    }

    addRectangle(x, y, width, height, filled) {
        const shape = new Rectangle(x, y, width, height, filled);
        this.addShape(shape);
    }

    addText(text) {
        const shape = new Text(text, 16, 16);
        this.addShape(shape);
    }

    addPolyline(data) {
        const shape = new Polyline(data);
        this.addShape(shape);
    }

    addPolygon(data) {
        const shape = new Polygon(data);
        this.addShape(shape);
    }

    addPath(data) {
        const shape = new Path(data);
        this.addShape(shape);
    }

}

export const icon = new Icon(32, 32);


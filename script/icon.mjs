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

const DEFAULT_STROKE = "Black";
const DEFAULT_STROKE_WIDTH = 3;
const DEFAULT_STROKE_LINECAP = "round";
const DEFAULT_FILL = "none";

class Icon {

    constructor(width, height) {
        this.shapes = new Map();
        this.style = new SVGData("icon-style-attribute-");

        this.style.addText(this, "stroke", DEFAULT_STROKE);
        this.style.addNumeric(this, "stroke-width", DEFAULT_STROKE_WIDTH, 1);
        this.style.addText(this, "stroke-linecap", DEFAULT_STROKE_LINECAP);
        this.style.addText(this, "fill", DEFAULT_FILL);
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

    resetStyleToDefault() {
        this.style.get("stroke").value = DEFAULT_STROKE;
        this.style.get("stroke-width").value = DEFAULT_STROKE_WIDTH;
        this.style.get("stroke-linecap").value = DEFAULT_STROKE_LINECAP;
        this.style.get("fill").value = DEFAULT_FILL;

        this.updateUI();
    }

    /* Style attributes */

    updateUI() {
        this.style.updateUI();
    }

    updateSvgUI() {
        updateSvgStyle();
        for (const [id, shape] of this.shapes) {
            shape.updateSvgUI();
        }
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

    moveShapeById(id, dx, dy) {
        const shape = this.shapeFromId(id);
        shape.move(dx, dy);
    }

    deleteShapeById(id) {
        this.shapes.delete(id);
    }

    // Default attributes simplify loading since there is always valid values for the attributes
    addLine(x1 = 0, y1 = 0, x2 = 1, y2 = 1) {
        const shape = new Line(x1, y1, x2, y2);
        this.addShape(shape);
        return shape;
    }

    addCircle(cx = 0, cy = 0, r = 1, filled = undefined) {
        const shape = new Circle(cx, cy, r, filled);
        this.addShape(shape);
        return shape;
    }

    addEllipse(cx = 1, cy = 1, rx = 1, ry = 1, filled = undefined) {
        const shape = new Ellipse(cx, cy, rx, ry, filled);
        this.addShape(shape);
        return shape;
    }

    addRectangle(x = 0, y = 0, width = 1, height = 1, filled = undefined) {
        const shape = new Rectangle(x, y, width, height, filled);
        this.addShape(shape);
        return shape;
    }

    addText(text = "NOT SET") {
        const shape = new Text(text, 16, 16);
        this.addShape(shape);
        return shape;
    }

    addPolyline(data = "1,1 2,2") {
        const shape = new Polyline(data);
        this.addShape(shape);
        return shape;
    }

    addPolygon(data = "1,1 1,2 2,2") {
        const shape = new Polygon(data);
        this.addShape(shape);
        return shape;
    }

    addPath(data = "M 0 0 L 1 1") {
        const shape = new Path(data);
        this.addShape(shape);
        return shape;
    }

}

export const icon = new Icon(32, 32);


import { SVGData } from "./attributes.mjs";
import { openPathDataDialog } from "./dialogs.mjs";
import { openAddTextDialog } from "./dialogs.mjs";
import { openPolygonDataDialog } from "./dialogs.mjs";
import { openPolylineDataDialog } from "./dialogs.mjs";
import { icon } from "./icon.mjs";


// Used to create translations for UI shapes
const SVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

let shapeIdCounter = 0;

export class Shape {

    constructor(type) {
        if (!type)
            throw "type is necessary"
        this.type = type;
        this.id = "shape" + (++shapeIdCounter);
        this._svg = null;
        this.attributes = new SVGData("shape-attribute-");
        this.style = new SVGData("shape-style-attribute-");
        this.style.addText(this, "stroke", undefined);
        this.style.addNumeric(this, "stroke-width", undefined, 1);
    }

    get svgAttributes() {
        return this.attributes;
    }

    get svgStyle() {
        return this.style;
    }

    copyAttributesAndStyle(copy) {
        copy.attributes.addAll(this.attributes);
        copy.style.addAll(this.style);
    }

    get attributeClass() {
        return this.type + "-attribute";
    }

    updateUI() {
        this.attributes.updateUI();
        this.style.updateUI();
        this.updateSvg(this.uiSvg, true);
    }

    updateSvgUI() {
        this.updateSvg(this.uiSvg, true);
    }

    get uiSvg() {
        if (!this._svg) {
            this._svg = this.createNewSvgShape();
            this._svg.setAttribute("id", this.id);
            this._svg.classList.add("draggable");

            const translate = SVG.createSVGTransform();
            translate.setTranslate(0, 0);
            this._svg.transform.baseVal.insertItemBefore(translate, 0);

        }
        return this._svg;
    }

    createNewSvgShape() {
        const svgShape = document.createElementNS('http://www.w3.org/2000/svg', this.type);
        this.updateSvg(svgShape);
        return svgShape;
    }

    updateSvg(svg) {
        const style = this.svgStyle.asText();
        if (style)
            svg.setAttribute('style', style);
        else
            svg.removeAttribute('style');
    }


    /**
     * Only applies movement
     */
    applyTransformMatrix() {
        let matrix = this.uiSvg.transform.baseVal.getItem(0).matrix;
        this.move(matrix.e, matrix.f);
        this.resetTransformMatrix();
    }

    resetTransformMatrix() {
        let transform = this.uiSvg.transform.baseVal.getItem(0);
        transform.matrix.e = 0;
        transform.matrix.f = 0;
    }

}

export class FilledShape extends Shape {
    constructor(type, filled) {
        super(type);
        this.style.addText(this, "fill", filled ? "Black" : "none");
        if (filled)
            this.style.get("stroke-width").value = 1;
    }
}

export class Line extends Shape {

    constructor(x1, y1, x2, y2) {
        super("line");

        this.attributes.addNumeric(this, "x", x1, 0);
        this.attributes.addNumeric(this, "y", y1, 0);
        this.attributes.addNumeric(this, "dx", x2 - x1, -32);
        this.attributes.addNumeric(this, "dy", y2 - y1, -32);

        this.style.addText(this, "stroke-linecap", undefined);
    }

    copy() {
        const copy = new Line(1, 1, 1, 1);
        this.copyAttributesAndStyle(copy);
        return copy;
    }

    move(dx, dy) {
        this.attributes.get("x").add(dx);
        this.attributes.get("y").add(dy);
        this.updateUI();
    }

    updateSvg(svg, all) {
        super.updateSvg(svg, all);
        svg.setAttribute('x1', this.attributes.get("x").value);
        svg.setAttribute('y1', this.attributes.get("y").value);
        svg.setAttribute('x2', this.attributes.get("x").value + this.attributes.get("dx").value);
        svg.setAttribute('y2', this.attributes.get("y").value + this.attributes.get("dy").value);
    }
}

export class Circle extends FilledShape {
    constructor(cx, cy, r, filled) {
        super("circle", filled);
        this.attributes.addNumeric(this, "x", cx, 0);
        this.attributes.addNumeric(this, "y", cy, 0);
        this.attributes.addNumeric(this, "size", r, 1);
    }

    copy() {
        const copy = new Circle(1, 1, 1, false);
        this.copyAttributesAndStyle(copy);
        return copy;
    }

    move(dx, dy) {
        this.attributes.get("x").add(dx);
        this.attributes.get("y").add(dy);
        this.updateUI();
    }

    updateSvg(svg, all) {
        super.updateSvg(svg, all);
        svg.setAttribute('cx', this.attributes.get("x").value);
        svg.setAttribute('cy', this.attributes.get("y").value);
        svg.setAttribute('r', this.attributes.get("size").value);
    }

}

export class Ellipse extends FilledShape {
    constructor(cx, cy, rx, ry, filled) {
        super("ellipse", filled);
        this.attributes.addNumeric(this, "x", cx, 0);
        this.attributes.addNumeric(this, "y", cy, 0);
        this.attributes.addNumeric(this, "dx", rx, 1);
        this.attributes.addNumeric(this, "dy", ry, 1);
    }

    copy() {
        const copy = new Ellipse(1, 1, 1, 1, false);
        this.copyAttributesAndStyle(copy);
        return copy;
    }

    move(dx, dy) {
        this.attributes.get("x").add(dx);
        this.attributes.get("y").add(dy);
        this.updateUI();
    }

    updateSvg(svg, all) {
        super.updateSvg(svg, all);
        svg.setAttribute('cx', this.attributes.get("x").value);
        svg.setAttribute('cy', this.attributes.get("y").value);
        svg.setAttribute('rx', this.attributes.get("dx").value);
        svg.setAttribute('ry', this.attributes.get("dy").value);
    }

}

export class Rectangle extends FilledShape {
    constructor(x, y, width, height, filled) {
        super("rect", filled);

        this.attributes.addNumeric(this, "x", x, 0);
        this.attributes.addNumeric(this, "y", y, 0);
        this.attributes.addNumeric(this, "dx", width, 1);
        this.attributes.addNumeric(this, "dy", height, 1);
    }

    copy() {
        const copy = new Rectangle(1, 1, 1, 1, false);
        this.copyAttributesAndStyle(copy);
        return copy;
    }

    move(dx, dy) {
        this.attributes.get("x").add(dx);
        this.attributes.get("y").add(dy);
        this.updateUI();
    }

    updateSvg(svg, all) {
        super.updateSvg(svg, all);
        svg.setAttribute("x", this.attributes.get("x").value);
        svg.setAttribute("y", this.attributes.get("y").value);
        svg.setAttribute("width", this.attributes.get("dx").value);
        svg.setAttribute("height", this.attributes.get("dy").value);
    }

}

export class Text extends Shape {
    constructor(text, x, y) {
        super("text", true);
        this.attributes.addTextData(this, "text", text);
        this.attributes.addNumeric(this, "x", x, 0);
        this.attributes.addNumeric(this, "y", y, 0);
        this.attributes.addNumeric(this, "size", 20, 1);

        this.style.get("stroke-width").set(1);

        this.style.addText(this, "font-family", '"Courier New", monospace');
    }

    copy() {
        const copy = new Text(this.text, 1, 1);
        this.copyAttributesAndStyle(copy);
        return copy;
    }

    move(dx, dy) {
        this.attributes.get("x").add(dx);
        this.attributes.get("y").add(dy);
        this.updateUI();
    }

    updateSvg(svg, all) {
        super.updateSvg(svg, all);
        svg.setAttribute("style", `${svg.attributes["style"].value}fill:${this.fillColor};`);
        svg.setAttribute("x", this.attributes.get("x").value);
        svg.setAttribute("y", this.attributes.get("y").value);

        svg.setAttribute("font-family", "'Courier New', Courier, monospace");
        svg.setAttribute("font-weight", "normal");
        svg.setAttribute("font-size", this.attributes.get("size").value);

        svg.setAttribute("text-anchor", "middle");
        svg.setAttribute("dominant-baseline", "middle");

        svg.replaceChildren(this.attributes.get("text").value);
    }

    get fillColor(){
        let color = this.style.get("stroke").value;
        if(!color) 
            color = icon.style.get("stroke").value;
        return color;
    }

    get editFunction() {
        return openAddTextDialog;
    }
}

export class Polyline extends FilledShape {

    constructor(points) {
        super("polyline", false);
        this.attributes.addTextData(this, "data", points);
    }

    copy() {
        const copy = new Polyline("");
        this.copyAttributesAndStyle(copy);
        return copy;
    }

    move(dx, dy) {
        this.updateUI();
    }

    updateSvg(svg, all) {
        svg.setAttribute("points", this.attributes.get("data").value);
        super.updateSvg(svg, all);
    }

    get editFunction() {
        return openPolylineDataDialog;
    }
}

export class Polygon extends FilledShape {

    constructor(points) {
        super("polygon", true);
        this.attributes.addTextData(this, "data", points);
    }

    copy() {
        const copy = new Polygon("");
        this.copyAttributesAndStyle(copy);
        return copy;
    }

    move(dx, dy) {
        this.updateUI();
    }

    updateSvg(svg, all) {
        super.updateSvg(svg, all);
        svg.setAttribute("points", this.attributes.get("data").value);
    }

    get editFunction() {
        return openPolygonDataDialog;
    }

}

export class Path extends FilledShape {

    constructor(points) {
        super("path", false);
        this.attributes.addTextData(this, "data", points);
    }

    copy() {
        const copy = new Path("");
        this.copyAttributesAndStyle(copy);
        return copy;
    }

    move(dx, dy) {
        this.updateUI();
    }

    updateSvg(svg, all) {
        super.updateSvg(svg, all);
        svg.setAttribute("d", this.attributes.get("data").value);
    }

    get editFunction() {
        return openPathDataDialog;
    }
}
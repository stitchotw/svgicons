import { SVGData } from "./attributes.mjs";
import { icon } from "./icon.mjs";


// Used to create translations for UI shapes
const SVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

let shapeIdCounter = 0;

export class Shape {

    constructor(parent, type) {
        if (!parent || !type)
            throw "Both parent and type is necessary"
        this.parent = parent;
        this.type = type;
        this.id = "shape" + (++shapeIdCounter);
        this._svg = null;
        this.attributes = new SVGData("shape-attribute-");
        this.style = new SVGData("shape-style-attribute-");
        this.style.addNumeric(this, "stroke-width", undefined, 1);
    }

    get svgAttributes() {
        return this.attributes;
    }

    get svgStyle() {
        return this.style;
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
    constructor(parent, type, filled) {
        super(parent, type);
        this.style.addText(this, "fill", filled ? "black" : "none");
    }
}

export class Line extends Shape {

    constructor(parent, x1, y1, x2, y2) {
        super(parent, "line");

        this.attributes.addNumeric(this, "x", x1, 0);
        this.attributes.addNumeric(this, "y", y1, 0);
        this.attributes.addNumeric(this, "dx", x2 - x1, -32);
        this.attributes.addNumeric(this, "dy", y2 - y1, -32);
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
    constructor(parent, cx, cy, r, filled) {
        super(parent, "circle", filled);
        this.attributes.addNumeric(this, "x", cx, 0);
        this.attributes.addNumeric(this, "y", cy, 0);
        this.attributes.addNumeric(this, "size", r, 1);
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

export class Rectangle extends FilledShape {
    constructor(parent, x, y, width, height, filled) {
        super(parent, "rect", filled);

        this.attributes.addNumeric(this, "x", x, 0);
        this.attributes.addNumeric(this, "y", y, 0);
        this.attributes.addNumeric(this, "dx", width, 32);
        this.attributes.addNumeric(this, "dy", height, 32);
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

export class Text extends FilledShape {
    constructor(parent, text, x, y) {
        super(parent, "text", true);
        this.text = text;
        this.attributes.addNumeric(this, "x", x, 0);
        this.attributes.addNumeric(this, "y", y, 0);
        this.attributes.addNumeric(this, "size", 20, 1);
        this.style.get("stroke-width").set(1);
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

        svg.setAttribute("font-family", "'Courier New', Courier, monospace");
        svg.setAttribute("font-weight", "normal");
        svg.setAttribute("font-size", this.attributes.get("size").value);

        svg.setAttribute("text-anchor", "middle");
        svg.setAttribute("dominant-baseline", "middle");

        svg.replaceChildren(this.text)
    }
}

export class Polyline extends FilledShape {
    
    constructor(parent, points) {
        super(parent, "polyline", false);
        this.attributes.addText(this, "data", points);
    }

    move(dx, dy) {
        this.updateUI();
    }
    
    updateSvg(svg, all) {
        super.updateSvg(svg, all);
        svg.setAttribute("points", this.attributes.get("data").value);
    }
}
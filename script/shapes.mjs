import { NumericAttribute } from "./attributes.mjs";


// Used to create translations for UI shapes
const SVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

let shapeIdCounter = 0;

export class Shape {

    constructor(type) {
        this.type = type;
        this.id = "shape" + (++shapeIdCounter);
        this._svg = null;
        this.attributes = new Map();
    }


    get(name) {
        return this.attributes.get(name);
    }

    get attributeClass() {
        return this.type + "-attribute";
    }

    updateAttributesUI() {
        this.attributes.forEach((attribute) => { attribute.updateUI(); });
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
        // TODO: Fill this.updateSVGShape();
        return svgShape;
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
        this.filled = filled;
    }

    svgShape() {
        const fragment = super.svgShape();
        if (this.filled) {
            // TODO: will remove any other style on the fragment
            fragment.setAttribute('style', "fill: black;");
        }
        return fragment;

    }
}

export class Line extends Shape {

    constructor(x1, y1, x2, y2) {
        super("line");

        this.attributes.set("x", new NumericAttribute(this, "x", x1));
        this.attributes.set("y", new NumericAttribute(this, "y", y1));
        this.attributes.set("dx", new NumericAttribute(this, "dx", x2 - x1));
        this.attributes.set("dy", new NumericAttribute(this, "dy", y2 - y1));
    }

    move(dx, dy) {
        this.get("x").add(dx);
        this.get("y").add(dy);
        this.updateSVGShape();
    }

    updateSVGShape() {
        this.uiSvg.setAttribute('x1', this.get("x").value);
        this.uiSvg.setAttribute('y1', this.get("y").value);
        this.uiSvg.setAttribute('x2', this.get("x").value + this.get("dx").value);
        this.uiSvg.setAttribute('y2', this.get("y").value + this.get("dy").value);
    }
}

export class Circle extends FilledShape {
    constructor(cx, cy, r, filled) {
        super("circle", filled);
        this.cx = cx;
        this.cy = cy;
        this.r = r;
    }

    get x() { return this.cx; }
    get y() { return this.cy; }
    get size() { return this.r; }

    move(dx, dy) {
        this.cx += dx;
        this.cy += dy;
        this.updateSVGShape();
    }

    updateSVGShape() {
        this.uiSvg.setAttribute('cx', this.cx);
        this.uiSvg.setAttribute('cy', this.cy);
        this.uiSvg.setAttribute('r', this.r);
    }

}

export class Rectangle extends FilledShape {
    constructor(x, y, width, height, filled) {
        super("rect", filled);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    get x() { return this.x; }
    get y() { return this.y; }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
        this.updateSVGShape();
    }

    updateSVGShape() {
        this.uiSvg.setAttribute("x", this.x);
        this.uiSvg.setAttribute("y", this.y);
        this.uiSvg.setAttribute("width", this.width);
        this.uiSvg.setAttribute("height", this.height);
    }

}
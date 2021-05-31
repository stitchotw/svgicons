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
        this.update(svgShape);
        return svgShape;
    }

    updateUISvg(){
        this.update(this.uiSvg);
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

    createNewSvgShape() {
        const fragment = super.createNewSvgShape();
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
        this.updateUISvg();
    }

    update(svg) {
        svg.setAttribute('x1', this.get("x").value);
        svg.setAttribute('y1', this.get("y").value);
        svg.setAttribute('x2', this.get("x").value + this.get("dx").value);
        svg.setAttribute('y2', this.get("y").value + this.get("dy").value);
    }
}

export class Circle extends FilledShape {
    constructor(cx, cy, r, filled) {
        super("circle", filled);
        this.attributes.set("x", new NumericAttribute(this, "x", cx));
        this.attributes.set("y", new NumericAttribute(this, "y", cy));
        this.attributes.set("size", new NumericAttribute(this, "size", r));
    }


    move(dx, dy) {
        this.get("x").add(dx);
        this.get("y").add(dy);
        this.updateUISvg();
    }

    update(svg) {
        svg.setAttribute('cx', this.get("x").value);
        svg.setAttribute('cy', this.get("y").value);
        svg.setAttribute('r', this.get("size").value);
    }

}

export class Rectangle extends FilledShape {
    constructor(x, y, width, height, filled) {
        super("rect", filled);

        this.attributes.set("x", new NumericAttribute(this, "x", x));
        this.attributes.set("y", new NumericAttribute(this, "y", y));
        this.attributes.set("dx", new NumericAttribute(this, "dx", width));
        this.attributes.set("dy", new NumericAttribute(this, "dy", height));
    }

    move(dx, dy) {
        this.get("x").add(dx);
        this.get("y").add(dy);
        this.updateUISvg();
    }

    update(svg) {
        svg.setAttribute("x", this.get("x").value);
        svg.setAttribute("y", this.get("y").value);
        svg.setAttribute("width", this.get("dx").value);
        svg.setAttribute("height", this.get("dy").value);
    }

}
import { TextAttribute } from "./attributes.mjs";
import { NumericAttribute } from "./attributes.mjs";
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

    styleData(all) {
        let data = "";
        icon.globalStyle.forEach((attribute, name) => {
            const local = this.get(name);
            const changed = local && local.value !== attribute.value;
            if (all || changed) {
                data += name + ":" + (changed ? local.value : attribute.value) + ";";
            }
        });
        return data;
    }

    createNewSvgShape() {
        const svgShape = document.createElementNS('http://www.w3.org/2000/svg', this.type);
        this.update(svgShape);
        return svgShape;
    }

    updateUI() {
        this.update(this.uiSvg, true);
    }

    update(svg, all) {
        const style = this.styleData(all);
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
        this.attributes.set("fill", new TextAttribute(this, "fill", filled ? "black" : "none"));
    }
}

export class Line extends Shape {

    constructor(parent, x1, y1, x2, y2) {
        super(parent, "line");

        this.attributes.set("x", new NumericAttribute(this, "x", x1, 0));
        this.attributes.set("y", new NumericAttribute(this, "y", y1, 0));
        this.attributes.set("dx", new NumericAttribute(this, "dx", x2 - x1, -32));
        this.attributes.set("dy", new NumericAttribute(this, "dy", y2 - y1, -32));
    }

    move(dx, dy) {
        this.get("x").add(dx);
        this.get("y").add(dy);
        this.updateUI();
    }

    update(svg, all) {
        super.update(svg, all);
        svg.setAttribute('x1', this.get("x").value);
        svg.setAttribute('y1', this.get("y").value);
        svg.setAttribute('x2', this.get("x").value + this.get("dx").value);
        svg.setAttribute('y2', this.get("y").value + this.get("dy").value);
    }
}

export class Circle extends FilledShape {
    constructor(parent, cx, cy, r, filled) {
        super(parent, "circle", filled);
        this.attributes.set("x", new NumericAttribute(this, "x", cx, 0));
        this.attributes.set("y", new NumericAttribute(this, "y", cy, 0));
        this.attributes.set("size", new NumericAttribute(this, "size", r));
    }


    move(dx, dy) {
        this.get("x").add(dx);
        this.get("y").add(dy);
        this.updateUI();
    }

    update(svg, all) {
        super.update(svg, all);
        svg.setAttribute('cx', this.get("x").value);
        svg.setAttribute('cy', this.get("y").value);
        svg.setAttribute('r', this.get("size").value);
    }

}

export class Rectangle extends FilledShape {
    constructor(parent, x, y, width, height, filled) {
        super(parent, "rect", filled);

        this.attributes.set("x", new NumericAttribute(this, "x", x, 0));
        this.attributes.set("y", new NumericAttribute(this, "y", y, 0));
        this.attributes.set("dx", new NumericAttribute(this, "dx", width, 32));
        this.attributes.set("dy", new NumericAttribute(this, "dy", height, 32));
    }

    move(dx, dy) {
        this.get("x").add(dx);
        this.get("y").add(dy);
        this.updateUI();
    }

    update(svg, all) {
        super.update(svg, all);
        svg.setAttribute("x", this.get("x").value);
        svg.setAttribute("y", this.get("y").value);
        svg.setAttribute("width", this.get("dx").value);
        svg.setAttribute("height", this.get("dy").value);
    }

}
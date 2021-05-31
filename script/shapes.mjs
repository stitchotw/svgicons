// Used to create translations for UI shapes
const SVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

let shapeIdCounter = 0;

export class Shape {

    constructor(type) {
        this.type = type;
        this.id = "shape" + (++shapeIdCounter);
        this._uiShape = null;
    }

    get x(){ return "---"; }
    get y(){ return "---"; }
    get size(){ return "---"; }

    get attributeClass() {
        return this.type + "-attribute";
    }


    get uiShape() {
        if (!this._uiShape) {
            this._uiShape = this.svgShape();
            this._uiShape.setAttribute("id", this.id);
            this._uiShape.classList.add("draggable");

            const translate = SVG.createSVGTransform();
            translate.setTranslate(0, 0);
            this._uiShape.transform.baseVal.insertItemBefore(translate, 0);
        
        }
        return this._uiShape;
    }

    svgShape() {
        const svgShape = document.createElementNS('http://www.w3.org/2000/svg', this.type);
        this.applyAttributes(svgShape);
        return svgShape;
    }

    /**
     * Only applies movement
     */
    applyTransformMatrix(){
        let matrix = this.uiShape.transform.baseVal.getItem(0).matrix;
        this.move(matrix.e, matrix.f);
        this.resetTransformMatrix();
    }

    resetTransformMatrix(){
        let transform = this.uiShape.transform.baseVal.getItem(0);
        transform.matrix.e=0;
        transform.matrix.f=0;
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

        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    get x(){ return this.x1; }
    get y(){ return this.y1; }

    move(dx, dy) {
        this.x1 += dx;
        this.y1 += dy;
        this.x2 += dx;
        this.y2 += dy;
        this.applyAttributes(this.uiShape);
    }

    applyAttributes(svgShape){
        svgShape.setAttribute('x1', this.x1);
        svgShape.setAttribute('y1', this.y1);
        svgShape.setAttribute('x2', this.x2);
        svgShape.setAttribute('y2', this.y2);
    }
}

export class Circle extends FilledShape {
    constructor(cx, cy, r, filled) {
        super("circle", filled);
        this.cx = cx;
        this.cy = cy;
        this.r = r;
    }

    get x(){ return this.cx; }
    get y(){ return this.cy; }
    get size(){ return this.r; }

    move(dx, dy) {
        this.cx += dx;
        this.cy += dy;
        this.applyAttributes(this.uiShape);
    }

    applyAttributes(svgShape){
        svgShape.setAttribute('cx', this.cx);
        svgShape.setAttribute('cy', this.cy);
        svgShape.setAttribute('r', this.r);
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

    get x(){ return this.x; }
    get y(){ return this.y; }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
        this.applyAttributes(this.uiShape);
    }

    applyAttributes(svgShape){
        svgShape.setAttribute("x", this.x);
        svgShape.setAttribute("y", this.y);
        svgShape.setAttribute("width", this.width);
        svgShape.setAttribute("height", this.height);
     }

}
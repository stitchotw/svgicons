let     shapeIdCounter = 0;

export class Shape {


    constructor(type) {
        this.type = type;
        this.id = "shape" + (++shapeIdCounter);
        this._uiShape = null;
    }

    get attributeClass() {
        return this.type + "-attribute";
    }


    get uiShape() {
        if (!this._uiShape) {
            this._uiShape = this.svgShape();
            this._uiShape.setAttribute("id", this.id);
            this._uiShape.classList.add("draggable");
        }
        return this._uiShape;
    }

    svgShape() {
        const fragment = document.createElementNS('http://www.w3.org/2000/svg', this.type);
        return fragment;
    }

}

export class FilledShape extends Shape {
    constructor(type, filled) {
        super(type);
        this.filled = filled;
        console.log(filled);
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

    svgShape() {
        const fragment = super.svgShape();
        fragment.setAttribute('x1', this.x1);
        fragment.setAttribute('y1', this.y1);
        fragment.setAttribute('x2', this.x2);
        fragment.setAttribute('y2', this.y2);
        return fragment;
    }
}

export class Circle extends FilledShape {
    constructor(cx, cy, r, filled) {
        super("circle", filled);
        this.cx = cx;
        this.cy = cy;
        this.r = r;
    }

    svgShape() {
        const fragment = super.svgShape();
        fragment.setAttribute('cx', this.cx);
        fragment.setAttribute('cy', this.cy);
        fragment.setAttribute('r', this.r);
        return fragment;
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

    svgShape() {
        const fragment = super.svgShape();
        fragment.setAttribute("x", this.x);
        fragment.setAttribute("y", this.y);
        fragment.setAttribute("width", this.width);
        fragment.setAttribute("height", this.height);
        return fragment;
    }
}
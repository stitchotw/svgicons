const DEFAULT_SVG_STYLE = "stroke: black; stroke-width: 20px; stroke-linecap: round; fill: none;"

class Shape {
    constructor(type) {
        this.type = type;
        this.id = "shape" + (++shapeIdCounter);
    }

    get attributeClass() {
        return this.type + "-attribute";
    }

    toSVGFragment() {
        const fragment = document.createElementNS('http://www.w3.org/2000/svg', this.type);
        fragment.setAttribute("id", this.id);
        fragment.classList.add("draggable");
        return fragment;
    }


    getNewSVGElement(width, height) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('style', DEFAULT_SVG_STYLE);
        svg.setAttribute("width", width);
        svg.setAttribute("height", height);
        return svg;
    }

}

class FilledShape extends Shape {
    constructor(type, filled) {
        super(type);
        this.filled = filled;
        console.log(filled);
    }

    toSVGFragment() {
        const fragment = super.toSVGFragment();
        if (this.filled) {
            // TODO: will remove any other style on the fragment
            fragment.setAttribute('style', "fill: black;");
        }
        return fragment;

    }
}

class Line extends Shape {

    constructor(x1, y1, x2, y2) {
        super("line");

        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    toSVGFragment() {
        const fragment = super.toSVGFragment();
        fragment.setAttribute('x1', this.x1);
        fragment.setAttribute('y1', this.y1);
        fragment.setAttribute('x2', this.x2);
        fragment.setAttribute('y2', this.y2);
        return fragment;
    }
}

class Circle extends FilledShape {
    constructor(cx, cy, r, filled) {
        super("circle", filled);
        this.cx = cx;
        this.cy = cy;
        this.r = r;
    }

    toSVGFragment() {
        const fragment = super.toSVGFragment();
        fragment.setAttribute('cx', this.cx);
        fragment.setAttribute('cy', this.cy);
        fragment.setAttribute('r', this.r);
        return fragment;
    }
}

class Rectangle extends FilledShape {
    constructor(x, y, width, height, filled) {
        super("rect", filled);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    toSVGFragment() {
        const fragment = super.toSVGFragment();
        fragment.setAttribute("x", this.x);
        fragment.setAttribute("y", this.y);
        fragment.setAttribute("width", this.width);
        fragment.setAttribute("height", this.height);
        return fragment;
    }
}
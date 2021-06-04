import { inputDialog } from './dialogs.mjs';
import { StandardDialog } from './dialogs.mjs';
import { icon } from './icon.mjs';

export function setUpShapeLibrary() {
    addEventListeners();
}

function start(p) {
    return p + 2;
}

function end(p) {
    return p - 2;
}

function length(percent) {
    return Math.floor((32 - 2 - 2) * percent / 100);
}

function size(percent) {
    const len = length(percent);
    return len > 0 ? len : 1;
}

function addButton(parentId, caption, imageSrc, listener) {
    const parent = document.getElementById(parentId);

    const button = document.createElement("button");
    parent.appendChild(button);

    button.classList.add("add-shape-button");
    button.innerText = caption;

    const img = document.createElement("img");
    img.src = imageSrc;
    img.style.outline = "1px solid gray"

    button.addEventListener("click", listener);

    button.appendChild(img);
}

function addLineButton(parentId, caption, px, py) {
    const imageSrc = `./img/add-line-${px}-${py}.svg`;
    const x1 = px >= 0 ? start(0) : end(32);
    const y1 = start(0);
    const x2 = x1 + length(px);
    const y2 = y1 + length(py);

    addButton(parentId, caption, imageSrc, () => icon.addLine(x1, y1, x2, y2));
}

function addCircleButton(parentId, caption, p, filled) {
    const imageSrc = `./img/add-circle-${p}${filled ? "-filled" : ""}.svg`;
    const r = size(p / 2);

    addButton(parentId, caption, imageSrc, () => icon.addCircle(16, 16, r, filled));
}

function addEllipseButton(parentId, caption, px, py, filled) {
    const imageSrc = `./img/add-ellipse-${px}-${py}${filled ? "-filled" : ""}.svg`;
    const rx = length(px / 2);
    const ry = length(py / 2);

    addButton(parentId, caption, imageSrc, () => icon.addEllipse(16, 16, rx, ry, filled));
}

function addRectangleButton(parentId, caption, pw, ph, filled) {
    const imageSrc = `./img/add-rectangle-${pw}-${ph}${filled ? "-filled" : ""}.svg`;

    const x = start(0);
    const y = start(0);
    const w = length(pw);
    const h = length(ph);

    addButton(parentId, caption, imageSrc, () => icon.addRectangle(x, y, w, h, filled));
}


function addEventListeners() {
    // () => is necessary since otherwise the listener method would be called when addEventListeners runs
    // Lines

    addLineButton("horizontal-add-line-buttons", "Short", 50, 0);
    addLineButton("horizontal-add-line-buttons", "Long", 100, 0);

    addLineButton("vertical-add-line-buttons", "Short", 0, 50);
    addLineButton("vertical-add-line-buttons", "Long", 0, 100);

    addLineButton("diagonal-left-to-right-add-line-buttons", "Short", 50, 50);
    addLineButton("diagonal-left-to-right-add-line-buttons", "Long", 100, 100);

    addLineButton("diagonal-right-to-left-add-line-buttons", "Short", -50, 50);
    addLineButton("diagonal-right-to-left-add-line-buttons", "Long", -100, 100);

    // Circles
    addCircleButton("add-filled-circle-buttons", "Small", 5, true);
    addCircleButton("add-filled-circle-buttons", "Medium", 50, true);
    addCircleButton("add-filled-circle-buttons", "Large", 100, true);

    addCircleButton("add-not-filled-circle-buttons", "Small", 5, false);
    addCircleButton("add-not-filled-circle-buttons", "Medium", 50, false);
    addCircleButton("add-not-filled-circle-buttons", "Large", 100, false);

    // Ellipses
    addEllipseButton("add-filled-horizontal-ellipse-buttons", "Medium", 50, 25, true);
    addEllipseButton("add-filled-horizontal-ellipse-buttons", "Large", 100, 50, true);
    addEllipseButton("add-filled-vertical-ellipse-buttons", "Medium", 25, 50, true);
    addEllipseButton("add-filled-vertical-ellipse-buttons", "Large", 50, 100, true);

    addEllipseButton("add-not-filled-horizontal-ellipse-buttons", "Medium", 50, 25, false);
    addEllipseButton("add-not-filled-horizontal-ellipse-buttons", "Large", 100, 50, false);
    addEllipseButton("add-not-filled-vertical-ellipse-buttons", "Medium", 25, 50, false);
    addEllipseButton("add-not-filled-vertical-ellipse-buttons", "Large", 50, 100, false);

    // Rectangels
    addRectangleButton("add-filled-rectangle-buttons", "Small", 25, 25, true);
    addRectangleButton("add-filled-rectangle-buttons", "Medium", 50, 50, true);
    addRectangleButton("add-filled-rectangle-buttons", "Large", 100, 100, true);
    addRectangleButton("add-filled-half-rectangle-buttons", "Half", 100, 50, true);
    addRectangleButton("add-filled-half-rectangle-buttons", "Half", 50, 100, true);

    addRectangleButton("add-not-filled-rectangle-buttons", "Small", 25, 25, false);
    addRectangleButton("add-not-filled-rectangle-buttons", "Medium", 50, 50, false);
    addRectangleButton("add-not-filled-rectangle-buttons", "Large", 100, 100, false);
    addRectangleButton("add-not-filled-half-rectangle-buttons", "Half", 100, 50, false);
    addRectangleButton("add-not-filled-half-rectangle-buttons", "Half", 50, 100, false);

    // Complex shapes
    document.getElementById("add-polyline-button").addEventListener("click", () => {
        inputDialog.open("Polyline data", "At least two points separated space or newline, e.g.: 1,1 2,2", data => { icon.addPolyline(data) }, /^\d+[\s]*[,][\s]*\d+([\s]+\d+[\s]*[,][\s]*\d+)+$/);
    });
    document.getElementById("add-polygon-button").addEventListener("click", () => {
        inputDialog.open("Polygon data", "At least three points separated space or newline, e.g.: 1,1 2,2 3,3", data => { icon.addPolygon(data) }, /^\d+[\s]*[,][\s]*\d+([\s]+\d+[\s]*[,][\s]*\d+){2,}$/);
    });
    document.getElementById("add-path-button").addEventListener("click", () => {

        const space = /[\s]+/;
        const initialpos = /[Mm]\s+\d+[\s,]+\d+/;
        const oneparam = /[HhVv]\s+\d+/;
        const twoparam = /[MmLlTt]\s+\d+[\s,]+\d+/;
        const closepath = /[Zz]/;
        const twoparamcurve = /[Cc]\s+\d+\s+\d+[\s,]+\d+\s+\d+/;
        const threeparamcurve = /[Cc]\s+\d+\s+\d+([\s,]+\d+\s+\d+){2}/;
        const arc = /[Aa](\s+\d+){7}/

        const or = (...regexs) => {
            return "((" + regexs.map(r => r.source).join(")|(") + "))";
        }

        const all = "^" + initialpos.source + "(" + space.source + or(oneparam, twoparam, closepath, twoparamcurve, threeparamcurve, arc) + ")+$";

        inputDialog.open("Path data",
            "It is easier to read if you put one command per line. Don't put any commas between commands. <a href='https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths' target='_blank' class='help-link' title='Opens in new tab/window'>developer.mozilla.org have a good introduction to path data.</a>",
            data => { icon.addPath(data) }, new RegExp(all));
    });

    //Text
    document.getElementById("add-text-button").addEventListener("click", () => { inputDialog.open("Text to add", "Two or three characters is the most that is readable on an icon sized image.", text => { icon.addText(text) }); });
    new AddSymbolDialog();
}

class AddSymbolDialog extends StandardDialog {

    constructor() {
        super("add-symbol-dialog", "add-symbol-button", "cancel-add-symbol-dialog-button");

        this.addSectionToDialog("Common", "!?%#+*");
        this.addSectionToDialog("Random", "†‡%‰‱‽⁋⁜※⁂");
    }

    addSectionToDialog(name, symbols) {
        const parent = document.getElementById("select-symbol-panel");

        const header = document.createElement("h2");
        header.textContent = name;
        parent.appendChild(header);

        const content = document.createElement("div");
        parent.appendChild(content);

        for (const c of symbols) {
            const button = document.createElement("button");
            button.classList.add("symbol-button");
            button.innerText = c;
            button.addEventListener("click", evt => this.addSymbolToIcon(evt.target));
            button.addEventListener("mouseover", evt => this.updatePreview(evt.target));
            content.appendChild(button);
        }
    }

    addSymbolToIcon(button) {
        icon.addText(button.innerText);
        this.close();
    }

    updatePreview(button) {
        const symbol = button.innerText;
        if (symbol !== this.preview) {
            this.preview = symbol;
            const previews = document.getElementsByClassName("symbol-preview");
            for (const p of previews) {
                p.innerText = symbol;
            }
        }
    }

}
import { openPolylineDataDialog, openPolygonDataDialog, openPathDataDialog } from './dialogs.mjs';
import { openAddTextDialog, openAddSymbolCodeDialog } from './dialogs.mjs';
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
    const imageSrc = `./img/add-circle-${p}${filled !== "none" ? "-filled" : ""}.svg`;
    const r = size(p / 2);

    addButton(parentId, caption, imageSrc, () => icon.addCircle(16, 16, r, filled));
}

function addEllipseButton(parentId, caption, px, py, filled) {
    const imageSrc = `./img/add-ellipse-${px}-${py}${filled !== "none" ? "-filled" : ""}.svg`;
    const rx = length(px / 2);
    const ry = length(py / 2);

    addButton(parentId, caption, imageSrc, () => icon.addEllipse(16, 16, rx, ry, filled));
}

function addRectangleButton(parentId, caption, pw, ph, filled) {
    const imageSrc = `./img/add-rectangle-${pw}-${ph}${filled !== "none" ? "-filled" : ""}.svg`;

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
    addCircleButton("add-filled-circle-buttons", "Small", 5, "Black");
    addCircleButton("add-filled-circle-buttons", "Medium", 50, "Black");
    addCircleButton("add-filled-circle-buttons", "Large", 100, "Black");

    addCircleButton("add-not-filled-circle-buttons", "Small", 5, "none");
    addCircleButton("add-not-filled-circle-buttons", "Medium", 50, "none");
    addCircleButton("add-not-filled-circle-buttons", "Large", 100, "none");

    // Ellipses
    addEllipseButton("add-filled-horizontal-ellipse-buttons", "Medium", 50, 25, "Black");
    addEllipseButton("add-filled-horizontal-ellipse-buttons", "Large", 100, 50, "Black");
    addEllipseButton("add-filled-vertical-ellipse-buttons", "Medium", 25, 50, "Black");
    addEllipseButton("add-filled-vertical-ellipse-buttons", "Large", 50, 100, "Black");

    addEllipseButton("add-not-filled-horizontal-ellipse-buttons", "Medium", 50, 25, "none");
    addEllipseButton("add-not-filled-horizontal-ellipse-buttons", "Large", 100, 50, "none");
    addEllipseButton("add-not-filled-vertical-ellipse-buttons", "Medium", 25, 50, "none");
    addEllipseButton("add-not-filled-vertical-ellipse-buttons", "Large", 50, 100, "none");

    // Rectangels
    addRectangleButton("add-filled-rectangle-buttons", "Small", 25, 25, "Black");
    addRectangleButton("add-filled-rectangle-buttons", "Medium", 50, 50, "Black");
    addRectangleButton("add-filled-rectangle-buttons", "Large", 100, 100, "Black");
    addRectangleButton("add-filled-half-rectangle-buttons", "Half", 100, 50, "Black");
    addRectangleButton("add-filled-half-rectangle-buttons", "Half", 50, 100, "Black");

    addRectangleButton("add-not-filled-rectangle-buttons", "Small", 25, 25, "none");
    addRectangleButton("add-not-filled-rectangle-buttons", "Medium", 50, 50, "none");
    addRectangleButton("add-not-filled-rectangle-buttons", "Large", 100, 100, "none");
    addRectangleButton("add-not-filled-half-rectangle-buttons", "Half", 100, 50, "none");
    addRectangleButton("add-not-filled-half-rectangle-buttons", "Half", 50, 100, "none");

    // Complex shapes
    document.getElementById("add-polyline-button").addEventListener("click", () => {
        openPolylineDataDialog("", (data) => {
            icon.addPolyline(data);
        });
    });
    document.getElementById("add-polygon-button").addEventListener("click", () => {
        openPolygonDataDialog("", (data) => {
            icon.addPolygon(data);
        });
    });
    document.getElementById("add-path-button").addEventListener("click", () => {
        openPathDataDialog("", (data) => {
            icon.addPath(data);
        });
    });

    //Text
    document.getElementById("add-text-button").addEventListener("click", () => {
        openAddTextDialog("", (data) => {
            icon.addText(data);
        });
    });

    // Symbol dialog added in Dialogs

    document.getElementById("add-symbol-code-button").addEventListener("click", () => {
        openAddSymbolCodeDialog("", (data) => {
            const decimalValue = parseInt(data, 16);
            const char = String.fromCharCode(decimalValue);
            icon.addText(char);
        });
    });

}

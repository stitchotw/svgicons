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

function addButton(parentId, caption, imageSrc, listener){
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
    const x1 = px>=0 ? start(0): end(32);
    const y1= start(0);
    const x2 = x1 + length(px);
    const y2 = y1 + length(py);

    addButton(parentId, caption,  imageSrc, () => icon.addLine(x1, y1, x2, y2));
}

function addEventListeners() {
    // () => is necessary since otherwise the listener method would be called when addEventListeners runs
    // Lines

    addLineButton("horizontal-add-line-buttons","H-Short", 50, 0);
    addLineButton("horizontal-add-line-buttons","H-Long", 100, 0);

    addLineButton("vertical-add-line-buttons","V-Short", 0, 50);
    addLineButton("vertical-add-line-buttons","V-Long", 0, 100);

    addLineButton("diagonal-left-to-right-add-line-buttons","LR-Short", 50, 50);
    addLineButton("diagonal-left-to-right-add-line-buttons","LR-Long", 100, 100);

    addLineButton("diagonal-right-to-left-add-line-buttons","RL-Short", -50, 50);
    addLineButton("diagonal-right-to-left-add-line-buttons","RL-Long", -100, 100);

    // Circles
    document.getElementById("add-dot-button").addEventListener("click", () => icon.addCircle(15, 15, 1, true));
    document.getElementById("add-filled-circle-button").addEventListener("click", () => icon.addCircle(15, 15, 5, true));
    document.getElementById("add-circle-no-fill-button").addEventListener("click", () => icon.addCircle(15, 15, 5, false));

    // Rectangels
    document.getElementById("add-filled-rectangle-button").addEventListener("click", () => icon.addRectangle(5, 5, 5, 3, true));
    document.getElementById("add-rectangle-no-fill-button").addEventListener("click", () => icon.addRectangle(5, 5, 5, 3, false));

    // Ellipses
    document.getElementById("add-filled-ellipse-button").addEventListener("click", () => icon.addEllipse(5, 5, 5, 3, true));
    document.getElementById("add-ellipse-no-fill-button").addEventListener("click", () => icon.addEllipse(5, 5, 5, 3, false));

    // 
    document.getElementById("add-polyline-button").addEventListener("click", () => {
        inputDialog.open("Polyline data", data => { icon.addPolyline(data) }, /^\d+[\s]*[,][\s]*\d+([\s]+\d+[\s]*[,][\s]*\d+)+$/);
    });
    document.getElementById("add-polygon-button").addEventListener("click", () => {
        inputDialog.open("Polygon data", data => { icon.addPolygon(data) }, /^\d+[\s]*[,][\s]*\d+([\s]+\d+[\s]*[,][\s]*\d+){2,}$/);
    });
    document.getElementById("add-path-button").addEventListener("click", () => {

        const space = /[\s,]+/;
        const initialpos = /[Mm]\s+\d+\s+\d+/;
        const oneparam = /[HhVv]\s+\d+/;
        const twoparam = /[MmLlTt]\s+\d+\s+\d+/;
        const closepath = /[Zz]/;
        const twoparamcurve = /[Cc]\s+\d+\s+\d+[\s,]+\d+\s+\d+/;
        const threeparamcurve = /[Cc]\s+\d+\s+\d+([\s,]+\d+\s+\d+){2}/;
        const arc = /[Aa](\s+\d+){7}/

        const or = (...regexs) => {
            return "((" + regexs.map(r => r.source).join(")|(") + "))";
        }

        const all = "^" + initialpos.source + "(" + space.source + or(oneparam, twoparam, closepath, twoparamcurve, threeparamcurve, arc) + ")+$";
        //        const all = "^" + initialpos.source +space.source+ oneparam.source + "$";
        console.log(all)

        inputDialog.open("Path data", data => { icon.addPath(data) }, new RegExp(all));
    });

    //Text
    document.getElementById("add-text-button").addEventListener("click", () => { inputDialog.open("Text to add", text => { icon.addText(text) }); });
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
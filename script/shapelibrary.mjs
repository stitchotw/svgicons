import { inputDialog } from './dialogs.mjs';
import { StandardDialog } from './dialogs.mjs';
import { icon } from './icon.mjs';

export function setUpShapeLibrary() {
    addEventListeners();
}

function addEventListeners() {
    // () => is necessary since otherwise the listener method would be called when addEventListeners runs
    // Lines
    document.getElementById("add-horizontal-line-button").addEventListener("click", () => icon.addLine(1, 1, 11, 1));
    document.getElementById("add-vertical-line-button").addEventListener("click", () => icon.addLine(1, 1, 1, 11));
    document.getElementById("add-diagonal-left-to-right-button").addEventListener("click", () => icon.addLine(0, 0, 10, 10));
    document.getElementById("add-diagonal-right-to-left-button").addEventListener("click", () => icon.addLine(10, 0, 0, 10));

    // Circles
    document.getElementById("add-dot-button").addEventListener("click", () => icon.addCircle(15, 15, 1, true));
    document.getElementById("add-filled-circle-button").addEventListener("click", () => icon.addCircle(15, 15, 5, true));
    document.getElementById("add-circle-no-fill-button").addEventListener("click", () => icon.addCircle(15, 15, 5, false));

    // Rectangels
    document.getElementById("add-filled-rectangle-button").addEventListener("click", () => icon.addRectangle(5, 5, 5, 3, true));
    document.getElementById("add-rectangle-no-fill-button").addEventListener("click", () => icon.addRectangle(5, 5, 5, 3, false));

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
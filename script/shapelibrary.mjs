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
    document.getElementById("add-polyline-button").addEventListener("click", () => { inputDialog.open("Polyline data", text => { icon.addText(text) }); });
    document.getElementById("add-polygon-button").addEventListener("click", () => { inputDialog.open("Polygon data", text => { icon.addText(text) }); });
    document.getElementById("add-path-button").addEventListener("click", () => { inputDialog.open("Path data", text => { icon.addText(text) }); });

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
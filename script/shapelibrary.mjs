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
    document.getElementById("add-polyline-button").addEventListener("click", () => { });
    document.getElementById("add-polygon-button").addEventListener("click", () => { });
    document.getElementById("add-path-button").addEventListener("click", () => { });

    //Text
    new AddTextDialog();
    new AddSymbolDialog();
}

class AddTextDialog extends StandardDialog {
    constructor() {
        super("add-text-dialog", "add-text-button", "cancel-add-text-dialog-button");
        this.addListener("add-text-to-icon-button", evt => {
            if (this.text) {
                icon.addText(this.text);
                this.close();
            }
        });
    }

    get text() {
        return document.getElementById("added-text").value;
    }

    set text(t) {
        document.getElementById("added-text").value = t;
    }

    open() {
        this.text = "";
        super.open();
    }
}


class AddSymbolDialog extends StandardDialog {

    constructor() {
        super("add-symbol-dialog", "add-symbol-button", "cancel-add-symbol-dialog-button");

        this.addSectionToDialog("Common", "!?%#+*");
        this.addSectionToDialog("Random", "†‡%‰‱‽⁋⁜※⁂");
    }

    addSectionToDialog(name, symbols) {
        const parent = document.getElementById("selectable-symbols");

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
            content.appendChild(button);
        }
    }

    addSymbolToIcon(button) {
        icon.addText(button.innerText);
        this.close();
    }

}
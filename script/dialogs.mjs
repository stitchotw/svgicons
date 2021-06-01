/*
 * 
 */

import { icon } from './icon.mjs';

// TODO: possibly switch on constant names instead, or maybe a map or object?

export class Dialog {

    constructor(id) {
        this.id = id;
    }

    addListener(buttonId, listener) {
        document.getElementById(buttonId).addEventListener("click", listener);
    }

    open() {
        const dialog = document.getElementById(this.id);
        dialog.style.display = "grid";
    }

    close() {
        const dialog = document.getElementById(this.id);
        dialog.style.display = "none";
    }
}

export class StandardDialog extends Dialog {

    constructor(id, openButtonId, closeButtonId) {
        super(id);
        // Arrow function necessary to give this correct scope
        this.addListener(openButtonId, evt => this.open());
        this.addListener(closeButtonId, evt => this.close());
    }

}

class SaveIconDialog extends StandardDialog {
    constructor() {
        super("save-icon-dialog", "save-icon-button", "close-save-icon-dialog-button");
        this.addListener("save-icon-to-file-button", evt => this.saveIconToFile());
        this.addListener("copy-icon-to-clipboard-button", evt => this.copyIconToClipobard());
    }

    open() {
        if (icon.isEmpty()) {
            alert("Nothing to save, icon is empty");
            return;
        }

        const previews = document.getElementsByClassName("icon-preview");
        for (const preview of previews) {
            // innerHtml does not work, 
            preview.replaceChildren(icon.getAsSVGImage());
        }

        const container = document.getElementById("icon-to-save");
        container.textContent = previews[0].innerHTML;

        super.open();
    }

    saveIconToFile() {
        const container = document.getElementById("icon-to-save");
        const text = container.textContent;

        const element = document.createElement('a');
        element.setAttribute('href', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', "test.svg");

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);

    }

    copyIconToClipobard() {
        var text_to_copy = document.getElementById("icon-to-save").textContent;

        if (!navigator.clipboard) {
            // use old commandExec() way ?
            alert("Clipboard not supported");
        } else {
            navigator.clipboard.writeText(text_to_copy).then(
                function () {
                    alert("SVG data copied to clipboard");
                })
                .catch(
                    function () {
                        alert("Unable to copy SVG data to clipboard");
                    });
        }
    }
}

class InputTextDialog extends Dialog {
    constructor() {
        super("input-text-dialog");
        this.addListener("input-text-to-icon-button", evt => {
            if (this.textChecker(this.text)) {
                this.textHandler(this.text);
                this.close();
            }
        });
        this.addListener("cancel-input-text-dialog-button", evt => this.close());
    }

    set header(h) {
        document.getElementById("input-text-dialog-header").innerText = h;
    }

    get text() {
        return document.getElementById("input-text").value;
    }

    set text(t) {
        document.getElementById("input-text").value = t;
    }

    open(header, textHandler, textChecker = (text) => { return text; }) {
        this.header = header;
        this.text = "";
        this.textHandler = textHandler;
        this.textChecker = textChecker;
        super.open();
    }
}

export const inputDialog = new InputTextDialog();

export function setUpDialogs() {
    // No need to save these in variables,
    // The listeners are enough

    new SaveIconDialog();
    new StandardDialog("new-icon-dialog", "new-icon-button", "close-new-icon-dialog-button");
    new StandardDialog("settings-dialog", "settings-button", "close-settings-dialog-button");
    new StandardDialog("help-dialog", "help-button", "close-help-dialog-button");

}

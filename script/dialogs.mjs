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

    removeListener(buttonId, listener) {
        document.getElementById(buttonId).removeEventListener("click", listener);
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

    constructor(id, openButtonId, closeButtonId, actionButtonId, actionButtonListener) {
        super(id);
        // Arrow function necessary to give this correct scope
        this.addListener(openButtonId, evt => this.open());
        this.addListener(closeButtonId, evt => this.close());
        if (actionButtonId) {
            this.addListener(actionButtonId, actionButtonListener);
        }
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
        const listener = (evt) => {
            if (this.regex.test(this.text)) {
                this.listener(this.text);
                this.close();
            } else {
                // TODO: Not displayed
                this.error = "Must match " + this.regex;
            }
        }
        this.addListener("input-text-done-button", listener);
        this.addListener("cancel-input-text-dialog-button", evt => this.close());
    }

    set header(h) {
        document.getElementById("input-text-dialog-header").innerText = h;
    }

    get text() {
        return document.getElementById("input-text").value.trim();
    }

    set text(t) {
        document.getElementById("input-text").value = t.trim();
    }

    set instructions(i) {
        document.getElementById("input-text-instructions").innerHTML = i;
    }

    open(header, instructions, text, regex, listener) {
        this.header = header;
        this.text = text;
        if (!instructions || instructions.charAt(0) === '/')
            throw "No instructions"
        this.instructions = "" + instructions + "<pre>" + regex.source + "</pre>";
        this.regex = regex;
        if (!listener)
            throw "No listener"
        this.listener = listener;
        super.open();
    }
}

const inputDialog = new InputTextDialog();

// TODO: Are all exported things in this module necessary any longer?

export function openPolylineDataDialog(data, listener) {
    inputDialog.open("Polyline data", "At least two points separated by space or newline, e.g.: 1,1 2,2", data, /^\d+[\s]*[,][\s]*\d+([\s]+\d+[\s]*[,][\s]*\d+)+$/, listener);
    return inputDialog.text;
}

export function openPolygonDataDialog(data, listener) {
    inputDialog.open("Polygon data", "At least three points separated by space or newline, e.g.: 1,1 2,2 3,3", data, /^\d+[\s]*[,][\s]*\d+([\s]+\d+[\s]*[,][\s]*\d+){2,}$/, listener);
    return inputDialog.text;
}

export function openPathDataDialog(data, listener) {
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
        "It is easier to read the data if you put one command per line. Don't put any commas between commands. <a href='https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths' target='_blank' class='help-link' title='Opens in new tab/window'>developer.mozilla.org have a good introduction to path data.</a>",
        data, new RegExp(all), listener);
    return inputDialog.text;
}

export function setUpDialogs() {
    // No need to save these in variables,
    // The listeners are enough

    new SaveIconDialog();
    new StandardDialog("new-icon-dialog", "new-icon-button", "close-new-icon-dialog-button", "clear-icon-button", () => { icon.clear(); });
    new StandardDialog("settings-dialog", "settings-button", "close-settings-dialog-button");
    new StandardDialog("help-dialog", "help-button", "close-help-dialog-button");

}

import { addLine, addCircle, addRectangle } from './icon.mjs';

export function setUpShapeLibrary() {
    addEventListeners();
}

function addEventListeners() {
    // () => is necessary since otherwise the listener method would be called when addEventListeners runs
    document.getElementById("add-horizontal-line-button").addEventListener("click", () => addLine(1, 1, 10, 1));
    document.getElementById("add-vertical-line-button").addEventListener("click", () => addLine(1, 1, 1, 10));
    document.getElementById("add-diagonal-left-to-right-button").addEventListener("click", () => addLine(1, 1, 10, 10));
    document.getElementById("add-diagonal-right-to-left-button").addEventListener("click", () => addLine(10, 1, 1, 10));
    /*
    document.getElementById("").addEventListener("click", );
    document.getElementById("").addEventListener("click", );
    document.getElementById("").addEventListener("click", );
    document.getElementById("").addEventListener("click", );
    */
}

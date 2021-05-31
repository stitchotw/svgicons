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
    document.getElementById("add-text-button").addEventListener("click", () => {
        const text = prompt("What text do you want to add?", "X");
        if(text){
            icon.addText(text, 16, 16);
        }
     });
    document.getElementById("add-unicode-symbol-button").addEventListener("click", () => { });
    // document.getElementById("").addEventListener("click", ()=>);
}

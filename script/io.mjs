// Load and save to local storage

import { icon } from "./icon.mjs";

export const CURRENT_ICON_ID = "_CURRENT_ICON_";

export function saveIconToLocalStorage(id) {
    const s = window.localStorage;
    s.setItem(id, JSON.stringify(icon.asObject));
}

const addFunctionNames = {
    line : "addLine",
    circle : "addCircle",
    ellipse: "addEllipse",
    rect: "addRectangle",
    text: "addText",
    polyline: "addPolyline",
    polygon: "addPolygon",
    path: "addPath"
}

export function loadIconFromLocalStorage(id) {
    const s = window.localStorage;
    const value = s.getItem(id);

    if (value) {
        try {
            const data = JSON.parse(value);

            icon.clear();

            for (const [attribute, value] of Object.entries(data.style)) {
                icon.style.get(attribute).value = value;
            }
            icon.updateUI();

            for(const shapeData of data.shapes){
                const shape = icon[addFunctionNames[shapeData.type]]();

                for (const [attribute, value] of Object.entries(shapeData.style)) {
                    shape.style.get(attribute).value = value;
                }
                for (const [attribute, value] of Object.entries(shapeData.attributes)) {
                    shape.attributes.get(attribute).value = value;
                }
                shape.updateUI();
            }
        } catch (error) {
            clearIconInLocalStorage(id);
            alert("Error when loading icon from local storage: " + error + "\nData cleared");
        }
    }
}

export function clearIconsInLocalStorage() {
    clearIconInLocalStorage(CURRENT_ICON_ID);
}

export function clearIconInLocalStorage(id) {
    const s = window.localStorage;
    s.removeItem(id);
}
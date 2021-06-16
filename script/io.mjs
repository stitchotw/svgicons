// Load and save to local storage

import { icon } from "./icon.mjs";

const ICON_IDS = ["_CURRENT_ICON_", "_template_1_", "_template_2_", "_template_3_"];
export const CURRENT_ICON_ID = ICON_IDS[0];

export function saveIconToLocalStorage(id) {
    const s = window.localStorage;
    s.setItem(id, JSON.stringify(icon.asObject));
}

const addFunctionNames = {
    line: "addLine",
    circle: "addCircle",
    ellipse: "addEllipse",
    rect: "addRectangle",
    text: "addText",
    polyline: "addPolyline",
    polygon: "addPolygon",
    path: "addPath"
}

/**
 * @param id 
 * @returns true if there was anyting in localstorage with the given id, false otherwise
 */
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

            for (const shapeData of data.shapes) {
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
        return true;
    }
    return false;
}

export function clearIconsInLocalStorage() {
    for (const id in ICON_IDS) {
        clearIconInLocalStorage(id);
    }
}

export function clearIconInLocalStorage(id) {
    const s = window.localStorage;
    s.removeItem(id);
}
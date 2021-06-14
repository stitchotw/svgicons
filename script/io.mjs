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
}

export function loadIconFromLocalStorage(id) {
    const s = window.localStorage;
    const value = s.getItem(id);

    console.log(s, value);

    if (value) {
        try {
            const data = JSON.parse(value);
            console.log(data);

            icon.clear();

            for (const [attribute, value] of Object.entries(data.style)) {
                console.log(attribute, value);
                icon.style.get(attribute).value = value;
            }
            icon.updateUI();

            for(const shapeData of data.shapes){
                console.log(shapeData);
                console.log(shapeData.type);
                console.log(addFunctionNames[shapeData.type]);
                console.log(icon[addFunctionNames[shapeData.type]]);
                const shape = icon[addFunctionNames[shapeData.type]]();

                for (const [attribute, value] of Object.entries(shapeData.style)) {
                    console.log(attribute, value);
                    shape.style.get(attribute).value = value;
                }
                for (const [attribute, value] of Object.entries(shapeData.attributes)) {
                    console.log(attribute, value);
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
// Load and save to local storage

import { icon } from "./icon.mjs";

export const CURRENT_ICON_ID = "_CURRENT_ICON_";

export function saveIconToLocalStorage(id) {
    const s = window.localStorage;
    s.setItem(id, JSON.stringify(icon.asObject));
}

export function loadIconFromLocalStorage(id) {
    const s = window.localStorage;
    const value = s.getItem(id);

    console.log(s, value);

    if (value) {
        try {
            const data = JSON.parse(value);
            console.log(data);
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
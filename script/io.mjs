// Load and save to local storage

export const CURRENT_ICON_ID = "_CURRENT_ICON_";

export function saveIconToLocalStorage(id){
    const s = window.localStorage;
    console.log(s);
    s.setItem(id, "set");
}

export function loadIconFromLocalStorage(id){
    const s = window.localStorage;
    console.log(s);
    const value = s.getItem(id);
    console.log(s, value);
}
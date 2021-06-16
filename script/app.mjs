/*
 * Coordinates setup of the various modules
 */

// TODO: rearrange these
import { setUpDialogs } from './dialogs.mjs';
import { setUpAttributes } from './attributes.mjs';
import { setUpWorkArea } from './workarea.mjs';
import { setUpShapeLibrary } from './shapelibrary.mjs';
import { CURRENT_ICON_ID } from './io.mjs';
import { saveIconToLocalStorage } from './io.mjs';
import { loadIconFromLocalStorage } from './io.mjs';

setUpApp();

function setUpApp() {
    // TODO: Load default values 
    // TODO: rearrange these
    setUpDialogs();
    setUpAttributes();
    setUpWorkArea();
    setUpShapeLibrary();

    loadIconFromLocalStorage(CURRENT_ICON_ID);

    window.onunload = (evt) => { 
        try {
            saveIconToLocalStorage(CURRENT_ICON_ID); 
        } catch (error) {
            console.trace(error);
        }
    }
}

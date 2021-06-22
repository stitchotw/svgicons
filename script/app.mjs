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
import { moveCurrentlySelectedShape } from './workarea.mjs';
import { deleteCurrentlySelectedShape } from './workarea.mjs';

setUpApp();

function setUpApp() {
    // TODO: Load default values 
    // TODO: rearrange these
    setUpDialogs();
    setUpAttributes();
    setUpWorkArea();
    setUpShapeLibrary();

    loadIconFromLocalStorage(CURRENT_ICON_ID);

    document.addEventListener('keydown', (evt) => {
        if (evt.target !== document.body)
            return;

        switch (evt.key) {
            case "ArrowUp":
                moveCurrentlySelectedShape(0, -1);
                break;
            case "ArrowDown":
                moveCurrentlySelectedShape(0, 1);
                break;
            case "ArrowLeft":
                moveCurrentlySelectedShape(-1, 0);
                break;
            case "ArrowRight":
                moveCurrentlySelectedShape(1, 0);
                break;
            case "Delete":
                deleteCurrentlySelectedShape();
                break;
        }
    });

    window.onunload = (evt) => {
        try {
            saveIconToLocalStorage(CURRENT_ICON_ID);
        } catch (error) {
            console.trace(error);
        }
    }
}

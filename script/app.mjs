/*
 * Coordinates setup of the various modules
 */

// TODO: rearrange these
import { setUpDialogs } from './dialogs.mjs';
import { setUpAttributes } from './attributes.mjs';
import { setUpWorkArea } from './workarea.mjs';
import { setUpShapeLibrary } from './shapelibrary.mjs';

setUpApp();

function setUpApp() {
    // TODO: Load default values 
    // TODO: rearrange these
    setUpDialogs();
    setUpAttributes();
    setUpWorkArea();
    setUpShapeLibrary();
}

/*
 * Coordinates setup of the various modules
 */

// TODO: rearrange these
import { setUpDialogs } from './dialogs.mjs';
import { setUpAttributes } from './attributes.mjs';
import { setUpWorkArea } from './workarea';

setUpApp();

function setUpApp() {
    // TODO: Load default values 
    // TODO: rearrange these
    setUpDialogs();
    setUpAttributes();
    setUpWorkArea();
}

// TODO: Remove most (or all) of these

var shapeIdCounter = 0;
var shapes = new Map();
var selectedUIShape = null;
var canStartDragging = false;
var isDragging = false;
var dragOffsetX, dragOffsetY;

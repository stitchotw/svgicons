/*
 * 
 */
import { selectedShapeChanged } from './attributes.mjs';
import { shapeFromId, deleteShapeById } from './icon.mjs';

const workarea = document.getElementById('workarea');

let selectedShape = null;
let dragging = false;
let offset;
let transform;

export function setUpWorkArea() {
    addBackgroundToWorkarea();
    addEventListeners();
    makeWorkareaDraggable();
}

function addBackgroundToWorkarea() {
}

function addEventListeners() {
    //    workarea.addEventListener("drop", dropDraggedShape);
    //    workarea.addEventListener("dragover", allowDrop);
}


/*
 * Drag'n drop of shapes
 * Based on https://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/
 */


function makeWorkareaDraggable() {
    workarea.addEventListener("dragover", allowDrop);

    // Mouse
    workarea.addEventListener('mousedown', startDrag);
    workarea.addEventListener('mousedown', startDrag);
    workarea.addEventListener('mousemove', drag);
    workarea.addEventListener('mouseup', endDrag);
    workarea.addEventListener('mouseleave', endDrag);

    // Touch
    workarea.addEventListener('touchstart', startDrag);
    workarea.addEventListener('touchmove', drag);
    workarea.addEventListener('touchend', endDrag);
    workarea.addEventListener('touchleave', endDrag);
    workarea.addEventListener('touchcancel', endDrag);
}

function allowDrop(event) {
    if (dragging) {
        event.preventDefault();
    }
}

function startDrag(evt) {
    if (evt.target.classList.contains('draggable')) {
        selectShape(evt.target);
        dragging = true;

        var transforms = selectedShape.transform.baseVal;
        transform = transforms.getItem(0);

        offset = getMousePosition(evt);
        offset.x -= transform.matrix.e;
        offset.y -= transform.matrix.f;
    }
}

function getMousePosition(evt) {
    var CTM = workarea.getScreenCTM();

    // Handles several touches by picking the first one
    if (evt.touches) {
        evt = evt.touches[0];
    }

    return {
        x: (evt.clientX - CTM.e) / CTM.a,
        y: (evt.clientY - CTM.f) / CTM.d
    };
}

function getNewPosition(evt) {
    const pos = getMousePosition(evt);
    pos.x = Math.round(pos.x - offset.x);
    pos.y = Math.round(pos.y - offset.y);
    return pos;
}

function drag(evt) {
    if (dragging) {
        evt.preventDefault();
        const pos = getNewPosition(evt);
        transform.setTranslate(pos.x, pos.y);
    }
}

function endDrag(evt) {
    if (dragging)
        shapeFromId(selectedShape.id).applyTransformMatrix();
    dragging = false;
    offset = null;
    transform = null;
}

export function addUIShape(shape) {
    const element = shape.uiShape;
    workarea.appendChild(element);
    selectShape(element);
}

export function deleteCurrentlySelectedShape() {
    if (selectedShape) {
        deleteShapeById(selectedShape.id);
        workarea.removeChild(selectedShape);
        unselectCurrentlySelectedShape();
    }
}

function selectShape(shape) {
    if (shape != selectedShape) {
        unselectCurrentlySelectedShape();

        if (shape) {
            selectedShape = shape;
            shape.classList.add('selected-shape');
            selectedShapeChanged(shape.id);
        }
    }
}

function unselectCurrentlySelectedShape() {
    if (selectedShape) {
        selectedShape.classList.remove('selected-shape');
        selectedShape = null;
        selectedShapeChanged(null);
    }
}

function getSelectedShapeNode() {
    if (!selectedShape) {
        throw "No UI shape selected";
    }

    return shapes.get(selectedShape.id);
}

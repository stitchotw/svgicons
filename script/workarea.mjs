/*
 * 
 */
import { selectedShapeChanged } from './attributes.mjs';


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
    console.log(evt.target);
    if (evt.target.classList.contains('draggable')) {
        selectedShape = evt.target;
        dragging = true;

        // TODO: not a good place for it, this is getting convoluted,
        // especially since we have two representations of the selected
        // shape.
        selectShape(selectedShape);

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
    var pos = getMousePosition(evt);
    pos.x = Math.round(pos.x - offset.x);
    pos.y = Math.round(pos.y - offset.y);
    return pos;
}

function drag(evt) {
    if (dragging) {
        evt.preventDefault();

        var coord = getMousePosition(evt);
        transform.setTranslate(Math.round(coord.x - offset.x), Math.round(coord.y - offset.y));

        //            selectedShape.setAttribute("x", Math.round(coord.x - offset.x));
        /*            
                    var pos = getNewPosition(evt);
                    transform.setTranslate(pos.x - offset.x, pos.y - offset.y);
                    */
    }
}

function endDrag(evt) {
    dragging = false;
    offset = null;
    transform = null;
}

export function addUIShape(shape) {
    const element = shape.uiShape;
    workarea.appendChild(element);

    // Add translate to handle movement, see 
    // https://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/
    const translate = workarea.createSVGTransform();
    translate.setTranslate(0, 0);
    element.transform.baseVal.insertItemBefore(translate, 0);

    selectShape(element);
}

export function deleteCurrentlySelectedShape() {
    if (selectedShape) {
        shapes.delete(selectedShape.id);
        getWorkArea().removeChild(selectedShape);
        unselectCurrentlySelectedShape();
    }
}

function selectShape(shape) {
    if (shape != selectedShape) {
        unselectCurrentlySelectedShape();
        shape.classList.add('selected-shape');
        selectedShape = shape;
        selectedShapeChanged(shape.id);
    }
}

function unselectCurrentlySelectedShape() {
    if (selectedShape) {
        selectedShape.classList.remove('selected-shape');
        selectedShape = null;
        selectedShapeChanged(null);
    }
}

function getSelectedShapeNodel() {
    if (!selectedShape) {
        throw "No UI shape selected";
    }

    return shapes.get(selectedShape.id);
}

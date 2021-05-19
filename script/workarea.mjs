/*
 * 
 */

function addEventListeners() {
    // Work area
    document.getElementById("workarea").addEventListener("drop", dropDraggedShape);
    document.getElementById("workarea").addEventListener("dragover", allowDrop);

    // Current shape
    document.getElementById("delete-selected-shape-button").addEventListener("click", deleteCurrentlySelectedShape);
}

function getWorkArea() {
    return document.getElementById('workarea');
}

function addShape(shape) {
    if (shapes.has(shape.id)) {
        throw "Duplicate id when adding shape";
    }

    shapes.set(shape.id, shape);

    const element = shape.toSVGFragment();
    const svg = getWorkArea();
    svg.appendChild(element);
    const translate = svg.createSVGTransform();
    translate.setTranslate(0, 0);
    element.transform.baseVal.insertItemBefore(translate, 0);
    selectShape(element);
}

function deleteCurrentlySelectedShape() {
    if (selectedUIShape) {
        shapes.delete(selectedUIShape.id);
        getWorkArea().removeChild(selectedUIShape);
        unselectCurrentlySelectedShape();
    }
}

function selectShape(shape) {
    if (shape != selectedUIShape) {
        unselectCurrentlySelectedShape();
        shape.classList.add('selected-shape');
        selectedUIShape = shape;
        showAttributesOfCurrentlySelectedShape();
    }
}

function unselectCurrentlySelectedShape() {
    if (selectedUIShape) {
        selectedUIShape.classList.remove('selected-shape');
        selectedUIShape = null;
        hideAllShapeAttributes();
    }
}

function getSelectedShapeNodel() {
    if (!selectedUIShape) {
        throw "No UI shape selected";
    }

    return shapes.get(selectedUIShape.id);
}


export function setUpWorkArea(){

}

function addBackgroundToWorkarea() {

}

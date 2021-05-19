
/*
 * Drag'n drop of shapes
 * Based on https://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/
 */

function makeWorkareaDraggable() {
    var svg = getWorkArea();

    // Mouse
    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('mousemove', drag);
    svg.addEventListener('mouseup', endDrag);
    svg.addEventListener('mouseleave', endDrag);

    // Touch
    svg.addEventListener('touchstart', startDrag);
    svg.addEventListener('touchmove', drag);
    svg.addEventListener('touchend', endDrag);
    svg.addEventListener('touchleave', endDrag);
    svg.addEventListener('touchcancel', endDrag);


    var selectedElement = null;
    var offset;
    var transform;

    function startDrag(evt) {
        if (evt.target.classList.contains('draggable')) {
            selectedElement = evt.target;

            // TODO: not a good place for it, this is getting convoluted,
            // especially since we have two representations of the selected
            // shape.
            selectShape(selectedElement);

            var transforms = selectedElement.transform.baseVal;
            transform = transforms.getItem(0);

            offset = getMousePosition(evt);
            offset.x -= transform.matrix.e;
            offset.y -= transform.matrix.f;
        }
    }

    function getMousePosition(evt) {
        var CTM = svg.getScreenCTM();

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
        if (selectedElement) {
            evt.preventDefault();

            var coord = getMousePosition(evt);
            transform.setTranslate(Math.round(coord.x - offset.x), Math.round(coord.y - offset.y));

            //            selectedElement.setAttribute("x", Math.round(coord.x - offset.x));
            /*            
                        var pos = getNewPosition(evt);
                        transform.setTranslate(pos.x - offset.x, pos.y - offset.y);
                        */
        }
    }

    function endDrag(evt) {
        selectedElement = null;
        offset = null;
        transform = null;
    }
}

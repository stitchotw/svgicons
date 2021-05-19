/*
 * Utility functions to work with the DOM
 */


export function addClass(elements, className) {
    for (const element of elements) {
        element.classList.add(className);
    }
}

export function removeClass(elements, className) {
    for (const element of elements) {
        element.classList.remove(className);
    }
}

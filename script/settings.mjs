/*
 * Handles settings, currently only while app is active
 * TODO: store in cookies
 */

const DEFAULT_COLOR = "black";

export const settings = new SettingsManager();

class SettingsManager {
    constructor() {
        this.newIconSize = 32;
        this.defaultStyle = new Style(DEFAULT_COLOR);
    }
}

export class Style {
    constructor(fill) {
        this.stroke = new Stroke();
        this.fill = fill ? fill : "none";
    }
}

export class Stroke {
    constructor() {
        this.width = 1;
        this.color = DEFAULT_COLOR;
        this.rounded = true;
    }
}
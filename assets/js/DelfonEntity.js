import {Vector2} from "./DelfonMath.js";

export default class DelfonEntity {

    position = new Vector2(0, 0);
    velocity = new Vector2(0, 0);
    size = new Vector2(200, 100);

    constructor() {}

    update() {}

    draw(context) {}

    readyForDeletion() {
        return false;
    }

}
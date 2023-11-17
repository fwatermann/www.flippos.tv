import {Vector2} from "./DelfonMath.js";

export default class DelfonBox {

    position = new Vector2(0, 0);
    size = new Vector2(0, 0);

    constructor(position, size) {
        this.position = position;
        this.size = size;
    }

    update() {
    }

    draw(context) {
        context.strokeStyle = "#0000ff";
        context.strokeRect(this.position.x - this.size.x / 2, this.position.y - this.size.y / 2, this.size.x, this.size.y);

        context.fillStyle = "#ff0000";
        context.beginPath();
        context.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2, false);
        context.fill();
        context.closePath();
    }

    isIn(x, y) {
        return x > this.position.x - this.size.x / 2 && x < this.position.x + this.size.x / 2 && y > this.position.y - this.size.y / 2 && y < this.position.y + this.size.y / 2;
    }

    intersects(box) {
        return this.isIn(box.position.x - box.size.x / 2, box.position.y - box.size.y / 2) || this.isIn(box.position.x + box.size.x / 2, box.position.y - box.size.y / 2) || this.isIn(box.position.x - box.size.x / 2, box.position.y + box.size.y / 2) || this.isIn(box.position.x + box.size.x / 2, box.position.y + box.size.y / 2);
    }

}
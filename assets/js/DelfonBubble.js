import {Vector2} from "./DelfonMath.js";
import DelfonEntity from "./DelfonEntity.js";

export default class DelfonBubble extends DelfonEntity {

    position = new Vector2(0, 0);
    velocity = new Vector2(0, 0);

    constructor(position) {
        super();
        this.position = position;
        let size = Math.random() * 15 + 5;
        this.size = new Vector2(size, size);
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.multiply(0.98);
        this.velocity.y -= 0.15 / (Math.max(30 - this.size.x, 1) / 2);
        if(this.velocity > 5) {
            this.velocity.multiply(0.9);
        }
    }

    draw(context) {
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.size.x / 2, 0, Math.PI * 2, false);
        context.fillStyle = "#5c9fe880";
        context.strokeStyle = "#3570da";
        context.fill();
        context.stroke();
        context.closePath();
    }

    readyForDeletion() {
        return this.position.y < -this.size.x;
    }

}
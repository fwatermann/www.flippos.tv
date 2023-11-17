import DelfonEntity from "./DelfonEntity.js";
import {Vector2} from "./DelfonMath.js";
import DelfonBox from "./DelfonBox.js";

export default class SchickenNugget extends DelfonEntity {

    static TEXTURE = new Image();
    static {
        SchickenNugget.TEXTURE.src = "/assets/img/schicken_nugget.png";
    }

    hitbox;

    constructor() {
        super();
        this.size = new Vector2(25, 25);
        this.position = new Vector2(Math.random() * (window.innerWidth - 200) + 100, Math.random() * (window.innerHeight - 200) + 100);
        this.hitbox = new DelfonBox(this.position, this.size);
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.multiply(0.98);
        if(this.velocity > 3) {
            this.velocity.multiply(0.85);
        }
        if(this.position.x <= this.size.x || this.position.x >= window.innerWidth - this.size.x) {
            this.velocity.x *= -1;
        }
        if(this.position.y <= this.size.y || this.position.y >= window.innerHeight - this.size.y) {
            this.velocity.y *= -1;
        }
    }

    draw(context) {
        context.drawImage(SchickenNugget.TEXTURE, this.position.x - this.size.x / 2, this.position.y - this.size.y / 2, this.size.x, this.size.y);

        if(window.debug) {
            this.hitbox.draw(context);
        }
    }

}
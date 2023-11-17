import DelfonBox from "./DelfonBox.js";
import { Vector2 } from "./DelfonMath.js";
import DelfonAnimation from "./DelfonAnimation.js";
import {SwimmingDelfons} from "./main.js";
import DelfonBubble from "./DelfonBubble.js";
import DelfonEntity from "./DelfonEntity.js";
import SchickenNugget from "./SchickenNugget.js";


export default class Delfon extends DelfonEntity {

    static texture = new Image();
    static maxSpeed = 8;
    static minSpeed = 2;
    static {
        Delfon.texture.src = "/assets/img/delfon.png";
    }

    curve = Math.random() * 1000;
    target = new Vector2(window.innerWidth / 2, window.innerHeight / 2);

    turningAnimation = new DelfonAnimation();
    bellyAnimation = new DelfonAnimation();

    headHitbox;
    bodyHitbox;

    constructor(position, velocity) {
        super();
        this.position = position;
        this.velocity = velocity ?? new Vector2(Math.random() * 4 - 2, 0);
        this.size = new Vector2(200, 100);

        this.turningAnimation.target = 1; //this.velocity.x < 0 ? -1 : 1;
        this.turningAnimation.current = 1; //this.velocity.x < 0 ? -1 : 1;
        this.turningAnimation.step = 1 / 15;

        this.bellyAnimation.target = 1;
        this.bellyAnimation.current = 1;
        this.bellyAnimation.step = 1 / 10;

        this.target = new Vector2(Math.random() * window.innerWidth, Math.random() * window.innerHeight);

        this.init();
    }

    init() {
        this.headHitbox = new DelfonBox(new Vector2(0, 0), new Vector2(25, 25));
        this.bodyHitbox = new DelfonBox(new Vector2(0, 0), new Vector2(this.size.x - 40, this.size.y - 40));
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.multiply(0.98);

        let direction = this.target.copy();
        direction.subtract(this.position);
        let distance = direction.length();

        if(distance < 75) {
            this.target = new Vector2(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
        }
        direction.normalize();
        this.velocity.x += direction.x / 20;
        this.velocity.y += direction.y / 20 + Math.cos(this.curve / 10) / 15;

        if(Math.round((Math.random() * 100000)) === 50000) {
            this.bellyAnimation.target = this.bellyAnimation.target = -1;
        }
        if(Math.round((Math.random() * 500)) === 250 && this.bellyAnimation.target === -1) {
            this.bellyAnimation.target = this.bellyAnimation.target = 1;
        }
        if(Math.round((Math.random() * 1000)) === 500) {
            let count = Math.round(Math.random() * 5);
            for(let i = 0; i < count; i++) {
                let pos = this.position.copy();
                pos.x += Math.random() * 50 - 25;
                pos.y += Math.random() * 50 - 25;
                SwimmingDelfons.getInstance().entities.push(new DelfonBubble(pos));
            }
        }

        if(Math.round(Math.random() * 1000) === 500) {
            this.velocity.multiply(Math.random() + 0.5);
        }


        this.curve += Math.random();
        this.updateHitbox();
        this.turningAnimation.update();
        this.bellyAnimation.update();

        if(this.velocity.length() > Delfon.maxSpeed) {
            this.velocity.normalize();
            this.velocity.multiply(Delfon.maxSpeed);
        }
        if(this.velocity.length() < Delfon.minSpeed) {
            this.velocity.normalize();
            this.velocity.multiply(Delfon.minSpeed);
        }

        SwimmingDelfons.getInstance().entities.filter(e => e instanceof SchickenNugget).forEach(nugget => {
            if(this.headHitbox.intersects(nugget.hitbox)) {
                const force = this.velocity.copy();
                force.multiply(0.5);
                nugget.velocity.add(force);
            }
        });

    }

    updateHitbox() {
        const direction = this.velocity.normalized().copy();
        direction.multiply(80);
        const headPos = this.position.copy();
        headPos.add(direction);
        this.headHitbox.position = new Vector2(headPos.x, headPos.y);
        this.bodyHitbox.position = this.position.copy();
    }

    draw(context) {
        context.fillStyle = "#ffffff";

        let angle = Math.atan2(this.velocity.y, this.velocity.x);

        context.save();
        context.translate(this.position.x, this.position.y);
        //context.rotate(Math.sin(this.curve / 10) / 10);
        if(angle < -Math.PI / 2) {
            angle += Math.PI;
            this.turningAnimation.target = -1;
        } else if(angle > Math.PI / 2) {
            angle -= Math.PI;
            this.turningAnimation.target = -1;
        } else {
            this.turningAnimation.target = 1;
        }
        context.rotate(angle);
        context.scale(this.turningAnimation.current, this.bellyAnimation.current);
        context.translate(-this.position.x, -this.position.y);
        context.drawImage(Delfon.texture, this.position.x - this.size.x / 2, this.position.y - this.size.y / 2, this.size.x, this.size.y);
        context.restore();

        if(window.debug) {
            context.fillStyle = "#00ff00";
            context.fontSize = "12px";
            context.fillText(`position.x: ${this.position.x}`, this.position.x - 75, this.position.y + 50);
            context.fillText(`position.y: ${this.position.y}`, this.position.x - 75, this.position.y + 60);
            context.fillText(`velocity.x: ${this.velocity.x}`, this.position.x - 75, this.position.y + 70);
            context.fillText(`velocity.y: ${this.velocity.y}`, this.position.x - 75, this.position.y + 80);

            context.fillStyle = Math.abs(Math.atan2(this.velocity.y, this.velocity.x)) > Math.PI / 2 ? "#ff0000" : "#0000ff";
            context.fillText(`angle: ${Math.atan2(this.velocity.y, this.velocity.x)}`, this.position.x - 75, this.position.y + 90);



            context.strokeStyle = "#ff0000";
            context.beginPath();
            context.moveTo(this.position.x, this.position.y);
            context.lineTo(this.target.x, this.target.y);
            context.stroke();
            context.closePath();

            this.headHitbox.draw(context);
            this.bodyHitbox.draw(context);
        }
    }

}
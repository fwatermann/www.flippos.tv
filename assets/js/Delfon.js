import DelfonBox from "./DelfonBox.js";
import {Vector2} from "./DelfonMath.js";
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
    initSize = new Vector2(200, 100);
    rotation = 0;

    turningAnimation = new DelfonAnimation( 500, -1, 1, "ease");
    bellyAnimation =   new DelfonAnimation( 250, -1, 1, "ease");
    loopingAnimation = new DelfonAnimation(8000, 0,  1, "linear");
    loopingCenter = new Vector2(0, 0);
    loopingAngle = 0;
    loopingRadius = 100;

    state = "idle";

    headHitbox;
    bodyHitbox;

    constructor(position, velocity) {
        super();
        this.position = position;
        this.velocity = velocity ?? new Vector2(Math.random() * 4 - 2, 0);
        this.size = this.initSize.copy();
        this.target = new Vector2(Math.random() * window.innerWidth, Math.random() * window.innerHeight);

        this.bellyAnimation.endAnimation();
        this.turningAnimation.endAnimation();

        this.headHitbox = new DelfonBox(new Vector2(0, 0), new Vector2(25, 25));
        this.bodyHitbox = new DelfonBox(new Vector2(0, 0), new Vector2(this.size.x - 40, this.size.y - 40));
    }

    update() {
        switch(this.state) {
            case "idle":
                this.updateIdle();
                break;
            case "looping":
                this.updateLooping();
                break;
            default:
                this.updateIdle();
                break;
        }

        this.updateHitbox();
    }

    updateIdle() {
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

        if(Math.round((Math.random() * 100000)) === 50000 && this.bellyAnimation.end === 1) {
            this.bellyFlip();
        }
        if(Math.round((Math.random() * 500)) === 250 && this.bellyAnimation.end === -1) {
            this.bellyFlip();
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

        let angle = Math.atan2(this.velocity.y, this.velocity.x);
        if(angle < -Math.PI / 2 || angle > Math.PI / 2) {
            if(this.turningAnimation.end !== -1) {
                this.turningAnimation.end = -1;
                this.turningAnimation.start = 1;
                this.turningAnimation.resetAnimation();
                this.turningAnimation.startAnimation();
            }
        } else if(this.turningAnimation.end !== 1) {
            this.turningAnimation.end = 1;
            this.turningAnimation.start = -1;
            this.turningAnimation.resetAnimation();
            this.turningAnimation.startAnimation();
        }

        this.curve += Math.random();
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
                this.size.multiply(1.1);
                this.size.x = Math.min(this.initSize.x * 2, this.size.x);
                this.size.y = Math.min(this.initSize.y * 2, this.size.y);
                nugget.destroy = true;
                this.startLooping();
            }
        });

        this.size.multiply(0.9998);
        this.size.x = Math.max(200, this.size.x);
        this.size.y = Math.max(100, this.size.y);

        this.rotation = Math.atan2(this.velocity.y, this.velocity.x);
    }

    updateLooping() {

        if(this.loopingAnimation.finished()) {
            this.state = "idle";
            this.target = new Vector2(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
            return;
        }

        const nextTarget = this.loopingCenter.copy();
        const rotVec = new Vector2(1, 0);
        rotVec.rotate(this.loopingAngle + (4 * 2 * Math.PI * this.loopingAnimation.current));
        rotVec.multiply(this.loopingRadius);
        nextTarget.subtract(rotVec);
        this.position = nextTarget;
        this.rotation = Math.atan2(this.position.y - this.loopingCenter.y, this.position.x - this.loopingCenter.x) + Math.PI / 2

        this.loopingAnimation.update();
    }

    startLooping() {
        this.turningAnimation.endAnimation();
        this.bellyAnimation.endAnimation();

        let direction = this.velocity.normal().normalized();
        this.loopingAngle = Math.atan2(direction.y, direction.x);
        direction.multiply(this.loopingRadius);
        this.loopingCenter = this.position.copy();
        this.loopingCenter.add(direction);
        this.target = this.loopingCenter.copy();

        const speed = Math.max(Delfon.minSpeed, Math.min(this.velocity.length(), Delfon.maxSpeed)) / 8;
        const lengthOfPath = 4 * (2 * this.loopingRadius * Math.PI);

        this.loopingAnimation.duration = (lengthOfPath / speed);
        this.loopingAnimation.resetAnimation();
        this.loopingAnimation.startAnimation();

        this.state = "looping";
    }

    bellyFlip() {
        const start = this.bellyAnimation.end;
        this.bellyAnimation.start = this.bellyAnimation.end;
        this.bellyAnimation.end = start;
        this.bellyAnimation.resetAnimation();
        this.bellyAnimation.startAnimation();
    }

    updateHitbox() {
        const direction = new Vector2(1, 0);
        direction.rotate(this.rotation);
        direction.multiply((80 / this.initSize.x) * this.size.x);
        const headPos = this.position.copy();
        headPos.add(direction);

        this.headHitbox.position = new Vector2(headPos.x, headPos.y);
        this.bodyHitbox.position = this.position.copy();

        const a = (this.size.x * (40 / this.initSize.x));
        const b = (this.size.y * (40 / this.initSize.y));
        this.bodyHitbox.size = new Vector2(this.size.x - a, this.size.y - b);

        const c = (this.size.x * (25 / this.initSize.x));
        const d = (this.size.y * (25 / this.initSize.y));
        this.headHitbox.size = new Vector2(c, d);

        const angle = Math.atan2(this.velocity.y, this.velocity.x);
        this.headHitbox.rotation = this.rotation;
        this.bodyHitbox.rotation = this.rotation;
    }

    draw(context) {
        context.fillStyle = "#ffffff";
        context.save();
        context.translate(this.position.x, this.position.y);
        context.rotate(this.rotation);
        context.scale(1, this.turningAnimation.current * this.bellyAnimation.current);
        context.translate(-this.position.x, -this.position.y);
        context.drawImage(Delfon.texture, this.position.x - this.size.x / 2, this.position.y - this.size.y / 2, this.size.x, this.size.y);
        context.restore();

        this.drawDebug(context);
    }

    drawDebug(context) {

        if(window.debug.info) {
            context.fillStyle = "#000000";
            context.fontSize = "12px";
            context.fillText(`position: ${Math.round(this.position.x * 100) / 100},${Math.round(this.position.y * 100) / 100}`, this.position.x - 75, this.position.y + 40);
            context.fillText(`velocity: ${Math.round(this.velocity.x * 100) / 100},${Math.round(this.velocity.y * 100) / 100}`, this.position.x - 75, this.position.y + 50);
            context.fillText(`size: ${Math.round(this.size.x * 100) / 100},${Math.round(this.size.y * 100) / 100}`, this.position.x - 75, this.position.y + 60);
            context.fillText(`angle: ${Math.round((this.rotation * 180 / Math.PI) * 100) / 100}°`, this.position.x - 75, this.position.y + 70);
            context.fillText(`speed: ${Math.round(this.velocity.length() * 100) / 100}`, this.position.x - 75, this.position.y + 80);
            context.fillText(`turning: ${this.turningAnimation.end}/${this.turningAnimation.current}/${this.turningAnimation.running}/${this.turningAnimation.progress}`, this.position.x - 75, this.position.y + 90);
        }

        if(window.debug.target) {
            context.strokeStyle = "#ff0000";
            context.beginPath();
            context.moveTo(this.headHitbox.position.x, this.headHitbox.position.y);
            context.lineTo(this.target.x, this.target.y);
            context.stroke();
            context.closePath();
        }

        if(window.debug.velocity) {
            context.strokeStyle = "#00ff00";
            context.beginPath();
            context.moveTo(this.position.x, this.position.y);
            context.lineTo(this.position.x + this.velocity.x * 10, this.position.y + this.velocity.y * 10);
            context.stroke();
            context.closePath();
        }

        if(window.debug.hitbox) {
            this.headHitbox.draw(context);
            this.bodyHitbox.draw(context);
        }


    }


}
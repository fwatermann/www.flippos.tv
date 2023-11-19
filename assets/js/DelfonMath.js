export class Vector2 {

    x = 0;
    y = 0;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
    }

    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    length2() {
        return this.x * this.x + this.y * this.y;
    }

    normalize() {
        let length = this.length();
        this.x /= length;
        this.y /= length;
    }

    normalized() {
        let length = this.length();
        return new Vector2(this.x / length, this.y / length);
    }

    copy() {
        return new Vector2(this.x, this.y);
    }

    rotate(angle) {
        let x = this.x;
        let y = this.y;
        this.x = x * Math.cos(angle) - y * Math.sin(angle);
        this.y = x * Math.sin(angle) + y * Math.cos(angle);
    }

    normal() {
        return new Vector2(-this.y, this.x);
    }

}

import {Vector2} from "./DelfonMath.js";

export default class DelfonBox {

    position = new Vector2(0, 0);
    size = new Vector2(0, 0);
    rotation = 0;

    constructor(position, size) {
        this.position = position;
        this.size = size;
    }

    update() {
    }

    draw(context) {

        context.save();
        context.translate(this.position.x, this.position.y);
        context.rotate(this.rotation);
        context.translate(-this.position.x, -this.position.y);
        context.strokeStyle = "#0000ff";
        context.strokeRect(this.position.x - this.size.x / 2, this.position.y - this.size.y / 2, this.size.x, this.size.y);
        context.restore();

        context.fillStyle = "#ff0000";
        context.beginPath();
        context.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2, false);
        context.fill();
        context.closePath();
    }

    isIn(x, y) {

        const triangleArea = (A, B, C) => {
            return Math.abs((A.x*(B.y-C.y) + B.x*(C.y-A.y) + C.x*(A.y-B.y))/2.0);
        }

        const corners = this.corners();
        const P = new Vector2(x, y);
        const a1 = triangleArea(corners[0], P, corners[1]);
        const a2 = triangleArea(corners[1], P, corners[2]);
        const a3 = triangleArea(corners[2], P, corners[3]);
        const a4 = triangleArea(corners[3], P, corners[0]);
        const a = triangleArea(corners[0], corners[1], corners[2]) + triangleArea(corners[0], corners[3], corners[2]);

        // If the sum of the areas of the triangles is equal to the area of the rectangle, the point is inside or on the rectangle.
        return a >= (a1 + a2 + a3 + a4);
    }

    intersects(box) {
        return this.isIn(box.position.x - box.size.x / 2, box.position.y - box.size.y / 2)
            || this.isIn(box.position.x + box.size.x / 2, box.position.y - box.size.y / 2)
            || this.isIn(box.position.x - box.size.x / 2, box.position.y + box.size.y / 2)
            || this.isIn(box.position.x + box.size.x / 2, box.position.y + box.size.y / 2);
    }

    corners() {
        const a = this.position.x - this.size.x / 2;
        const b = this.position.y - this.size.y / 2;
        const c = this.position.x + this.size.x / 2;
        const d = this.position.y + this.size.y / 2;

        const x1 = Math.cos(this.rotation) * (a - this.position.x) - Math.sin(this.rotation) * (b - this.position.y) + this.position.x;
        const y1 = Math.sin(this.rotation) * (a - this.position.x) + Math.cos(this.rotation) * (b - this.position.y) + this.position.y;

        const x2 = Math.cos(this.rotation) * (c - this.position.x) - Math.sin(this.rotation) * (b - this.position.y) + this.position.x;
        const y2 = Math.sin(this.rotation) * (c - this.position.x) + Math.cos(this.rotation) * (b - this.position.y) + this.position.y;

        const x3 = Math.cos(this.rotation) * (a - this.position.x) - Math.sin(this.rotation) * (d - this.position.y) + this.position.x;
        const y3 = Math.sin(this.rotation) * (a - this.position.x) + Math.cos(this.rotation) * (d - this.position.y) + this.position.y;

        const x4 = Math.cos(this.rotation) * (c - this.position.x) - Math.sin(this.rotation) * (d - this.position.y) + this.position.x;
        const y4 = Math.sin(this.rotation) * (c - this.position.x) + Math.cos(this.rotation) * (d - this.position.y) + this.position.y;

        return [new Vector2(x1, y1), new Vector2(x2, y2), new Vector2(x3, y3), new Vector2(x4, y4)];
    }

}
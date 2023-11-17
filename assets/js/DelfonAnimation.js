export default class DelfonAnimation {

    step = 1 / 60;
    target = 1;
    current = 1;

    constructor() {}

    update() {
        if(this.current < this.target) {
            this.current += this.step;
        } else if(this.current > this.target) {
            this.current -= this.step;
        }
        if(Math.abs(this.target - this.current) <= this.step) {
            this.current = this.target;
        }
    }

}
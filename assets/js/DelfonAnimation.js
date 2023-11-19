export default class DelfonAnimation {

    duration = 0;
    func = "linear";
    start = 0
    end = 1;
    current = 1;
    progress = 0;
    running = false;

    constructor(duration, start, end, func) {
        this.duration = duration ?? 1000;
        this.start = start ?? 0;
        this.end = end ?? 1;
        this.func = func ?? "linear";
        this.current = this.start;
    }

    update() {
        if(!this.running) return;
        if(this.progress === 1 || 1 - this.progress < 0.001) {
            this.progress = 1;
            this.current = this.end;
            this.running = false;
            return;
        }
        this.progress += 1 / (this.duration / 1000) / window.frameRate;
        if(this.func === "linear") {
            this.current = this.start + (this.end - this.start) * this.progress;
        } else if(this.func === "ease-in") {
            this.current = this.start + (this.end - this.start) * Math.pow(this.progress, 2);
        } else if(this.func === "ease-out") {
            this.current = this.start + (this.end - this.start) * (1 - Math.pow(1 - this.progress, 2));
        } else if(this.func === "ease-in-out" || this.func === "ease") {
            this.current = this.start + (this.end - this.start) * (this.progress < 0.5 ? 2 * Math.pow(this.progress, 2) : 1 - Math.pow(-2 * this.progress + 2, 2) / 2);
        }
    }

    startAnimation() {
        this.running = true;
    }

    stopAnimation() {
        this.running = false;
    }

    resetAnimation() {
        this.progress = 0;
        this.current = this.start;
    }

    endAnimation() {
        this.progress = 1;
        this.current = this.end;
    }

    finished() {
        return !this.running && this.progress === 1;
    }

}
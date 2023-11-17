
import Delfon from "./Delfon.js";
import {Vector2} from "./DelfonMath.js";
import SchickenNugget from "./SchickenNugget.js";

const canvasElement = document.getElementsByTagName("canvas")[0];
const context = canvasElement.getContext("2d");

const delfonCount = 20;

window.debug = false;
window.mousePosition = {
    x: 0,
    y: 0
}

export class SwimmingDelfons {

    static instance;
    static getInstance() {
        if(!SwimmingDelfons.instance) {
            SwimmingDelfons.instance = new SwimmingDelfons();
        }
        return SwimmingDelfons.instance;
    }

    entities = [];

    setup() {
        window.addEventListener("resize", () => {
            canvasElement.width = window.innerWidth;
            canvasElement.height = window.innerHeight;
        });
        window.addEventListener("keydown", (event) => {
            if(event.key === "d" && !event.repeat) {
                window.debug = !window.debug;
                console.log("DEBUG ON");
            }
        });
        window.addEventListener("mousemove", (event) => {
            window.mousePosition = {
                x: event.x,
                y: event.y
            };
        });
        document.getElementById("addSchickenNuggetButton").addEventListener("click", () => {
            this.entities.push(new SchickenNugget());
        })

        canvasElement.width = window.innerWidth;
        canvasElement.height = window.innerHeight

        for(let i = 0; i < delfonCount; i ++) {
            const delfon = new Delfon(new Vector2(Math.random() * canvasElement.width, Math.random() * canvasElement.height));
            this.entities.push(delfon);
        }
    }

    loop() {
        let keep = [];
        this.entities.forEach(delfon => {
            delfon.update();
            delfon.draw(context);
        });
        this.entities.forEach(delfon => {
            if(!delfon.readyForDeletion()) {
                keep.push(delfon);
            }
        });
        this.entities = keep;
    }

    init() {
        this.setup();
        setInterval(() => {
            context.clearRect(0, 0, canvasElement.width, canvasElement.height);
            this.loop();
        }, 1000 / 60);
    }

}

SwimmingDelfons.getInstance().init();



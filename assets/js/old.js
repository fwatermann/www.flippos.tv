const delfonCount = 20;
const delfonSize = 200;
const nuggetSize = 50;
const elements = [];

let currentNugget = {
    dom: undefined,
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    }
};


function init() {
    for(let i = 0; i < delfonCount; i ++) {
        let domElement = document.createElement("img");

        let posX = Math.random() * (window.innerWidth - (delfonSize + 50)) + (delfonSize + 50) / 2
        let posY = Math.random() * (window.innerHeight - (delfonSize + 50)) + (delfonSize + 50) / 2;

        domElement.src = "/assets/img/delfon.png";
        domElement.classList.add("swimming_delfon");
        domElement.style.left = posX;
        domElement.style.top = posY;
        domElement.style.zIndex = 900;
        domElement.setAttribute("draggable", "false");

        document.getElementsByTagName("body")[0].appendChild(domElement);

        const element = {
            dom: domElement,
            position: {
                x: posX,
                y: posY
            },
            velocity: {
                x: Math.random() * 6 - 3,
                y: 0
            },
            transform: {
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                scaleX: 1,
                scaleY: 1,
                scaleZ: 1
            },
            time: Math.random() * 100000000
        };

        if(Math.abs(element.velocity.x) < 1) {
            element.velocity.x = element.velocity.x < 0 ? -1 : 1;
        }

        elements.push(element);
    }
}

function loop() {
    for(let i = 0; i < elements.length; i ++) {
        const element = elements[i];

        const offsetY1 = Math.cos(element.time / 100) * 50;
        const offsetY2 = Math.cos(element.time / 40) * 25;
        const offsetY = offsetY1 + offsetY2;
        const direction = -Math.sin(element.time / 40) / 4;

        element.dom.style.left = element.position.x - (delfonSize / 2);
        element.dom.style.top = element.position.y - (delfonSize / 2) + offsetY;
        element.position.x += element.velocity.x;
        element.position.y += element.velocity.y;
        element.time ++;

        element.transform.rotateZ = `${direction}rad`;

        let r = Math.round(Math.random() * 100000);
        if(r == 500) {
            element.transform.scaleY *= -1;
        }
        if(r > 500 && r < 600) {
            element.transform.scaleY = Math.abs(element.transform.scaleY);
        }
        if(r > 500 && r < 550) {
            element.velocity.x = Math.random() * 6 - 3;
            if(Math.abs(element.velocity.x) < 1) {
                element.velocity.x = element.velocity.x < 0 ? -1 : 1;
            }
        }

        if(element.position.x + (delfonSize / 2) >= window.innerWidth - 10 || element.position.x - (delfonSize / 2) < 10) {
            element.velocity.x *= -1;
        }
        if(element.position.x + (delfonSize / 2) > window.innerWidth || element.position.x + (delfonSize / 2) < 0) {
            element.position.y = window.innerHeight / 2 - (delfonSize / 2);
            element.position.x = window.innerWidth / 2 - (delfonSize / 2);
        }
        if(element.position.y + (delfonSize / 2) > window.innerHeight || element.position.y + (delfonSize / 2) < 0) {
            element.position.y = window.innerHeight / 2 - (delfonSize / 2);
            element.position.x = window.innerWidth / 2 - (delfonSize / 2);
        }

        element.transform.rotateY = element.velocity.x > 0 ? "0deg" : "180deg";
        element.dom.style.transform = `rotateX(${element.transform.rotateX}) rotateY(${element.transform.rotateY}) rotateZ(${element.transform.rotateZ}) scaleX(${element.transform.scaleX}) scaleY(${element.transform.scaleY}) scaleZ(${element.transform.scaleZ})`;

        let dx = (currentNugget.position.x) - element.position.x;
        let dy = (currentNugget.position.y) - (element.position.y + offsetY);
        let distance = Math.sqrt(dx*dx + dy*dy);

        if(distance < (nuggetSize * 2)) {
            currentNugget.velocity.x += (dx / distance) * 0.5;
            currentNugget.velocity.y += (dy / distance) * 0.5;
        }

    }

    if(currentNugget && currentNugget.dom) {
        if(currentNugget.velocity.y < 10 || currentNugget.position.y + nuggetSize >= window.innerHeight) {
            currentNugget.velocity.y *= -1;
        }
        if(currentNugget.position.x < 10 || currentNugget.position.x + nuggetSize >= window.innerWidth - 10) {
            currentNugget.velocity.x *= -1;
        }
        currentNugget.velocity.x *= 0.98;
        currentNugget.velocity.y *= 0.98;

        let dx = (window.innerWidth / 2) - currentNugget.position.x;
        let dy = (window.innerHeight / 2) - currentNugget.position.y;
        let length = Math.sqrt(dx*dx + dy*dy);

        currentNugget.velocity.x += (dx / length) * 0.01;
        currentNugget.velocity.y += (dy / length) * 0.01;

        currentNugget.position.x += currentNugget.velocity.x;
        currentNugget.position.y += currentNugget.velocity.y;
        currentNugget.dom.style.left = currentNugget.position.x - (nuggetSize / 2);
        currentNugget.dom.style.top = currentNugget.position.y - (nuggetSize / 2);
    }

}

function schickenNugget() {

    currentNugget.dom?.remove();

    currentNugget.velocity = {
        x: 0,
        y: 0,
    },
        currentNugget.position = {
            x: window.innerWidth / 2 - nuggetSize / 2,
            y: window.innerHeight / 2 - nuggetSize / 2
        }

    const domElement = document.createElement("img");
    domElement.src = "/assets/img/schicken_nugget.png";
    domElement.classList.add("schickennugget");
    domElement.style.top = 0;
    domElement.style.left = currentNugget.position.x;
    currentNugget.dom = domElement;


    document.getElementsByTagName("body")[0].appendChild(domElement);

}

init();
setInterval(loop, 10);
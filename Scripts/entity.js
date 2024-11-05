class Entity {
    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        
        this.container = new PIXI.Container();
        this.container.name = "MainContainer"
        this.innerContainer = new PIXI.Container();
        this.innerContainer.name = "innerContainer"
        this.container.addChild(this.innerContainer);

        this.game = game;
        this.game.contenedorPrincipal.addChild(this.container);

        this.speed = { x: 0, y: 0 };
        this.acc = { x: 0, y: 0 };
    }

    update() {
        if (!this.listo) return

        this.acc = limitMagnitude(this.acc, this.accMax);
        this.speed.x += this.acc.x;
        this.speed.y += this.acc.y;
        this.acc.x = 0;
        this.acc.y = 0;

        this.speed = limitMagnitude(this.speed, this.speedMax);

        this.changeZOrder()

        this.x += this.speed.x;
        this.y += this.speed.y;

        this.friction()
    }

    applyForce(x, y) {
        this.acc.x += x;
        this.acc.y += y;
    }

    render() {
        this.innerContainer.rotation = this.angulo;
        this.container.x = this.x;
        this.container.y = this.y;
    }

    friction() {
        this.speed.x *= 0.9;
        this.speed.y *= 0.9;
    }


    changeZOrder() {
        this.container.zIndex = this.y
    }

    destroy() {
        if (this.sprite) {
            this.sprite.destroy(); // Destruir el sprite animado
        }
        if (this.container) {
            this.container.destroy({ children: true }); // Destruir el contenedor y sus hijos
        }
    }
}
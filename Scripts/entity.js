class Entity {
    constructor(x, y, game) {
        this.container = new PIXI.Container();
        this.game = game;

        this.game.app.stage.addChild(this.container);

        this.x = x;
        this.y = y;

        this.speed = { x: 0, y: 0 };
        this.acc = { x: 0, y: 0 };
    }

    update() {
        //if (!this.listo) return

        this.acc = limitMagnitude(this.acc, this.accMax);
        this.speed.x += this.acc.x;
        this.speed.y += this.acc.y;
        this.acc.x = 0;
        this.acc.y = 0;

        this.speed = limitMagnitude(this.speed, this.speedMax);

        //this.changeZOrder()

        this.x += this.speed.x;
        this.y += this.speed.y;

        this.friction()
    }

    render() {
        /*
        this.containerDebug.visible = this.debug;

        this.innerContainer.rotation = this.angulo;
        */
        this.container.x = this.x;
        this.container.y = this.y;
    }

    friction() {
        this.speed.x *= 0.9
        this.speed.y *= 0.9
    }

    /*
    changeZOrder() {
        this.sprite.zIndex = this.y
    }
        */
}
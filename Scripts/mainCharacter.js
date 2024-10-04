class MainCharacter extends Entity {
    constructor(x, y, game) {
        super(x, y, game);

        this.speedMax = 500;
        this.accMax = 5;

        this.listo = true;

        this.walkAcc = 4;

        this.makeGraf()
    }

    moveLeft() {
        this.acc.x = -this.walkAcc;
    }
    moveRight() {
        this.acc.x = this.walkAcc;
    }
    moveUp() {
        this.acc.y = -this.walkAcc;
    }
    moveDown(){
        this.acc.y = this.walkAcc;
    }
    
    makeGraf() {
        this.grafico = new PIXI.Graphics()
            .rect(this.x/2, this.y/2, 50, 50 / 2)
            .fill(0xff0000);
        this.container.addChild(this.grafico);
    }
    
}



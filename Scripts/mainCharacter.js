class MainCharacter extends Entity {
    constructor(x, y, game) {
        super(x, y, game);
        this.width = 30;
        this.height = 30;

        this.speedMax = 10;
        this.accMax = 2;

        this.listo = true;

        this.walkAcc = 1;

        this.life = 500;
        this.godMode = false;

        this.makeGraf()
    }


    moveLeft() {
        this.applyForce(-this.walkAcc, 0);
    }
    moveRight() {
        this.applyForce(this.walkAcc, 0);
    }
    moveUp() {
        this.applyForce(0, -this.walkAcc);
    }
    moveDown() {
        this.applyForce(0, this.walkAcc);
    }

    makeGraf() {
        this.grafico = new PIXI.Graphics()
            .rect(0, 0, this.width, this.height)
            .fill(0xff0000);
        this.container.addChild(this.grafico);
    }

    update() {
        this.damaged();
        super.update();
        this.godTime -= 1;
    }

    damaged() {
        for (let i = 0; i < this.game.nightmares.length; i++) {
            let enemy = this.game.nightmares[i];

            if (
                isOverlap(
                    { ...this, y: this.y, x: this.x },
                    enemy
                )
            ) {
                if (! this.godMode) {
                    this.life -= 25;
                    this.changeStateGodMode();
                    console.log(this.life);
                    if (this.life <= 0) {
                        this.gameOver();
                    }
                }
            }

        }
    }

    changeStateGodMode(){
        this.godMode = true;

        // Desactivar God Mode después de medio segundo
        setTimeout(() => {
            this.godMode = false;
        }, 500); 
    }

    gameOver() {
        this.game.gameOver();
    }
}



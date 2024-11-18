class MainCharacter extends Entity {
    constructor(x, y, game) {
        super(x, y, game);
        this.width = 64;
        this.height = 64;

        this.id = "player";
        this.speedMax = 10;
        this.accMax = 2;

        this.walkAcc = 1;

        this.life = 500;
        this.godModeTime = 2500000;

        this.actualExp = 0;
        this.actualLevel = 1;
        this.lastExpFrame = 0;


        this.currentDirection = "front";

        this.animatedSprite();

    }

    async animatedSprite() {
        let json = await PIXI.Assets.load("./Sprites/moa/texture.json");
        this.animations = {
            front: json.animations["walkFront"],
            back: json.animations["walkBack"],
            left: json.animations["walkLeft"],
            right: json.animations["walkRight"]
        };
        this.sprite = new PIXI.AnimatedSprite(this.animations.front);
        this.sprite.animationSpeed = 0.1
        this.sprite.loop = true
        this.sprite.play()
        this.container.addChild(this.sprite)

        
        this.sprite.anchor.set(0.5, 0.2);
        this.sprite.currentFrame = Math.floor(Math.random() * 8)

        this.ready = true
    }

    changePlaySpeedOfAnimatedSprite() {
        try {
            this.sprite.animationSpeed = Math.sqrt(this.speed.x ** 2 + this.speed.y ** 2) * 0.1;

        } catch (error) {
            console.log("no esta listo el sprite");
        }
    }

    handleSpriteDirection() {
        let newDirection = this.currentDirection;

        // Calcular la magnitud absoluta del movimiento en X y Y
        const absSpeedX = Math.abs(this.speed.x);
        const absSpeedY = Math.abs(this.speed.y);

        // Si el movimiento horizontal es mayor al vertical
        if (absSpeedX > absSpeedY) {
            if (this.speed.x > 0) newDirection = "right";  // Movimiento hacia la derecha
            else if (this.speed.x < 0) newDirection = "left";  // Movimiento hacia la izquierda
        } else {
            // Si el movimiento vertical es mayor
            if (this.speed.y > 0) newDirection = "front";  // Movimiento hacia abajo
            else if (this.speed.y < 0) newDirection = "back";  // Movimiento hacia arriba
        }

        // Cambiar la animación solo si la dirección es diferente
        if (newDirection !== this.currentDirection) {
            this.sprite.textures = this.animations[newDirection];
            this.sprite.play();
            this.currentDirection = newDirection;
        }

        // Ajustar la dirección de escala para que el personaje mire hacia la izquierda/derecha
        if (newDirection === "right") this.sprite.scale.x = -1;
        else if (newDirection === "left") this.sprite.scale.x = 1;
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

    update(actualFrames) {
        if (!this.ready) return;
        super.update();
        this.damaged(actualFrames);
        this.handleSpriteDirection();
        this.changePlaySpeedOfAnimatedSprite();

        this.rocksNear = this.findNearRocksUsingGrid();
        this.encounterRocks();
    }




    damaged(actualFrame) {
        for (let i = 0; i < this.nightmaresNear.length; i++) {
            let enemy = this.nightmaresNear[i].nightmare;
            if (
                isOverlap(
                    { ...this, y: this.y, x: this.x },
                    enemy
                ) || distance(this, enemy) <= 1
            ) {
                if (enemy.isNightmare) {
                    if (!this.godMode) {
                        this.life -= 25;
                        this.godMode = true;
                        this.lastFrameGodMode = actualFrame;
                        if (this.life <= 0) {
                            this.gameOver();
                        }
                    }
                } else {

                    if (!enemy.gainExp) {
                        enemy.destroy(this);
                        this.gainExp(actualFrame);
                    }

                }
            }

        }
    }

    gainExp(actualFrame) {
        // console.log(actualFrame)
        // console.log(this.lastExpFrame)
        this.lastExpFrame = actualFrame;
        this.actualExp += 200;
        if (this.actualExp >= 500 * this.actualLevel) {
            this.actualExp = 0;
            this.levelUp();
        }

    }

    levelUp() {
        this.actualLevel++;
        if (this.game.skills.basic < 3 ||
            this.game.skills.attack1 < 3 ||
            this.game.skills.attack2 < 3
        ) {
            this.game.buildlevelUpMenu();
        } else {
            this.life += 20;
        }

    }

    gameOver() {
        this.game.gameOver();
    }

    

}



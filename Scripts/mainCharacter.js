class MainCharacter extends Entity {
    constructor(x, y, game) {
        super(x, y, game);
        this.width = 30;
        this.height = 30;

        this.speedMax = 10;
        this.accMax = 2;

        this.listo = false;

        this.walkAcc = 1;

        this.life = 500;
        this.godMode = false;

        this.currentDirection = "front";

        this.animatedSprite();
        
    }

    async animatedSprite(){
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

        this.sprite.anchor.set(0.5,1);
        this.sprite.currentFrame = Math.floor(Math.random()*8)

        this.listo = true
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

    update() {
        this.damaged();
        super.update();
        this.handleSpriteDirection();
        this.changePlaySpeedOfAnimatedSprite();
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



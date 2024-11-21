class MainCharacter extends Entity {
    constructor(x, y, game) {
        super(x, y, game);
        this.width = 12;
        this.height = 10;

        this.id = "player";
        this.container.name = this.id;
        this.speedMax = 10;
        this.accMax = 2;

        this.walkAcc = 1;

        this.life = 500;
        this.initLifeBar();

        this.godModeTime = 25;

        this.actualExp = 0;
        this.actualLevel = 1;
        this.lastExpFrame = 0;
        this.initExpBar();


        this.currentDirection = "front";

        this.animatedSprite();

    }

    initLifeBar() {
        // Crear gráfico de barra de vida
        this.lifeBar = new PIXI.Graphics();
        this.updateLifeBar(); // Conf. barra inicial
        // Añadir la barra de vida al cont. del pj
        this.container.addChild(this.lifeBar);
    }       

    // Modificar barra de vida en tiempo real
    updateLifeBar() {
        const lifePercentage = this.life / 500; // Calcula el porcentaje de vida

        // Dibujar barra de vida
        this.lifeBar.clear();
        this.lifeBar.beginFill(0xFF0000);
        this.lifeBar.drawRect(
            -this.width / 1.1, // Centrar barra horizontalmente
            this.height - 10 , // Posicionar barra debajo del personaje
            this.width * 2 * lifePercentage, // Ancho de la barra en función de la vida actual
            3            
        );
        this.lifeBar.endFill();
    }

    initExpBar() {
        // Crear gráfico de barra de experiencia
        this.expBar = new PIXI.Graphics();
        this.updateExpBar(); // Conf. barra inicial
        // Añadir la barra de experiencia al cont. del pj
        this.container.addChild(this.expBar);
    }

    updateExpBar() {
        const expToNextLevel = 500 * this.actualLevel;
        const expPercentage = this.actualExp / expToNextLevel; // Calcula el porcentaje de experiencia

        // Dibujar barra de experiencia
        this.expBar.clear();
        this.expBar.beginFill(0x0000FF);
        this.expBar.drawRect(
            -this.width / 1.1, // Centrar barra horizontalmente
            this.height - 7, // Posicionar barra debajo del personaje
            this.width * 1.5 * expPercentage, // Ancho de la barra en función de la experiencia actual
            3           
        );
        this.expBar.endFill();
    }

    async animatedSprite() {
        let json = await PIXI.Assets.load("./Sprites/gato/texture.json");
        this.animations = {
            front: json.animations["front"],
            back: json.animations["back"],
            left: json.animations["left"],
            right: json.animations["right"],
            
        };
        this.sprite = new PIXI.AnimatedSprite(this.animations.front);
        this.sprite.animationSpeed = 0.1
        this.sprite.loop = true
        this.sprite.play()
        this.container.addChild(this.sprite)

        


        this.sprite.anchor.set(0.5, 1);
        this.container.pivot.x = this.sprite.anchor.x/2;
        this.container.pivot.y = this.sprite.anchor.y;
        this.sprite.currentFrame = Math.floor(Math.random() * 3)


        this.ready = true
    }

    makeGraf() {
        this.grafico = new PIXI.Graphics()
            .rect(0, 0, this.width, this.height)
            .fill(0xff0000);
        this.container.addChild(this.grafico);
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
        /*if (newDirection === "right") this.sprite.scale.x = -1;
        else if (newDirection === "left") this.sprite.scale.x = 1;*/
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


    update(actualFrames) {
        if (!this.ready) return;
        super.update();
        this.encounterRocks();
        this.damaged(actualFrames);
        this.heal();
        this.handleSpriteDirection();
        this.changePlaySpeedOfAnimatedSprite();


        this.updateLifeBar();
        this.encounterRocks(actualFrames);
    }


    damaged(actualFrame) {
        if(actualFrame % 2 == 0){
            this.nightmaresNear = this.findNearNightmaresUsingGrid();
            for (let i = 0; i < this.nightmaresNear.length; i++) {
                let enemy = this.nightmaresNear[i].nightmare;
                if (
                    isOverlap(
                        { ...this, y: this.y, x: this.x },
                        enemy
                    ) 
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
            this.updateLifeBar();

        }
    }

    heal(){
        for (let heal of this.game.healthManager.healths){
            if (
                isOverlap(
                    { ...this, y: this.y, x: this.x },
                    heal
                ) 
            ) {
                this.life += heal.cura;
                this.life = this.life>500 ? 500 : this.life;
                heal.destroy();
            }
        }
        this.updateLifeBar();
    }
    gainExp(actualFrame) {
        this.lastExpFrame = actualFrame;
        this.actualExp += 500;
        const expToNextLevel = 500 * this.actualLevel;

        if (this.actualExp >= expToNextLevel) {
            this.actualExp = 0;
            this.levelUp();
        }
        this.updateExpBar();
    }

    levelUp() {
        this.actualLevel++;
        if (this.game.skills.basic < 3 ||
            this.game.skills.attack1 < 3 ||
            this.game.skills.attack2 < 3
        ) {
            this.game.uiManager.buildlevelUpMenu();
        } else {
            this.life += 20;
        }

    }

    gameOver() {
        this.game.gameOver();
    }

}



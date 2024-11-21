class Game {
    constructor() {
        this.app = new PIXI.Application();
        this.cellSize = 180; //VER
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.backgroundSize = { x: this.cellSize * 18, y: this.cellSize * 12 }
        this.scale = 1;

        this.attacks = []
        this.skills = { basic: 1, attack1: 0, attack2: 0 }



        // Cargar la música de fondo
        this.backgroundMusic = new Audio('Sound/Babymetal-ijime,dame,zettai.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.04;

        this.nightmares = [];
        this.keysPressed = {};

        let promise = this.app.init({ width: this.width, height: this.height });

        this.app.stage.sortableChildren = true;
        promise.then(e => {
            document.body.appendChild(this.app.canvas);
            window.__PIXI_APP__ = this.app;
            this.uiManager = new UIManager(this);
            this.uiManager.createMainMenu()
        })
    }

   

    preload() {
        // Cargar fondo
        PIXI.Assets.load('sprites/background/fondito.png').then((texture) => {
            // Create a sprite from the loaded texture
            const background = new PIXI.Sprite(texture);
            background.zIndex = -999999999999;

            // Set the position and size of the background
            background.anchor.set(0, 0);
            background.width = this.backgroundSize.x;
            background.height = this.backgroundSize.y;
            background.x = 0;
            background.y = 0;

            this.mainContainer.addChild(background);
        });


    }

    imageFilter() {
        this.tetricFilter = new PIXI.Graphics()
        this.tetricFilter.beginFill("0x000000", 0.6);
        this.tetricFilter.drawRect(0, 0, this.width, this.height);
        this.tetricFilter.endFill();

        this.app.stage.addChild(this.tetricFilter)
    }

    

    startGame() {
        this.mainContainer = new PIXI.Container();
        this.mainContainer.name = "mainContainer";

        this.app.stage.addChild(this.mainContainer);

        this.preload();
        this.sketcher = new PIXI.Graphics();
        this.mainContainer.addChild(this.sketcher);
        this.imageFilter();
        this.healthManager = new HealthManager(this);
        this.firstWave = true;
        this.frameCounter = 0;
        this.isPaused = false;
        this.isGameOver = false;
        this.restantNightmare = 5;
        this.points = 0;
        this.nightmareLife = 200;
        this.numberWave = 1;

        this.listeners();
        this.grid = new Grid(this, this.cellSize);
        this.rockManager = new RockManager(this, this.grid, this.cellSize, 10); // Borrar a la bosta si no funciona
        this.healthManager.putHealth(this);
        this.grassManager = new GrassManager(this,5000)
        this.placePlayer();
        this.placeNightmares(this.restantNightmare);

        this.uiManager.createGameplayUI();
        this.uiManager.miniMap();
        this.app.ticker.add((e) => {
            this.gameLoop(e);
        });

    }

    listeners() {
        window.onkeydown = (e) => {
            if (e.key == "Escape") {
                this.pause();
            } else {
                if (e.key != "Escape") {
                    this.keysPressed[e.key] = true;
                }
            }
        };

        window.onkeyup = (e) => {
            this.keysPressed[e.key] = false;
        };
    }

    handleMovement() {
        if (this.keysPressed["w"]) this.player.moveUp();
        if (this.keysPressed["s"]) this.player.moveDown();
        if (this.keysPressed["a"]) this.player.moveLeft();
        if (this.keysPressed["d"]) this.player.moveRight();
    }

    gameLoop() {
        if (this.player.ready) {
            this.frameCounter++;
            this.handleMovement();
            this.playerLoop(this.frameCounter);
            this.nightmaresLoop(this.frameCounter);
            this.moveCamera();
            this.makeAttacks(this.frameCounter);
            this.uiManager.updateMiniMap(this.player, this.nightmares, this.healthManager.healths);
            this.grassManager.update();
        }
    }

    makeAttacks(actualFrames) {
        this.makeBasic(actualFrames);
        if (this.skills.attack1 >= 1) this.makeFishStrike(actualFrames);
        if (this.skills.attack2 >= 1) this.makeStoneTrail(actualFrames);
    }

    makeBasic(actualFrames) {
        if (actualFrames % 45 == 0) {
            let attack = new BasicSlashAttack(this.player, actualFrames, this.skills.basic, this.player.currentDirection);
            this.attacks.push(attack);
            if (this.skills.basic > 2) {
                let oppositeDirection = this.opposite();
                let attack = new BasicSlashAttack(this.player, actualFrames, this.skills.basic, oppositeDirection);
                this.attacks.push(attack);
            }
        }

        try {
            for (let attack of this.attacks) {
                if ((actualFrames + 1 - attack.lastFrameExecuted) % 5 == 0 && attack.type == "basic") {
                    attack.destroy();
                }
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    opposite() {
        switch (this.player.currentDirection) {
            case "right": return "left";
            case "left": return "right";
            case "front": return "back";
            case "back": return "front";
            default: return this.player.currentDirection;
        }
    }

    makeFishStrike(actualFrames) {
        if (actualFrames % 120 == 0) { // Ejecutar cada 120 frames (ajustable) 
            let attack = new FishStrike(this.player, actualFrames, this.skills.attack1, 1);
            this.attacks.push(attack);
            if (this.skills.attack1 > 2) {
                let attack = new FishStrike(this.player, actualFrames, this.skills.attack1, -1);
                this.attacks.push(attack);
            }
        }
        for (let attack of this.attacks) {
            if (attack.type == "fishStrike") {
                attack.update();
            }
        }
    }

    makeStoneTrail(actualFrames) {
        let exists = this.attacks.some(attack => attack instanceof StoneTrailAttack);
        if (!exists) {
            let attack = new StoneTrailAttack(this.player, actualFrames, this.skills.attack2);
            this.attacks.push(attack);
        }
        this.attacks.find(attack => attack instanceof StoneTrailAttack).update(actualFrames, this.skills.attack2);
    }

    playerLoop(frameCounter) {
        if (!this.isGameOver) {
            this.player.changeStateGodMode(frameCounter);
        }
        this.player.update(frameCounter);
        this.player.render();
    }

    nightmaresLoop(frameCounter) {
        for (let nightmare of this.nightmares) {
            if (!this.isGameOver) {
                nightmare.changeStateGodMode(frameCounter);
            }
            nightmare.update(frameCounter, this.attacks);
            nightmare.render();
        }
    }

    placePlayer() {
        this.player = new MainCharacter(this.backgroundSize.x / 2, this.backgroundSize.y / 2, this);
    }


    moveCamera() {
        let playerX = this.player.container.x;
        let playerY = this.player.container.y;

        const halfWindowWidth = window.innerWidth / 2;
        const halfWindowHeight = window.innerHeight / 2;

        // Límites de la cámara
        const minX = 0;
        const maxX = (this.backgroundSize.x - halfWindowWidth - 650);
        const minY = 0;
        const maxY = (this.backgroundSize.y - halfWindowHeight - 300);

        let targetX = playerX - halfWindowWidth;
        let targetY = playerY - halfWindowHeight;

        // Ajustar la posición objetivo para que no salga de los límites
        if (targetX < minX) targetX = minX;
        if (targetX > maxX) targetX = maxX;
        if (targetY < minY) targetY = minY;
        if (targetY > maxY) targetY = maxY;

        // Aplicar el lerp para suavizar el movimiento
        this.mainContainer.pivot.x = lerp(this.mainContainer.pivot.x, targetX, 0.1);
        this.mainContainer.pivot.y = lerp(this.mainContainer.pivot.y, targetY, 0.1);
        this.mainContainer.scale.set(this.scale);
    }

    upgradeSkill(skill) {
        if (this.skills[skill] < 3) { // Verifica que la habilidad no esté en el máximo nivel 
            this.skills[skill]++;
            console.log(`Habilidad ${skill} mejorada a nivel ${this.skills[skill]}`);
        }
        this.app.stage.removeChild(this.uiManager.levelUpMenu);
        this.uiManager.removeSpriteAttacks();
        this.app.ticker.start();
    }

    gameOver() {
        this.app.ticker.stop();
        this.backgroundMusic.pause()
        this.isGameOver = true;
        this.app.stage.removeChild(this.uiManager.uiContainer);
        this.app.stage.removeChild(this.uiManager.miniMapContainer);
        this.uiManager.buildGameOverMenu();
    }

    removePlayer() {
        this.mainContainer.removeChild(this.player);
        this.player.sprite.stop()
        this.player.destruction();
    }

    removeNightmares() {
        for (let nightmare of this.nightmares) {
            this.mainContainer.removeChild(nightmare);
            //nightmare.sprite.stop()
            nightmare.destruction();
        }
        this.nightmares = [];
    }

    placeNightmares(numerNightmares = 10) {
        for (let i = 0; i < numerNightmares; i++) {
            let nightMare = new Nightmare(Math.random() * this.backgroundSize.x, Math.random() * this.backgroundSize.y, this, this.nightmareLife);
            this.nightmares.push(nightMare);
        }
        this.nightmareLife *= 1.2;
    }

    //sumar progresivamente bichos
    checkWave() {
        this.restantNightmare--
        if (this.restantNightmare < 1) {
            this.numberWave++;
            let numberNightmares = Math.floor(5 + this.numberWave * 1.5)
            numberNightmares = numberNightmares > 500 ? 500 : numberNightmares;
            this.restantNightmare = numberNightmares;
            this.nightmareLife = (200 * this.numberWave) * 0.6);
            this.placeNightmares(numberNightmares);
            this.healthManager.putHealth(this);
        }
    }

    pause() {
        if (!this.isPaused) {
            this.app.ticker.stop();
            this.backgroundMusic.pause()
            this.isPaused = true;
        } else {
            this.app.ticker.start();
            this.backgroundMusic.play()
            this.isPaused = false;
        }

    }

}
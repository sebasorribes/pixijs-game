class Game {
    constructor() {
        // *********************
        let navegador = navigator.userAgent;
        this.isMobile = (/Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/.test(navegador));
        // ver esto y la colision

        this.app = new PIXI.Application();
        this.cellSize = 180; //VER
        this.cellSize = this.isMobile ? 120 : 180;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.backgroundSize = this.isMobile ? { x: this.cellSize * 18, y: this.cellSize * 12 } : { x: this.cellSize * 27, y: this.cellSize * 18 };
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
            setUp();
            this.uiManager = new UIManager(this);
            this.uiManager.createMainMenu()
        })
    }

    loadBackground() {
        // Create a sprite from the loaded texture
        const background = new PIXI.Sprite(backgroundSprite);
        background.zIndex = -999999999999;

        // Set the position and size of the background
        background.anchor.set(0, 0);
        background.width = this.backgroundSize.x;
        background.height = this.backgroundSize.y;
        background.x = 0;
        background.y = 0;

        this.mainContainer.addChild(background);
    }

    imageFilter() {
        this.tetricFilter = new PIXI.Graphics()
        this.tetricFilter.beginFill("0x000000", 0.5);
        this.tetricFilter.drawRect(0, 0, this.width, this.height);
        this.tetricFilter.endFill();

        this.app.stage.addChild(this.tetricFilter)
    }

    startGame() {
        this.mainContainer = new PIXI.Container();
        this.mainContainer.name = "mainContainer";

        this.app.stage.addChild(this.mainContainer);

        this.sketcher = new PIXI.Graphics();
        this.mainContainer.addChild(this.sketcher);
        //this.imageFilter();
        this.healthManager = new HealthManager(this);
        this.firstWave = true;
        this.frameCounter = 0;
        this.isPaused = false;
        this.isGameOver = false;
        this.restantNightmare = 5;
        this.points = 0;
        this.nightmareLife = 200;
        this.numberWave = 1;

        this.loadBackground();
        this.listeners();
        this.grid = new Grid(this, this.cellSize);
        //this.rockManager = new RockManager(this, this.grid, this.cellSize, 10); // Borrar a la bosta si no funciona
        this.healthManager.putHealth(this);
        //this.grassManager = new GrassManager(this, 5000)
        this.placePlayer();
        this.placeNightmares(this.restantNightmare);

        this.uiManager.createGameplayUI();
        //this.uiManager.miniMap();
        this.app.ticker.add((e) => {
            this.gameLoop(e);
        });

    }

    listeners() {
        // Detectar si es móvil
        if (this.isMobile) {
            this.createJoystick(); // Crear joystick para móviles
        }
        // Controles tradicionales para PC
        window.onkeydown = (e) => {
            if (e.key == "Escape") {
                this.pause();
            } else {
                this.keysPressed[e.key] = true;
            }
        };

        window.onkeyup = (e) => {
            this.keysPressed[e.key] = false;
        };

    }

    createJoystick() {
        const joystickContainer = document.createElement("div");
        joystickContainer.style.position = "fixed";
        joystickContainer.style.bottom = "20%";
        joystickContainer.style.left = "10%";
        joystickContainer.style.width = "150px";
        joystickContainer.style.height = "150px";
        joystickContainer.style.border = "2px solid #ffffff";
        joystickContainer.style.borderRadius = "50%";
        joystickContainer.style.background = "rgba(255, 255, 255, 0.3)";
        joystickContainer.style.touchAction = "none"; // Prevenir zoom en móviles
        document.body.appendChild(joystickContainer);

        const joystickHandle = document.createElement("div");
        joystickHandle.style.position = "absolute";
        joystickHandle.style.top = "50%";
        joystickHandle.style.left = "50%";
        joystickHandle.style.transform = "translate(-50%, -50%)";
        joystickHandle.style.width = "50px";
        joystickHandle.style.height = "50px";
        joystickHandle.style.border = "2px solid #ff0000";
        joystickHandle.style.borderRadius = "50%";
        joystickHandle.style.background = "#ff0000";
        joystickContainer.appendChild(joystickHandle);

        // Variables globales del joystick
        this.joystick = { angleX: 0, angleY: 0 }; // Guardar dirección del joystick
        this.isJoystickActive = false; // Estado del uso del joystick

        joystickContainer.addEventListener("touchstart", (e) => {
            this.isJoystickActive = true;
        });

        joystickContainer.addEventListener("touchmove", (e) => {
            e.preventDefault(); // Prevenir scroll en móvil
            const touch = e.touches[0];
            const rect = joystickContainer.getBoundingClientRect();

            // Calcular la posición relativa al contenedor
            const offsetX = touch.clientX - rect.left - rect.width / 2;
            const offsetY = touch.clientY - rect.top - rect.height / 2;

            // Limitar el movimiento dentro del círculo
            const distance = Math.min(
                Math.sqrt(offsetX * offsetX + offsetY * offsetY),
                rect.width / 2
            );
            const angle = Math.atan2(offsetY, offsetX);

            // Calcular nuevas posiciones del handle del joystick
            const handleX = Math.cos(angle) * distance;
            const handleY = Math.sin(angle) * distance;

            joystickHandle.style.transform = `translate(calc(-50% + ${handleX}px), calc(-50% + ${handleY}px))`;

            // Actualizar dirección normalizada
            this.joystick.angleX = handleX / (rect.width / 2);
            this.joystick.angleY = handleY / (rect.height / 2);
        });

        joystickContainer.addEventListener("touchend", () => {
            this.isJoystickActive = false;
            this.joystick.angleX = 0;
            this.joystick.angleY = 0;

            joystickHandle.style.transform = "translate(-50%, -50%)"; // Reset al centro
        });
    }


    handleMovement() {
        if (this.isMobile && this.isJoystickActive) {
            const { angleX, angleY } = this.joystick;

            // Determinar el movimiento en función de los valores del joystick
            if (angleY < -0.5) this.player.moveUp(); // Arriba
            if (angleY > 0.5) this.player.moveDown(); // Abajo
            if (angleX < -0.5) this.player.moveLeft(); // Izquierda
            if (angleX > 0.5) this.player.moveRight(); // Derecha
        } else {
            // Controles tradicionales para PC
            if (this.keysPressed["w"]) this.player.moveUp();
            if (this.keysPressed["s"]) this.player.moveDown();
            if (this.keysPressed["a"]) this.player.moveLeft();
            if (this.keysPressed["d"]) this.player.moveRight();
        }
    }

    // //poner touch
    // listeners() {
    //     window.onkeydown = (e) => {
    //         if (e.key == "Escape") {
    //             this.pause();
    //         } else {
    //             if (e.key != "Escape") {
    //                 this.keysPressed[e.key] = true;
    //             }
    //         }
    //     };

    //     window.onkeyup = (e) => {
    //         this.keysPressed[e.key] = false;
    //     };
    // }

    // handleMovement() {
    //     if (this.keysPressed["w"]) this.player.moveUp();
    //     if (this.keysPressed["s"]) this.player.moveDown();
    //     if (this.keysPressed["a"]) this.player.moveLeft();
    //     if (this.keysPressed["d"]) this.player.moveRight();
    // }

    gameLoop() {
        if (this.player.ready) {
            if (!this.isPaused) {
                this.frameCounter++;
                this.handleMovement();
                this.playerLoop(this.frameCounter);
                this.nightmaresLoop(this.frameCounter);
                this.moveCamera();
                this.makeAttacks(this.frameCounter);
                //this.uiManager.updateMiniMap(this.player, this.nightmares, this.healthManager.healths);
                //this.grassManager.update();
            }
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
        this.player = new MainCharacter(this.backgroundSize.x / 2, this.backgroundSize.y / 2, this, this.playerSprite);
    }


    moveCamera() {
        let playerX = this.player.container.x;
        let playerY = this.player.container.y;

        const halfWindowWidth = window.innerWidth / 2;
        const halfWindowHeight = window.innerHeight / 2;

        // Límites de la cámara
        const minX = 0;
        const maxX = (this.backgroundSize.x - halfWindowWidth - (this.isMobile ? 122 : 650));
        const minY = 0;
        const maxY = (this.backgroundSize.y - halfWindowHeight - (this.isMobile ? 270 : 300));

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
        }
        this.app.stage.removeChild(this.uiManager.levelUpMenu);
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
            this.nightmareLife = (200 * this.numberWave) * 0.6;
            this.placeNightmares(numberNightmares);
            this.healthManager.putHealth(this);
        }
    }

    pause() {
        if (!this.isPaused) {
            //this.app.ticker.stop();
            this.backgroundMusic.pause()
            this.isPaused = true;
            this.app.stage.addChild(this.uiManager.pauseMenu);
        } else {
            //this.app.ticker.start();
            this.backgroundMusic.play()
            this.isPaused = false;
            this.app.stage.removeChild(this.uiManager.pauseMenu);
        }

    }

}
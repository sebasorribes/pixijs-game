class Game {
    constructor() {
        this.app = new PIXI.Application();
        this.frameCounter = 0;
        this.width = window.innerWidth * 2;
        this.height = window.innerHeight * 2;
        //this.background = this.preload()

        this.escala = 0.7;

        this.nightmares = [];
        this.keysPressed = {};
        let promise = this.app.init({ width: this.width, height: this.height });

        this.app.stage.sortableChildren = true;
        promise.then(e => {
            this.startGame()
        })
    }

    preload(){
        PIXI.Assets.load('sprites/background/fondo.png').then((texture) => {
            // Create a sprite from the loaded texture
            const background = new PIXI.Sprite(texture);
            background.zIndex = -1;
        
            // Set the position and size of the background
            background.anchor.set(0.5, 0.5);
            background.width = this.width * 2;
            background.height = this.height * 2;
            background.x = this.width / 2;
            background.y = this.height / 2;

            
            // Add the background to the stage
            this.contenedorPrincipal.addChild(background);
        })
    }
    
    startGame() {
        
        this.contenedorPrincipal = new PIXI.Container();
        this.contenedorPrincipal.name = "contenedorPrincipal";
        
        this.app.stage.addChild(this.contenedorPrincipal);
        this.preload();
        this.sketcher = new PIXI.Graphics();
        this.app.stage.addChild(this.sketcher);

        this.isPaused = false;

        document.body.appendChild(this.app.canvas);
        window.__PIXI_APP__ = this.app;
        this.listeners();
        this.placePlayer();
        this.placeNightmares(50);
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

    gameLoop(time) {
        if (this.player.listo) {
            this.frameCounter++;
            this.handleMovement()
            this.player.update();
            this.player.render();
            this.moveCamera();
            for (let nightmare of this.nightmares) {
                nightmare.update();
                nightmare.render();
            }
        }
    }

    placePlayer() {
        this.player = new MainCharacter(this.width / 2, this.height / 2, this);
    }

    placeNightmares(numerNightmares = 10) {
        for (let i = 0; i <= numerNightmares; i++) {
            let nightMare = new Nightmare(Math.random() * this.width, Math.random() * this.height, this);
            this.nightmares.push(nightMare);
        }
    }

    moveCamera() {
        this.contenedorPrincipal.pivot.x = this.player.x - (window.innerWidth / 2.4) / this.escala;
        this.contenedorPrincipal.pivot.y = this.player.y - (window.innerHeight / 2.4) / this.escala;

        this.contenedorPrincipal.scale.set(this.escala);
    }

    buildGameOverMenu() {
        this.gameOverMenu = new PIXI.Graphics();
        this.gameOverMenu.clear();
        this.gameOverMenu.beginFill("0x000000", 0.5);
        this.gameOverMenu.drawRect(0, 0, this.width, this.height);
        this.gameOverMenu.endFill();

        const gameOverText = new PIXI.Text({
            text: "Game Over", style: {
                fontFamily: "Arial",
                fontSize: 64,
                fill: "#0720fa",
                align: "center"
            }
        });
        gameOverText.anchor.set(0.5);
        gameOverText.position.set(this.contenedorPrincipal.width * 1.25, this.contenedorPrincipal.height / 2);



        // Estilo para el botón de reinicio
        const restartStyle = new PIXI.TextStyle({
            fontSize: 28,
            fill: "#00ff00" // Color verde para "Restart"
        });

        const restartText = new PIXI.Text("Restart", restartStyle);
        restartText.anchor.set(0.5);
        restartText.x = this.width / 2;
        restartText.y = this.height / 2 + 60;

        // Hacer que el botón de "Restart" sea interactivo
        restartText.interactive = true;
        restartText.buttonMode = true;
        restartText.on('pointerdown', () => this.restartGame());

        // Agregar los textos después del fondo, al mismo contenedor
        this.gameOverMenu.addChild(gameOverText);
        this.gameOverMenu.addChild(restartText);

        // Finalmente, agregar el menú al stage
        this.app.stage.addChild(this.gameOverMenu);
    }

    showGameOverMenu() {
        this.buildGameOverMenu();
    }

    gameOver() {
        this.app.ticker.stop();
        this.showGameOverMenu();
    }

    restartGame() {
        this.isGameOver = false;
        this.frameCounter = 0;
        this.player.de;  // Reinicia la vida del jugador o cualquier otro parámetro
        this.removePlayer();
        this.removeNightmares();
        this.app.stage.removeChild(this.gameOverMenu);  // Remueve el menú
        this.app.ticker.stop();
        // Remover todos los listeners para evitar que el loop se duplique
        this.app.ticker.removeAllListeners();
        this.startGame();
    }

    removePlayer() {
        this.contenedorPrincipal.removeChild(this.player);
        this.player.sprite.stop()
        this.player.destroy();
    }

    removeNightmares() {
        for (let nightmare in this.nightmares) {
            this.contenedorPrincipal.removeChild(nightmare);
            //nightmare.sprite.stop()
            nightmare.destroy();
        }
        this.nightmares.clear();
    }
    pause() {
        if (!this.isPaused) {
            this.app.ticker.stop();
            this.isPaused = true;
        } else {
            this.app.ticker.start();
            this.isPaused = false;
        }
    }
}
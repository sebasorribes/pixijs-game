class Game {
    constructor() {
        this.app = new PIXI.Application();
        this.frameCounter = 0;
        this.cellSize = 180; //VER
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.backgroundSize = {x: this.cellSize * 18, y: this.cellSize* 12}
        //this.background = this.preload()

 
        this.scale = 1;


        this.nightmares = [];
        this.keysPressed = {};
        let promise = this.app.init({ width: this.width, height: this.height});

        this.app.stage.sortableChildren = true;
        promise.then(e => {
            this.startGame()
        })
    }

    preload(){
        PIXI.Assets.load('sprites/background/fondo.png').then((texture) => {
            // Create a sprite from the loaded texture
            const background = new PIXI.Sprite(texture);
            background.zIndex = -999999999999;
        
            // Set the position and size of the background
            background.anchor.set(0, 0);
            background.width = this.backgroundSize.x;
            background.height = this.backgroundSize.y;
            background.x = 0;
            background.y = 0;

            
            // Add the background to the stage
            this.mainContainer.addChild(background);
        })
    }
    
    startGame() {
        
        this.mainContainer = new PIXI.Container();
        this.mainContainer.name = "mainContainer";
        
        this.app.stage.addChild(this.mainContainer);
        this.preload();
        this.sketcher = new PIXI.Graphics();
        this.mainContainer.addChild(this.sketcher);

        this.isPaused = false;

        document.body.appendChild(this.app.canvas);
        window.__PIXI_APP__ = this.app;
        this.listeners();
        this.grid = new Grid(this, this.cellSize);
        this.placePlayer();
        this.placeNightmares(200);
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
        if (this.player.ready) {
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
        this.player = new MainCharacter(this.backgroundSize.x/2, this.backgroundSize.y/2, this);
    }

    placeNightmares(numerNightmares = 10) {
        for (let i = 0; i <= numerNightmares; i++) {
            let nightMare = new Nightmare(Math.random() * this.backgroundSize.x, Math.random() * this.backgroundSize.y, this);
            this.nightmares.push(nightMare);
        }
    }

    moveCamera() {
        this.mainContainer.pivot.x = this.player.x - (window.innerWidth / 2.4) / this.scale;
        this.mainContainer.pivot.y = this.player.y - (window.innerHeight / 2.4) / this.scale;

        this.mainContainer.scale.set(this.scale);
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
        gameOverText.position.set(this.mainContainer.width * 1.25, this.mainContainer.height / 2);



        // Estilo para el botón de reinicio
        const restartStyle = new PIXI.TextStyle({
            fontSize: 28,
            fill: "#00ff00" // Color verde para "Restart"
        });

        const restartText = new PIXI.Text(`F5 para reiniciar`, restartStyle);
        restartText.anchor.set(0.5);
        restartText.x = this.width / 2;
        restartText.y = this.height / 2 + 60;

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
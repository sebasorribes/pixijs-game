class Game {
    constructor() {
        this.app = new PIXI.Application();
        this.frameCounter = 0;
        this.width = window.innerWidth * 2;
        this.height = window.innerHeight * 2;

        this.escala = 0.5;

        this.nightmares = [];
        this.keysPressed = {};
        let promise = this.app.init({ width: this.width, height: this.height });
    

        promise.then(e => {
            this.startGame()
        })
    }

    startGame() {
        this.contenedorPrincipal = new PIXI.Container();
        this.contenedorPrincipal.name = "contenedorPrincipal";
        this.app.stage.addChild(this.contenedorPrincipal);

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
            if(e.key == "Escape"){
                this.pause();
            }else{
                if(e.key != "Escape"){
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

    buildGameOverMenu(){
        this.sketcher.clear();
        this.sketcher.beginFill("0x000000", 0.5);
        this.sketcher.drawRect(0, 0, this.width, this.height);
        this.sketcher.endFill();

        const gameOverText = new PIXI.Text( {text: "Game Over", style: {
            fontFamily: "Arial",
            fontSize: 64,
            fill: "#0720fa",
            align: "center"
        }});
        gameOverText.anchor.set(0.5);
        gameOverText.position.set(this.contenedorPrincipal.width *1.25, this.contenedorPrincipal.height /2);
        this.app.stage.addChild(gameOverText);
    }

    showGameOverMenu(){
        this.buildGameOverMenu();
    }

    gameOver(){
        this.app.ticker.stop();
        this.showGameOverMenu();
    }

    pause(){
        if(!this.isPaused){
            this.app.ticker.stop();
            this.isPaused = true;
        }else{
            this.app.ticker.start();
            this.isPaused = false;
        }
    }
}
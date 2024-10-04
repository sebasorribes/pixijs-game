class Game {
    constructor() {
        this.app = new PIXI.Application();
        this.frameCounter = 0;
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        let promise = this.app.init({ width: this.width, height: this.height });

        promise.then(e => {
            this.startGame()
        })
    }

    startGame() {
        document.body.appendChild(this.app.canvas);
        window.__PIXI_APP__ = this.app;
        this.listeners();
        this.placePlayer();
        this.app.ticker.add((e) => {
            this.gameLoop(e);
        });
    }

    listeners() {
        window.onkeydown = (e) => {
            if (e.key == "w") this.player.moveUp();
            else if (e.key == "d") this.player.moveRight();
            else if (e.key == "a") this.player.moveLeft();
            else if (e.key == "s") this.player.moveDown();
        }
    }

    gameLoop(time) {
        this.frameCounter++;
        this.player.update();
        this.player.render();
    }

    placePlayer() {
        this.player = new MainCharacter(this.width / 2, this.height / 2, this);
    }
}
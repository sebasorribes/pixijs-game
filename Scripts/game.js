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
        this.app.ticker.add((e) => {
            this.gameLoop(e);
        });
    }

    gameLoop(time){
        this.frameCounter++;
    }
}
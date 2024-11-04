class Attack{
    constructor(x,y,game){
        this.x = x;
        this.y = y;
        this.game = game;

        this.container = new PIXI.Container();
        this.container.name = "mainContainer"
        this.innerContainer = new PIXI.Container();
        this.innerContainer.name = "innerContainer"
        this.container.addChild(this.innerContainer);
        
        this.game.contenedorPrincipal.addChild(this.container);
    }
}
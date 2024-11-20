class Health {
    constructor(game) {
        this.container = new PIXI.Container();
        this.game = game;
        this.x = Math.random() * game.backgroundSize.x;
        this.y = Math.random() * game.backgroundSize.y;

        this.width = 20;
        this.height = 20;
        this.cura = 200;
        
        this.makeSprite();
        this.container.x = this.x;
        this.container.y = this.y
    }

    makeSprite() {
        this.sprite = new PIXI.Sprite(PIXI.Texture.from('sprites/health.png'));
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.width = this.width;
        this.sprite.height = this.height;
        this.container.addChild(this.sprite);
    }
}
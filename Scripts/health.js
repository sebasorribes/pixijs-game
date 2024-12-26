class Health {
    constructor(game, manager) {
        this.container = new PIXI.Container();
        this.id = "Health" + generateRandomID();
        this.healthManager = manager;
        this.container.name = this.id;
        this.game = game;
        this.x = Math.random() * game.backgroundSize.x;
        this.y = Math.random() * game.backgroundSize.y;

        this.width = 20;
        this.height = 20;
        this.cura = 200;

        this.game.mainContainer.addChild(this.container);

        this.makeSprite();

        this.container.x = this.x;
        this.container.y = this.y;
        this.container.zIndex = this.y;
    }

    makeSprite() {
        this.sprite = new PIXI.Sprite(healthSprite);
        this.sprite.anchor.set(0.5, 1);
        this.sprite.width = this.width;
        this.sprite.height = this.height;
        this.container.addChild(this.sprite);
    }

    destroy() {
        this.game.mainContainer.removeChild(this.container);
        this.container.destroy();
        this.healthManager.healths = this.healthManager.healths.filter((k) => k.id != this.id);
    }
}
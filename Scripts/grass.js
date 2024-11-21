class Grass {
    static grassTexture = null;
    constructor(game) {
        this.game = game;
        this.container = new PIXI.Container();
        this.innerContainer = new PIXI.Container();
        this.innerContainer.name = "innerContainer"
        this.container.addChild(this.innerContainer);


        this.id = "grass" + generateRandomID();
        this.container.name = this.id;
        this.game = game;
        this.x = Math.random() * game.backgroundSize.x;
        this.y = Math.random() * game.backgroundSize.y;
        this.container.x = this.x;
        this.container.y = this.y;

        this.randomMoveSpeed = Math.random() * 0.5 + 0.5;

        let grassType = Math.floor(Math.random() * 2) + 1;

        let url = "./Sprites/grass" + grassType + ".png";
        if (!Grass.grassTexture) {
            PIXI.Assets.load(url).then((texture) => {
                Grass.grassTexture = texture;
                this.makeSprite()
            });
        }else{
            this.makeSprite()
        }


    }


    makeSprite(){
        this.sprite = new PIXI.Sprite(Grass.grassTexture);
        this.sprite.scale.set(0.7 + Math.random() * 0.5);
        this.sprite.anchor.set(0.5, 1);

        this.container.addChild(this.sprite);

        this.container.zIndex = this.y;
        this.container.scale.x = Math.random() > 0.5 ? 1 : -1;
        this.game.mainContainer.addChild(this.container);
    }

    update() {
        if (!this.sprite) return
        this.sprite.skew.x =
            Math.sin(
                this.game.frameCounter * 0.04 * this.randomMoveSpeed
            ) * 0.1;
    }

}
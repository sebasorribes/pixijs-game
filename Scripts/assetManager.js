class AssetManager{
    constructor(game){
        this.game = game;

        this.buildAttack()
    }

    buildAttack(){
        this.scratchTexture = null;

        PIXI.Assets.load('./Sprites/ataques/zarpazo.png').then((texture) => {
            this.spiteAtaque = texture;
        });
    }
}
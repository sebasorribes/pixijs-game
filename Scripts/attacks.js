class Attack {
    constructor(player, initialExecutionFrame = 0) {
        this.id = "Attack" + generateRandomID();
        this.x = player.x;
        this.y = player.y;
        this.character = player;
        this.game = player.game;
        this.active = true;
        if (player.currentDirection == "right" || player.currentDirection == "left") {
            this.width = 20;
            this.height = 100;

        } else {
            this.width = 100;
            this.height = 20;
        }

        this.container = new PIXI.Container();
        this.container.name = "mainContainer"
        this.innerContainer = new PIXI.Container();
        this.innerContainer.name = "innerContainer"
        this.container.addChild(this.innerContainer);

        this.cell
        this.nearEntities = [];

        this.lastFrameExecuted = initialExecutionFrame;

    }

    // Método para destruir el ataque
    destroy() {
        if (!this.active) return;
        this.active = false;
        this.cell.delete(this);
        this.sprite.destroy();
        this.container.destroy();
        this.game.mainContainer.removeChild(this.container); // Eliminar del contenedor principal
        this.game.attacks = this.game.attacks.filter((k) => k.id =! this.id)
        //console.log("Ataque destruido");
    }

    refreshPositionOnGrid() {
        this.game.grid.updateEntityPosition(this);
    }

    InTheSameCellPreviousFrame() {
        if (isNaN(this.xPrevious) || isNaN(this.yPrevious)) return false;

        let gridX = Math.floor(this.x / this.game.cellSize);
        let gridY = Math.floor(this.y / this.game.cellSize);

        let gridXPrevious = Math.floor(this.xPrevious / this.game.cellSize);
        let gridYPrevious = Math.floor(this.yAnterior / this.game.cellSize);

        if (gridX == gridXPrevious && gridY == gridYPrevious) {
            return true;
        }

        return false;
    }
}

class BasicSlashAttack extends Attack {
    constructor(player, initialExecutionFrame, actualLevel) {
        super(player, initialExecutionFrame);
        this.damage = 25 * actualLevel;
        this.type = "basic";

        this.makeSprite();
        this.position(this.character.currentDirection);
        this.game.mainContainer.addChild(this.container);
        this.refreshPositionOnGrid();
        this.render();
    }

    makeSprite() {
        // Crear el sprite del ataque (puedes usar una textura)
        this.sprite = new PIXI.Graphics()
            .rect(0, 0, this.width, this.height)
            .fill(0xff0000);
        this.container.addChild(this.sprite);
    }

    position(playerDirection) {
        if (playerDirection == "right" || playerDirection == "left") {
            // Posicionar el ataque frente al personaje
            this.x = this.character.x + (playerDirection == "right" ? 100 : -200); // Ajusta según la dirección
            this.y = this.character.y - 50;

        } else {
            // Posicionar el ataque frente al personaje
            this.x = this.character.x - 50;
            this.y = this.character.y + (playerDirection == "front" ? 100 : -200); // Ajusta según la dirección
        }
    }

    render() {
        this.container.x = this.x
        this.container.y = this.y
    }


}
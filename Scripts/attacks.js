class Attack {
    constructor(player, initialExecutionFrame = 0) {
        this.id = generateRandomID();
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

        this.lastFrameExecuted = initialExecutionFrame;

    }

    //todos lo ataques se ejecutan, movimiento y posicion de los ataques.

    // Método básico de ejecución
    execute(actualFrame) {
        if (!this.active) return;

        if ((actualFrame - this.lastFrameExecuted) % this.framesAttackCooldown == 0) {
            this.performAttack();
            this.lastFrameExecuted = actualFrame;
        }
    }

    // Método para destruir el ataque
    destroy() {
        if (!this.active) return;
        this.active = false;
        this.game.mainContainer.removeChild(this.container); // Eliminar del contenedor principal
        console.log("Ataque destruido");
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
        this.render();
    }

    makeSprite() {
        // Crear el sprite del ataque (puedes usar una textura)
        this.graf = new PIXI.Graphics()
            .rect(0, 0, this.width, this.height)
            .fill(0xff0000);
        this.container.addChild(this.graf);
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
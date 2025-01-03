class Attack {
    constructor(player, initialExecutionFrame = 0) {
        this.id = "Attack" + generateRandomID();
        this.x = player.x;
        this.y = player.y;
        this.character = player;
        this.game = player.game;

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
        try {
            if (!this.active) return;
            this.active = false;
            this.cell.delete(this);
            this.sprite.destroy();
            this.container.destroy();
            this.game.mainContainer.removeChild(this.container); // Eliminar del contenedor principal
            this.game.attacks = this.game.attacks.filter((k) => k.id != this.id)
        } catch (e) {
            console.log(e);
        }
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
    constructor(player, initialExecutionFrame, actualLevel, direction) {
        super(player, initialExecutionFrame);
        this.damage = 50 * actualLevel;
        this.type = "basic";
        this.container.name = this.type;

        if (direction == "right" || direction == "left") {
            this.width = 50;
            this.height = 120;

        } else {
            this.width = 120;
            this.height = 50;
        }

        this.makeSprite()


        this.position(direction);
        this.game.mainContainer.addChild(this.container);
        this.refreshPositionOnGrid();
        this.render();
    }

    makeSprite() {

        this.sprite = new PIXI.Sprite(attacksSprite["zarpaso"]);
        this.sprite.anchor.set(0, 0);
        this.sprite.width = this.width;
        this.sprite.height = this.height;
        this.container.addChild(this.sprite);
        this.active = true;

    }

    position(playerDirection) {
        if (playerDirection == "right" || playerDirection == "left") {
            // Posicionar el ataque frente al personaje
            this.x = this.character.x + (playerDirection == "right" ? 40 : -80); // Ajusta según la dirección
            this.y = this.character.y - 72;

        } else {
            // Posicionar el ataque frente al personaje
            this.x = this.character.x - 65;
            this.y = this.character.y + (playerDirection == "front" ? 30 : -80); // Ajusta según la dirección
        }
        this.x += this.character.speed.x + this.character.acc.x;
        this.y += this.character.speed.y + this.character.acc.y;
    }

    render() {
        this.container.x = this.x
        this.container.y = this.y
    }


}

class FishStrike extends Attack {
    constructor(player, initialExecutionFrame, actualLevel, velocityX) {
        super(player, initialExecutionFrame);
        this.damage = 60 * actualLevel;
        this.originPoint = player.y;
        this.type = "fishStrike";
        this.velocityY = -15;
        this.velocityX = velocityX * 3;
        this.gravity = 0.5;
        this.width = 20;
        this.height = 20;
        this.container.name = this.type;

        this.makeSprite();
        this.game.mainContainer.addChild(this.container);
        this.render();
    }

    makeSprite() {
            this.sprite = new PIXI.Sprite(attacksSprite["pescadazo"]);
            this.sprite.anchor.set(0.5, 0.5);
            this.sprite.width = this.width;
            this.sprite.height = this.height;

            // Agregar el sprite al contenedor
            this.container.addChild(this.sprite);
            this.active = true;
    }

    update() {
        if (!this.active) return;
        this.y += this.velocityY;
        this.x += this.velocityX;
        this.velocityY += this.gravity; // Aplicar gravedad 
        if (this.y > this.originPoint + 30) {
            this.destroy(); // Destruir el ataque si cae fuera del juego 
            return;
        }
        this.render();
        this.refreshPositionOnGrid();
    }

    render() {
        this.container.x = this.x
        this.container.y = this.y
        this.container.rotation += 0.35;
    }
}

class StoneTrailAttack extends Attack {
    constructor(player, initialExecutionFrame) {
        super(player, initialExecutionFrame);
        this.damage = 30; // Daño del ataque 
        this.type = "stoneTrail";
        this.width = 50;
        this.height = 50;
        this.duration = 45; // Duración en frames antes de desaparecer 
        this.trail = []; // Almacenar las posiciones de las piedras 
        this.container.name = this.type;

        this.createTrail();

        this.game.mainContainer.addChild(this.container);
        this.refreshPositionOnGrid();
        this.active = true;
    }

    createTrail() {
            let stone = new PIXI.Sprite(attacksSprite["piedritas"]);
            stone.anchor.set(0.5, 0.5);
            stone.x = this.character.x;
            stone.y = this.character.y;
            stone.width = this.width;
            stone.height = this.height;

            // Agregar el sprite al contenedor
            this.trail.push({ stone, frame: 0 });
            this.container.addChild(stone);
    }

    update(actualFrames, actualLevel) {
        if (!this.active) return; // Crear nuevas piedras 
        if (actualLevel > 2) {
            this.damage = 50;
            this.width = 100;
            this.height = 100;
            this.duration = 65; // Duración en frames antes de desaparecer 
        }
        if (actualFrames % 30 === 0) { // Ajustar la frecuencia de creación de piedras 
            this.createTrail();
        } // Actualizar y eliminar piedras según su duración 
        this.trail.forEach((stoneData, index) => {
            stoneData.frame++;
            if (stoneData.frame >= this.duration) {
                this.container.removeChild(stoneData.stone);
                this.trail.splice(index, 1);
            }
        });
        this.render();
        this.refreshPositionOnGrid();
    }
    render() {
        this.trail.forEach(stoneData => {
            stoneData.stone.x = stoneData.stone.x;
            stoneData.stone.y = stoneData.stone.y;
        });
    }

    destroy() {
        if (!this.active) return;
        this.active = false;
        this.trail.forEach(stoneData => {
            this.container.removeChild(stoneData.stone);
        });
        this.container.destroy();
        this.game.mainContainer.removeChild(this.container);
        this.cell.delete(this)
    }
}
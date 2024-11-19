class Attack {
    constructor(player, initialExecutionFrame = 0) {
        this.id = "Attack" + generateRandomID();
        this.x = player.x;
        this.y = player.y;
        this.character = player;
        this.game = player.game;
        this.active = true;

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
        this.game.attacks = this.game.attacks.filter((k) => k.id != this.id)
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
    constructor(player, initialExecutionFrame, actualLevel,direction) {
        super(player, initialExecutionFrame);
        this.damage = 25 * actualLevel;
        this.type = "basic";

        if (direction == "right" || direction == "left") {
            this.width = 20;
            this.height = 100;

        } else {
            this.width = 100;
            this.height = 20;
        }

        this.makeSprite();
        
        this.position(direction);
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

    makeSecondSprite() {
        // Crear el sprite del ataque (puedes usar una textura)
        this.sprite2 = new PIXI.Graphics()
            .rect(0, 0, this.width, this.height)
            .fill(0xff0000);
        this.container.addChild(this.sprite2);
    }

    position(playerDirection) {
        if (playerDirection == "right" || playerDirection == "left") {
            // Posicionar el ataque frente al personaje
            this.x = this.character.x + (playerDirection == "right" ? 30 : -60); // Ajusta según la dirección
            this.y = this.character.y - 50;

        } else {
            // Posicionar el ataque frente al personaje
            this.x = this.character.x - 50;
            this.y = this.character.y + (playerDirection == "front" ? 60 : -20); // Ajusta según la dirección
        }
    }

    render() {
        this.container.x = this.x
        this.container.y = this.y
    }


}

class FishStrike extends Attack {
    constructor(player, initialExecutionFrame, actualLevel,velocityX) {
        super(player, initialExecutionFrame);
        this.damage = 50 * actualLevel;
        this.originPoint = player.y;
        this.type = "fishStrike";
        this.velocityY = -15;
        this.velocityX = velocityX * 3;
        this.gravity = 0.5;
        this.width = 20;
        this.height = 20;

        this.makeSprite();
        this.game.mainContainer.addChild(this.container);
        this.render();
    }

    makeSprite() {
        // Crear el sprite del ataque (puedes usar una textura)
        this.sprite = new PIXI.Graphics()
            .rect(0, 0, this.width, this.height)
            .fill(0xff0000);
        this.container.addChild(this.sprite);
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
        this.container.rotation += 0.15;
    }
}

class StoneTrailAttack extends Attack {
    constructor(player, initialExecutionFrame) {
        super(player, initialExecutionFrame);
        this.damage = 14; // Daño del ataque 
        this.type = "stoneTrail";
        this.width = 25;
        this.height = 25;
        this.duration = 45 ; // Duración en frames antes de desaparecer 
        this.trail = []; // Almacenar las posiciones de las piedras 
        this.createTrail();
        this.game.mainContainer.addChild(this.container);
        this.refreshPositionOnGrid();
    }

    createTrail() {
        let stone = new PIXI.Graphics().beginFill(0x8B4513) // Color marrón para las piedras 
            .drawRect(0, 0, this.width, this.height)
            .endFill();
        stone.x = this.character.x;
        stone.y = this.character.y;
        this.trail.push({ stone, frame: 0 });
        this.container.addChild(stone);
    }

    update(actualFrames, actualLevel) {
        if (!this.active) return; // Crear nuevas piedras 
        if (actualLevel > 2) {
            this.damage = 20;
            this.width = 50;
            this.height = 50;
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
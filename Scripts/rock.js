class Rock {
    constructor(game, x, y, cellSize) {

        this.container = new PIXI.Container();
        this.container.name = "Rock"
        this.innerContainer = new PIXI.Container();
        this.innerContainer.name = "innerContainer"
        this.container.addChild(this.innerContainer);




        this.id = "rock" + generateRandomID();
        this.game = game;
        this.x = x;
        this.y = y;
        this.container.x = this.x;
        this.container.y = this.y;
        this.cellSize = cellSize;

        this.cell;
        this.nearEntities = [];

        this.game.mainContainer.addChild(this.container);
        // Crear el sprite de la roca

        this.loadSprite();
    }

    loadSprite() {
        let texture = rockSprite;
        // Create a sprite from the loaded texture
        let width = texture.width;
        this.sprite = new PIXI.Sprite(texture);

        //GUARDO EL RADIO DEL OBSTACULO PORQ LO USO PARA DETECTAR COLISIONES CON LOS PERSONAJES
        this.radio = 8;

        this.sprite.anchor.set(0.5, 0.79); // Centrado de la roca

        this.container.pivot.x = this.sprite.anchor.x / 2;
        this.container.pivot.y = this.sprite.anchor.y + 6;

        this.container.addChild(this.sprite);  // Agregar el sprite al escenario


        this.container.zIndex = Math.floor(this.container.y);
        this.container.scale.x = -1;
        this.addToGrid();

    }

    addToGrid() {
        this.refreshPositionOnGrid();
        //ME FIJO EL ANCHO DE ESTA PIEDRA Y LA METO EN MAS DE UNA CELDA, PARA Q LAS COLISIONES NO SEAN SOLO CON LA CELDA CENTRAL DONDE ESTA LA PIEDRA
        if (this.radio > this.game.grid.cellSize) {
            let dif = this.radio - this.game.grid.cellSize;
            let numberNeighborsCell = Math.ceil(dif / this.game.grid.cellSize);
            let myCell = this.game.grid.getCellPX(
                this.container.x,
                this.container.y
            );
            for (let i = 1; i <= numberNeighborsCell; i++) {
                //celda para la izq:
                let leftCell = this.game.grid.getCell(myCell.x - i, myCell.y);
                leftCell.add(this);
                //celda der:
                let rightCell = this.juego.grid.getCell(myCell.x + i, myCell.y);
                rightCell.add(this);
            }
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




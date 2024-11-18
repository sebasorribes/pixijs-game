class Rock {
    constructor(game, x, y, cellSize) {
        
        this.container = new PIXI.Container();
        this.container.name = "MainContainer"
        this.innerContainer = new PIXI.Container();
        this.innerContainer.name = "innerContainer"
        this.container.addChild(this.innerContainer);
       

        this.id = "rock" + generateRandomID();
        this.game = game;
        this.x = x;
        this.y = y;
        this.cellSize = cellSize;

        this.width = 40;  // Tamaño de la roca
        this.height = 40;
        
        this.cell;
        this.nearEntities = [];
        
        this.game.mainContainer.addChild(this.container);
        // Crear el sprite de la roca
        
        this.cargarSprite();
        this.refreshPositionOnGrid();
    }

   
    cargarSprite(){
        PIXI.Assets.load('sprites/obstaculos/roca2.png').then((texture) => {
            // Create a sprite from the loaded texture
            const sprite = new PIXI.Sprite(texture);
            

            // Set the position and size of the background
            sprite.x = this.x;
            sprite.y = this.y;
       
            sprite.anchor.set(0.5, 1); // Centrado de la roca
            console.log(sprite)
            this.container.addChild(sprite);  // Agregar el sprite al escenario


            // Add the background to the stage
           

            

        })
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
    



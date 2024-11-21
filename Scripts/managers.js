class RockManager {
    constructor(game, grid, cellSize, rockCount = 10) {
        this.game = game;
        this.grid = grid;
        this.cellSize = cellSize;
        this.rockCount = rockCount;
        this.rocks = [];

        this.generateRocks(); // generar rocas  al inicio
    }

    generateRocks() {
        for (let i = 0; i < this.rockCount; i++) {
            let x = Math.floor(Math.random() * this.game.backgroundSize.x);
            let y = Math.floor(Math.random() * this.game.backgroundSize.y);

            // creamos roca y la agregamos a la cuadricula
            let rock = new Rock(this.game, x, y, this.cellSize);
    
            
            this.rocks.push(rock);

        }
    }
}

class HealthManager{
    constructor(game){
        this.game = game;
        this.healths = [];
    }

    putHealth(){
        if(this.checkHealtsInMap()){
            this.healths.push(new Health(this.game,this));
        }
    }

    checkHealtsInMap(){
        return this.healths.length <= 2;
    }
}

class GrassManager{
    constructor(game,numGrass){
        this.game = game;
        this.grass = [];

        for(let i=0; i < numGrass; i++){
            this.grass.push(new Grass(this.game))
        }
    }

    update(){
        for(let i=0; i < this.grass.length; i++){
            this.grass[i].update();
        }
    }
}
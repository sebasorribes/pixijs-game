class Cell {
    constructor(game, cellSize, x, y) {
      this.game = game;
      this.entitiesHere = [];
      this.x = x;
      this.y = y;
      this.cellSize = cellSize;
      this.dibujame();
      
    }
  
    dibujame() {
      this.game.sketcher
        .rect(
          this.x * this.cellSize,
          this.y * this.cellSize,
          this.cellSize,
          this.cellSize
        )
        .stroke();
    }
  
    add(entity) {
      this.entitiesHere.push(entity);
    }
  
    delete(entity) {
      this.entitiesHere = this. entitiesHere.filter((k) => k.id != entity.id);
    }

    getNearCells() {
      let arr = [];
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          
          if (i == 0 && j == 0) continue;
  
          let indeX = this.x + i;
          if (indeX < 0) indeX = 0;
          else if (indeX > this.game.grid.cells.length - 1)
            indeX =  this.game.grid.cells.length;
  
          let indeY = this.y + j;
          if (indeY < 0) indeY = 0;
          else if (indeY > this.game.grid.cells[indeX].length - 1)
            indeY = this.game.grid.cells[indeX].length;
  
          let cell = this.game.grid.cells[indeX][indeY];
         
          arr.push(cell);
        }
      }
      this.nearCells = arrayUnique(arr)
  
      return this.nearCells;
    }
  
    getEntitiesHereAndCellsNear() {
      let arrToReturn = [...this.entitiesHere];
  
      for (let cell of this.getNearCells()) {
        if (cell && cell.entitiesHere) {
          arrToReturn = [
            ...arrToReturn,
            ...cell.entitiesHere,
          ];
        }
      }
      return mixArray(arrToReturn);
    }
  }
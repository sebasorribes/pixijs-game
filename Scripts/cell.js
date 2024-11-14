class Cell {
    constructor(game, cellSize, x, y) {
      this.game = game;
      this.entitiesHere = {};
      this.x = x;
      this.y = y;
      this.cellSize = cellSize;
    }
  
    add(entity) {
      this.entitiesHere[entity.id] = entity;
    }
  
    delete(entity) {
      delete this.entitiesHere[entity.id];
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
  
      return arrayUnique(arr);
    }
  
  
  
    getNearCells2Levels() {
      let arr = [];
      for (let i = -2; i <= 2; i++) {
        for (let j = -2; j <= 2; j++) {
          
          if (i == 0 && j == 0) continue;
  
          let indeX = this.x + i;
          if (indeX < 0) indeX = 0;
          else if (indeX > this.game.grid.cells.length - 1)
            indeX = this.game.grid.cells.length;
  
          let indeY = this.y + j;
          if (indeY < 0) indeY = 0;
          else if (indeY > this.game.grid.cells[indeX].length - 1)
            indeY = this.jgame.grid.cells[indeX].length;
  
          let cell = this.game.grid.cells[indeX][indeY];
          // debugger
          arr.push(cell);
        }
      }
  
      return arrayUnique(arr);
    }
  
    
    getEntitiesHereAndCellsNear2Levels() {
      let cells = [this, ...this.getNearCells2Levels()];
  
      let arrToReturn = [];
  
      for (let cell of cells) {
        if (cell && cell.entitiesHere) {
          arrToReturn = [
            ...arrToReturn,
            ...Object.values(cell.entitiesHere),
          ];
        }
      }
  
      return arrToReturn;
    }
  
  
    getEntitiesHereAndCellsNear() {
      let cells = [this, ...this.getNearCells()];
  
      let arrToReturn = [];
  
      for (let cell of cells) {
        if (cell && cell.entitiesHere) {
          arrToReturn = [
            ...arrToReturn,
            ...Object.values(cell.entitiesHere),
          ];
        }
      }
  
      return arrToReturn;
    }
  }
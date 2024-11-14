class Grid {
    constructor(game, cellSize) {
      this.cellSize = cellSize;
      this.game = game;
  
      this.extraCells = 50;
  
      this.numberCellsWidth =
        Math.floor(this.game.width / this.cellSize) + 1;
  
      this.numberCellsHeight =
        Math.floor(this.game.height / this.cellSize) + 1;
  
      this.cells = [];
      for (
        let i = 0;
        i <
        this.numberCellsWidth +
          this.extraCells;
        i++
      ) {
        this.cells.push([]);
  
        for (
          let j = 0;
          j <
          this.numberCellsHeight +
            this.extraCells;
          j++
        ) {
          this.cells[i][j] = new Cell(this.game, this.cellSize, i, j);
        }
      }
    }
  
    updateEntityPosition(entity) {
      if (entity.InTheSameCellPreviousFrame()) return; //ver esto
      try {
        let gridX = Math.floor(entity.x / this.cellSize);
        let gridY = Math.floor(entity.y / this.cellSize);
  
        if (gridX < 0) gridX = 0;
        if (gridY < 0) gridY = 0;
  
        //si la entidad ya estaba en una celda, la sacamos de esa celda
        if (entity.cell) entity.cell.delete(entity);
  
        //buscamos la celda en la q esta ahora esta entidad
        let cell = this.cells[gridX][gridY];
        //y le asignamos a la entidad esta celda en su propiedad homonima
        entity.cell = cell;
  
        cell.add(entity);
      } catch (e) {
        console.log(e);
        debugger;
      }
    }
  
    update() {
      for (
        let i = 0;
        i <
        this.numberCellsWidth +
          this.extraCells;
        i++
      ) {
        //   this.celdas.push([]);
  
        for (
          let j = 0;
          j <
          this.numberCellsHeight +
            this.extraCells;
          j++
        ) {
          if (this.cells[i][j]) {
            this.cells[i][j].update();
          }
        }
      }
    }
  }
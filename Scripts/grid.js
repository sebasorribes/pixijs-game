class Grid {
    constructor(game, cellSize) {
      this.cellSize = cellSize;
      this.game = game;
  
      this.extraCells = 50; //VER
  
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

    getCellPX(x, y) {
      const xIndex = Math.floor(x / this.cellSize);
      const yIndex = Math.floor(y / this.cellSize);
  
      let newx = Math.max(0, Math.min(this.numberCellsWidth - 1, xIndex));
      let newy = Math.max(0, Math.min(this.numberCellsHeight - 1, yIndex));
      return this.cells[newx][newy];
    }
  
    getCell(x, y) {
      // Asegurarse de que los índices estén dentro de los límites de la matriz
      let newx = Math.max(0, Math.min(this.numberCellsWidth - 1, x));
      let newy = Math.max(0, Math.min(this.numberCellsHeight - 1, y));
  
      return this.cells[newx][newy];
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
        entity.nearEntities = [];
        //buscamos la celda en la q esta ahora esta entidad
        let cell = this.cells[gridX][gridY];
        //y le asignamos a la entidad esta celda en su propiedad homonima
        entity.cell = cell;
        entity.nearEntities = cell.getEntitiesHereAndCellsNear();
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
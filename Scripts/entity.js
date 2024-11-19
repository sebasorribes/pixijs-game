class Entity {
    constructor(x, y, game) {
        this.x = x;
        this.y = y;

        this.container = new PIXI.Container();
        this.container.name = "MainContainer"
        this.innerContainer = new PIXI.Container();
        this.innerContainer.name = "innerContainer"
        this.container.addChild(this.innerContainer);

        this.game = game;
        this.game.mainContainer.addChild(this.container);

        this.cell;
        this.nearEntities = [];

        this.vision = 100;
        this.ready = false;

        this.godMode = false;
        this.lastFrameGodMode = 0;

        this.speed = { x: 0, y: 0 };
        this.acc = { x: 0, y: 0 };
    }

    checkLimitScreen() {
        let margin = 50
        if (this.x > this.game.backgroundSize.x - margin) {
            //margen derecho
            this.speed.x = -Math.abs(this.speed.x)
        } else if (this.x < margin) {
            //margen izq
            this.speed.x = Math.abs(this.speed.x)
        }

        if (this.y > this.game.backgroundSize.y - margin) {
            this.speed.y = -Math.abs(this.speed.y)
        } else if (this.y < margin) {
            this.speed.y = Math.abs(this.speed.y)
        }


    }

    changeStateGodMode(actualFrame) {
        if (this.godMode && (actualFrame - this.lastFrameGodMode) % this.godModeTime == 0) {
            this.godMode = false;
        }
    }

    update() {
        if (!this.ready) return

        this.acc = limitMagnitude(this.acc, this.accMax);
        this.speed.x += this.acc.x;
        this.speed.y += this.acc.y;
        this.acc.x = 0;
        this.acc.y = 0;

        this.speed = limitMagnitude(this.speed, this.speedMax);

        this.changeZOrder()

        this.x += this.speed.x;
        this.y += this.speed.y;
        this.checkLimitScreen();

        this.friction()
        this.refreshPositionOnGrid();
        this.nightmaresNear = this.findNearNightmaresUsingGrid();
        this.rocksNear = this.findNearRocksUsingGrid();
        
    }


    applyForce(x, y) {
        this.acc.x += x;
        this.acc.y += y;
    }

    render() {
        this.innerContainer.rotation = this.angulo;
        this.container.x = this.x;
        this.container.y = this.y;
    }

    friction() {
        this.speed.x *= 0.9;
        this.speed.y *= 0.9;
    }


    changeZOrder() {
        this.container.zIndex = this.y
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

    refreshPositionOnGrid() {
        this.game.grid.updateEntityPosition(this);
    }

    findNearNightmaresUsingGrid() {
        let ret = [];
        if (this.cell) {
            //let nearEntities = this.cell.getEntitiesHereAndCellsNear();

            for (let i = 0; i < this.nearEntities.length; i++) {
                let dep = this.nearEntities[i];
                if ((dep.id.substring(0, 9) == "Nightmare") && dep != this) {
                    let dist = calcDistance(dep, this);
                    if (dist < this.vision) {
                        ret.push({ nightmare: dep, dist: dist });
                    }
                }
            }
        } else {
            return [];
        }

        return ret;
    }

    findNearRocksUsingGrid() {
        let ret = [];
        if (this.cell) {
            //let nearEntities = this.cell.getEntitiesHereAndCellsNear();

            for (let i = 0; i < this.nearEntities.length; i++) {
                let dep = this.nearEntities[i];
                if ((dep.id.substring(0, 4) == "rock") && dep != this) {
                    ret.push(dep);

                }
            }
        } else {
            return [];
        }

        return ret;
    }

    encounterRocks() {
        for (let i = 0; i < this.rocksNear.length; i++) {
            let rock = this.rocksNear[i];
            if (
                distance(this, rock) < rock.radio * rock.radio
            ) {
                if (this.x > rock.x) {
                    //margen derecho
                    this.speed.x = Math.abs(this.speed.x)
                } else if (this.x < rock.x) {
                    //margen izq
                    this.speed.x = -Math.abs(this.speed.x)
                }
        
                if (this.y > rock.y) {
                    this.speed.y = Math.abs(this.speed.y)
                } else if (this.y < rock.y) {
                    this.speed.y = -Math.abs(this.speed.y)
                }
            }

        }
    }

    repelerObstaculos(vecinos) {
        const vecFuerza = new PIXI.Point(0, 0);
        let cant = 0;
        vecinos.forEach((obstaculo) => {
            if (obstaculo instanceof Piedra) {
                const distCuadrada = distanciaAlCuadrado(
                    this.container.x,
                    this.container.y,
                    obstaculo.container.x,
                    obstaculo.container.y
                );

                if (distCuadrada < obstaculo.radio ** 2) {
                    //SI ESTA A MENOS DE UNA CELDA DE DIST
                    const dif = new PIXI.Point(
                        this.container.x - obstaculo.container.x,
                        this.container.y - obstaculo.container.y
                    );
                    dif.x /= distCuadrada;
                    dif.y /= distCuadrada;
                    vecFuerza.x += dif.x;
                    vecFuerza.y += dif.y;
                    cant++;
                }
            }
        });
        if (cant) {
            vecFuerza.x *= 40;
            vecFuerza.y *= 40;
            // vecFuerza.x += -this.velocidad.x;
            // vecFuerza.y += -this.velocidad.y;
        }

        return vecFuerza;
    }

}
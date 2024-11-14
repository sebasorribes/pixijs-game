class Nightmare extends Entity{
    constructor(x, y, game) {
        super(x, y, game);

        this.id = generateRandomID()
        this.width = 20;
        this.height = 10;

        this.life = 200;
        this.speedMax = 10;
        this.accMax = 2;
        
        
        this.listo = true;

        this.vision = 100;
        this.factorGroup = 1;
        this.separationFactor = 840;
        this.limitToBeClose = 500;
        this.alignFactor = 6.3;
        this.averagePositionVector = { x: 0, y: 0 };

        this.chaseFactor = 1;

        this.makeGraf();
    }

    
    update(){
        this.nightmaresNear = this.findNightmaresNear();

        this.cohesion(this.nightmaresNear);
        this.separation(this.nightmaresNear);
        this.alignment(this.nightmaresNear);
        this.Chase();
        super.update();
    }

    findNearNightmaresUsingGrid() {
        let ret = [];
        if (this.cell) {
          // let entidadesCerca = this.celda.obtenerEntidadesAcaYEnLasCeldasVecinas();
    
          for (let i = 0; i < this.entidadesCerca.length; i++) {
            let dep = this.entidadesCerca[i];
            if (dep.tipo == "depredador" && dep != this) {
              let dist = this.juego.calcularDistancia(dep, this);
              if (dist < this.vision) {
                ret.push({ presa: dep, dist: dist });
              }
            }
          }
        } else {
          return [];
        }
    
        return ret;
      }

    findNightmaresNear() {
        let nightmaresNear = [];
        for (let nightmare of this.game.nightmares) {
            if (nightmare == this) continue;
            let dist = distance(nightmare, this);
            if (dist < this.vision) {
                nightmaresNear.push({ nightmare, dist });
            }
        }
        return nightmaresNear;
    }

    cohesion(nightmaresNear) {
        if (nightmaresNear.length == 0) return;

        let avgX = 0;
        let avgY = 0;
        let total = 0;
        for (let nightmare of nightmaresNear) {
            if (nightmare.dist > this.limitToBeClose) {
                total++;
                avgX += nightmare.nightmare.x;
                avgY += nightmare.nightmare.y;
            }
        }

        if (total == 0) return;

        avgX /= total;
        avgY /= total;

        this.PointsToAveragePositionsForGrouping = {
            x: avgX - this.x,
            y: avgY - this.y,
        };

        this.applyForce(
            this.PointsToAveragePositionsForGrouping.x *
            this.factorGroup,
            this.PointsToAveragePositionsForGrouping.y *
            this.factorGroup
        );
    }

    separation(nightmaresNear) {
        let avgX = 0;
        let avgY = 0;

        if (nightmaresNear.length == 0) return;

        let total = 0;
        for (let nightmare of nightmaresNear) {
            if (nightmare.dist < this.limitToBeClose) {
                total++;
                avgX += nightmare.nightmare.x;
                avgY += nightmare.nightmare.y;
            }
        }
        if (total == 0) return;

        avgX /= total;
        avgY /= total;

        this.averagePositionVector = {
            x: this.x - avgX,
            y: this.y - avgY,
        };

        this.applyForce(
            this.averagePositionVector.x * this.separationFactor,
            this.averagePositionVector.y * this.separationFactor
        );
    }

    alignment(nightmaresNear) {
        if (nightmaresNear.length == 0) return;

        let avgSpeedX = 0;
        let avgSpeedY = 0;

        for (let nightmare of nightmaresNear) {
            avgSpeedX += nightmare.nightmare.speed.x;
            avgSpeedY += nightmare.nightmare.speed.y;
        }

        avgSpeedX /= nightmaresNear.length;
        avgSpeedY /= nightmaresNear.length;

        this.averageSpeedsOfNeighbors = { x: avgSpeedX, y: avgSpeedY };

        let force = {
            x: this.averageSpeedsOfNeighbors.x - this.speed.x,
            y: this.averageSpeedsOfNeighbors.y - this.speed.y,
        };

        this.applyForce(
            force.x * this.alignFactor,
            force.y * this.alignFactor
        );
    }
    
    Chase() {
        if (!game.player) return;

        let vectorToTarget = { x: game.player.x - this.x, y: game.player.y - this.y };

        //NORMALIZAR UN VECTOR ES LLEVAR SU DISTANCIA A 1 (LA DISTANCIA ES LA HIPOTENUSA DEL TRIANGULO RECTANGULO Q SE GENERA ENTRE 0,0 Y EL PUNTO x,y DEL VECTOR)
        let normalizedVector = normalizeVector(vectorToTarget);
        //ESTA ES EL VECTOR DE VELOCIDAD AL CUAL QUEREMOS IR PARA LLEGAR AL OBJETIVO
        let normalizedWishSpeed = {
            x: normalizedVector.x * this.chaseFactor,
            y: normalizedVector.y * this.chaseFactor,
        };


        this.applyForce(normalizedWishSpeed.x, normalizedWishSpeed.y);
    }

    makeGraf() {
        this.sprite = new PIXI.Graphics()
            .rect(0, 0, this.width, this.height)
            .fill('blue');
        this.container.addChild(this.sprite);
    }

    takeDamage(damage){
        this.life -= damage

        if (this.life <= 0) {
            this.changeToDream();
        }
    }
}
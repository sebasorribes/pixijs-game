class Nightmare extends Entity {
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

        this.animatedSprite();
    }

    async animatedSprite() {
        let json = await PIXI.Assets.load('./Sprites/perros/texture.json')
        this.sprite = new PIXI.AnimatedSprite(json.animations["run"])
        this.sprite.animationSpeed = 0.1
        this.sprite.loop = true
        this.sprite.play()
        this.container.addChild(this.sprite)

        this.sprite.anchor.set(0.5, 1);
        this.sprite.currentFrame = Math.floor(Math.random() * 8)

        this.listo = true
    }

    cambiarVelocidadDeReproduccionDelSpriteAnimado() {
        this.sprite.animationSpeed = Math.abs(this.velocidadX) * 0.1
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

        // Normalizar el vector
        let normalizedVector = normalizeVector(vectorToTarget);

        // El vector de velocidad para llegar al objetivo
        let normalizedWishSpeed = {
            x: normalizedVector.x * this.chaseFactor,
            y: normalizedVector.y * this.chaseFactor,
        };

        this.applyForce(normalizedWishSpeed.x, normalizedWishSpeed.y);

        // Ahora, determinar hacia dónde está mirando el Nightmare:
        // Si el vector de velocidad en X es positivo, el Nightmare va a la derecha, si es negativo, va a la izquierda
        if (normalizedWishSpeed.x > 0) {
            // El Nightmare se mueve hacia la derecha, asegurémonos de que mira a la derecha
            this.sprite.scale.x = -1;
        } else if (normalizedWishSpeed.x < 0) {
            // El Nightmare se mueve hacia la izquierda, asegurémonos de que mira a la izquierda
            this.sprite.scale.x = 1;
        }
    }




    takeDamage(damage){
        this.life -= damage

        if (this.life <= 0) {
            this.changeToDream();
        }
    }
}


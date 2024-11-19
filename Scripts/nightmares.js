class Nightmare extends Entity {
    constructor(x, y, game,life) {
        super(x, y, game);

        this.id = "Nightmare" + generateRandomID()
        this.container.name = this.id;
        this.width = 12;
        this.height = 10;

        this.life =life;
        this.speedMax = 10;
        this.accMax = 2;


        this.factorGroup = 1;
        this.separationFactor = 84;
        this.limitToBeClose = 35;
        this.alignFactor = 6.3;
        this.averagePositionVector = { x: 0, y: 0 };

        this.chaseFactor = 55;

        this.godMoeTime = 10;
        this.isNightmare = true;
        this.expGain = false;
        this.isActive = true;

        this.animatedSprite();
    }
    makeGraf() {
        this.grafico = new PIXI.Graphics()
            .rect(0, 0, this.width, this.height)
            .fill(0xff0000);
        this.container.addChild(this.grafico);
    }

    async animatedSprite() {
        let json = await PIXI.Assets.load('./Sprites/perros/texture.json');
        this.sprite = new PIXI.AnimatedSprite(json.animations["run"]);
        this.sprite.animationSpeed = 0.1;
        this.sprite.loop = true;
        this.sprite.play();
        this.container.addChild(this.sprite);
        this.sprite.anchor.set(0.5, 1);
        this.container.pivot.x = this.sprite.anchor.x/2;
        this.container.pivot.y = this.sprite.anchor.y;
        this.sprite.currentFrame = Math.floor(Math.random() * 5)

        this.ready = true
    }

    cambiarVelocidadDeReproduccionDelSpriteAnimado() {
        this.sprite.animationSpeed = Math.abs(this.velocidadX) * 0.1
    }


    update(actualFrame) {
        if(!this.ready || !this.isActive) return
        super.update();
        if (!this.isNightmare) return;

        this.cohesion(this.nightmaresNear);
        this.separation(this.nightmaresNear);
        this.alignment(this.nightmaresNear);
        this.chase(this.findPlayerNearUsingGrid());
        this.nearAttacks = this.findNearAttacksUsingGrid();
        this.evadirRocas();
        
        this.takeDamage(actualFrame, this.nearAttacks)


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

    chase(player) {
        if(!player || !player.ready) return;

        let vectorToTarget = { x: player.x - this.x, y: player.y - this.y };

        //agregar spatial hashing aca

        // Normalizar el vector
        let normalizedVector = normalizeVector(vectorToTarget);


        // El vector de velocidad para llegar al objetivo
        let normalizedWishSpeed = {
            x: normalizedVector.x * this.chaseFactor,
            y: normalizedVector.y * this.chaseFactor,
        };

        this.applyForce(normalizedWishSpeed.x, normalizedWishSpeed.y);


        if (normalizedWishSpeed.x > 0) {
            this.sprite.scale.x = -1;
        } else if (normalizedWishSpeed.x < 0) {
            this.sprite.scale.x = 1;
        }
    }

    findNearAttacksUsingGrid() {
        let ret = [];
        if (this.cell) {
            //let nearEntities = this.cell.getEntitiesHereAndCellsNear();

            for (let i = 0; i < this.nearEntities.length; i++) {
                let dep = this.nearEntities[i];
                if (dep.id.substring(0,6) == "Attack" && dep != this) {
                    ret.push(dep);
                }
            }
        } else {
            return [];
        }
        return ret;
    }

    findPlayerNearUsingGrid() {
        if (this.cell) {

            if(this.nearEntities.length > 0){
                return this.nearEntities.find(entity => entity.id.substring(0,6) == "player");
            }else{
                return null;
            }
        } else {
            return null;
        }
    }

    takeDamage(actualFrame, attacks) {
        if (attacks.length == 0) return;
        for (let i = 0; i < attacks.length; i++) {
            let attack = attacks[i];
            if (
                isOverlap(
                    { ...this, y: this.y, x: this.x },
                    attack
                ) || distance(this, attack) <= 1
            ) {

                this.life -= attack.damage;
                this.godMode = true;
                this.lastFrameGodMode = actualFrame;
                if (this.life <= 0) {
                    this.life = 0
                    this.game.points += 20;
                    this.changeToDream();
                }

            }

        }
    }

    changeToDream() {
        this.isNightmare = false;
        this.game.checkWave();
        this.container.removeChild(this.sprite)
        this.sprite = new PIXI.Graphics()
            .rect(0, 0, 20, 20)
            .fill(0xFFFFFF);
        this.container.addChild(this.sprite);
    }

    destroy() {
        this.cell.delete(this);
        this.game.nightmares = this.game.nightmares.filter((k) => k.id != this.id);
        this.game.mainContainer.removeChild(this.container);
        this.sprite.destroy();
        this.container.destroy()
        this.expGain = true;
    }

    evadirRocas() {
        let framesParaPredecir = 10;
        let factor = 100000000;
    
        for (let obs of this.findNearRocksUsingGrid()) {
          //VEO LA DISTANCIA DESDE DONDE VOY A ESTAR EN 10 FRAMES HASTA EL OBSTACULO
          let distCuadrada = distance(obs, {
            x: this.x + this.speed.x * framesParaPredecir,
            y: this.y + this.speed.y * framesParaPredecir,
          });
    
          let radioCuadrado = obs.radio ** 2;
    
          // let distAlCubo = dist * dist;
    
          if (distCuadrada <= 0) return;
    
          //SI ESTA TOCANDO EL OBSTACULO (CON 5 PIXELES DE CHANGUI):
          //ESTO ES UNA COLISION DIGAMOS...
          if (distCuadrada < radioCuadrado + 5) {
            //LE APLICO MUCHA MAS FUERZA
            let vectorQApuntaDelObstaculoHaciaMi = {
              x: this.x - obs.x,
              y: this.y - obs.y,
            };
            this.applyForce(
              vectorQApuntaDelObstaculoHaciaMi.x * factor,
              vectorQApuntaDelObstaculoHaciaMi.y * factor
            );
          } else if (distCuadrada < 3 * radioCuadrado) {
            //SI LA DISTANCIA ES MENOR AL TRIPLE DEL RADIO...
            let vectorQApuntaDelObstaculoHaciaMi = {
              x: this.x + this.speed.x - obs.x,
              y: this.y + this.speed.y - obs.y,
            };
            //APLICO EL FACTOR DE FUERZA INICIAL Q ES UNA BOCHA, DIVIDIDO LA DIST AL CUBO.
            //LA IDEA ES QUE CUANTO MAS LEJOS MENOS FUERZA Y CUANTO MAS CERCA ESTAS MAS FUERZA EJERCE
            this.applyForce(
              (vectorQApuntaDelObstaculoHaciaMi.x * factor) / distCuadrada,
              (vectorQApuntaDelObstaculoHaciaMi.y * factor) / distCuadrada
            );
          }
        }
      }
}


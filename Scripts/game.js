class Game {
    constructor() {
        
        this.app = new PIXI.Application();
        this.cellSize = 180; //VER
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.backgroundSize = { x: this.cellSize * 18, y: this.cellSize * 12 }
        //this.background = this.preload()


 
        this.scale = 1;
      

        this.attacks = []
        this.skills = { basic: 1, attack1: 0, attack2: 0, attack3: 0 }

 
        this.scale = 1;

       

        this.nightmares = [];
        this.keysPressed = {};
        let promise = this.app.init({ width: this.width, height: this.height });
        this.points = 0;
        this.nightmareLife = 200;
        this.restantNightmare = 0;

        this.app.stage.sortableChildren = true;
        promise.then(e => {
            this.startGame()
        })
    }



    
    preload(){

        PIXI.Assets.load('sprites/background/fondo.png').then((texture) => {
            // Create a sprite from the loaded texture
            const background = new PIXI.Sprite(texture);
            background.zIndex = -999999999999;

            // Set the position and size of the background
            background.anchor.set(0, 0);
            background.width = this.backgroundSize.x;
            background.height = this.backgroundSize.y;
            background.x = 0;
            background.y = 0;


            // Add the background to the stage
            this.mainContainer.addChild(background);

            

        })

        
    }

    startGame() {

        this.mainContainer = new PIXI.Container();
        this.mainContainer.name = "mainContainer";

        this.app.stage.addChild(this.mainContainer);
        this.preload();
        this.sketcher = new PIXI.Graphics();
        this.mainContainer.addChild(this.sketcher);

        this.frameCounter = 0;
        this.isPaused = false;
        this.isGameOver = false;

        document.body.appendChild(this.app.canvas);
        window.__PIXI_APP__ = this.app;
        this.listeners();
        this.grid = new Grid(this, this.cellSize);
        this.rockManager = new RockManager(this, this.grid, this.cellSize, 10); // Borrar a la bosta si no funciona
        this.placePlayer();
        this.placeNightmares(70);
        this.app.ticker.add((e) => {
            this.gameLoop(e);
        });

    }

    listeners() {
        window.onkeydown = (e) => {
            if (e.key == "Escape") {
                this.pause();
            } else {
                if (e.key != "Escape") {
                    this.keysPressed[e.key] = true;
                }
            }
        };

        window.onkeyup = (e) => {
            this.keysPressed[e.key] = false;
        };
    }

    handleMovement() {
        if (this.keysPressed["w"]) this.player.moveUp();
        if (this.keysPressed["s"]) this.player.moveDown();
        if (this.keysPressed["a"]) this.player.moveLeft();
        if (this.keysPressed["d"]) this.player.moveRight();
    }

    gameLoop() {
        if (this.player.ready) {
            this.frameCounter++;
            this.handleMovement();
            this.playerLoop(this.frameCounter);
            this.nightmaresLoop(this.frameCounter);
            this.moveCamera();
            this.makeAttacks(this.frameCounter);
        }
    }

    makeAttacks(actualFrames) {
        this.makeBasic(actualFrames);

    }

    makeBasic(actualFrames) {
        if (actualFrames % 60 == 0) {
            let attack = new BasicSlashAttack(this.player, actualFrames, this.skills.basic);
            this.attacks.push(attack);
        }

        for (let attack of this.attacks) {
            if ((actualFrames + 1 - attack.lastFrameExecuted) % 5 == 0 && attack.type == "basic") {
                attack.destroy();
            }
        }
    }

    playerLoop(frameCounter) {
        if (!this.isGameOver) {
            this.player.changeStateGodMode(frameCounter);
        }
        this.player.update(frameCounter);
        this.player.render();
    }

    nightmaresLoop(frameCounter) {
        for (let nightmare of this.nightmares) {
            if (!this.isGameOver) {
                nightmare.changeStateGodMode(frameCounter);
            }
            nightmare.update(frameCounter, this.attacks);
            nightmare.render();
        }
    }

    placePlayer() {
        this.player = new MainCharacter(this.backgroundSize.x / 2, this.backgroundSize.y / 2, this);
    }

    

    moveCamera() {
        this.mainContainer.pivot.x = this.player.x - (window.innerWidth / 2.4) / this.scale;
        this.mainContainer.pivot.y = this.player.y - (window.innerHeight / 2.4) / this.scale;

        this.mainContainer.scale.set(this.scale);
    }

    buildGameOverMenu() {
        this.gameOverMenu = new PIXI.Graphics();
        this.gameOverMenu.clear();
        this.gameOverMenu.beginFill("0x000000", 0.5);
        this.gameOverMenu.drawRect(0, 0, this.width, this.height);
        this.gameOverMenu.endFill();

        const gameOverText = new PIXI.Text({
            text: "Game Over", style: {
                fontFamily: "Arial",
                fontSize: 64,
                fill: "#00ff00",
                align: "center"
            }
        });
        gameOverText.anchor.set(0.5);
        gameOverText.x = this.width / 2;
        gameOverText.y = this.height / 2 + 25;



        // Estilo para el botón de reinicio
        const restartStyle = new PIXI.TextStyle({
            fontSize: 28,
            fill: "#00ff00" // Color verde para "Restart"
        });

        const restartText = new PIXI.Text(`F5 para reiniciar`, restartStyle);
        restartText.anchor.set(0.5);
        restartText.x = this.width / 2;
        restartText.y = this.height / 2 + 60;

        // Agregar los textos después del fondo, al mismo contenedor
        this.gameOverMenu.addChild(gameOverText);
        this.gameOverMenu.addChild(restartText);

        // Finalmente, agregar el menú al stage
        this.app.stage.addChild(this.gameOverMenu);
    }

    buildlevelUpMenu() {
        this.app.ticker.stop();
        this.levelUpMenu = new PIXI.Graphics();
        this.levelUpMenu.clear();
        this.levelUpMenu.beginFill("0x000000", 0.7);
        this.levelUpMenu.drawRect(0, 0, this.width, this.height);
        this.levelUpMenu.endFill()

        const levelUpText = new PIXI.Text({
            text: "Level up", style: {
                fontFamily: "Arial",
                fontSize: 64,
                fill: "#0720fa",
                align: "center"
            }
        });
        levelUpText.anchor.set(0.5);
        levelUpText.x = this.width / 2;
        levelUpText.y = 50;

        const basicAttack = new PIXI.Text({
            text: "Scratch", style: {
                fontFamily: "Arial",
                fontSize: 28,
                fill: "#0720fa",
                align: "center"
            }
        });
        basicAttack.anchor.set(0.5);
        basicAttack.x = this.width / 2 - 30;
        basicAttack.y = this.height / 2+10 ;

        const basicAttackLevel = new PIXI.Text({
            text: `${this.skills.basic}`, style: {
                fontFamily: "Arial",
                fontSize: 28,
                fill: "#0720fa",
                align: "center"
            }
        });
        basicAttackLevel.anchor.set(0.5);
        basicAttackLevel.x = this.width / 2 + 50;
        basicAttackLevel.y = this.height / 2+10 ;

        const basicAttackUp = new PIXI.Text({
            text: `+`, style: {
                fontFamily: "Arial",
                fontSize: 30,
                fill: "#0720fa",
                align: "center"
            }
        });
        basicAttackUp.anchor.set(0.5);
        basicAttackUp.x = this.width / 2 + 80;
        basicAttackUp.y = this.height / 2 +10 ;
        basicAttackUp.interactive = true;
        basicAttackUp.buttonMode = true;
        basicAttackUp.on('pointerdown', () => this.upgradeSkill('basic'));

        const attack1 = new PIXI.Text({
            text: "Attack 1", style: {
                fontFamily: "Arial",
                fontSize: 28,
                fill: "#0720fa",
                align: "center"
            }
        });
        attack1.anchor.set(0.5);
        attack1.x = this.width / 2 -30 ;
        attack1.y = this.height / 2 + 50;

        const attack1Level = new PIXI.Text({
            text: `${this.skills.attack1}`, style: {
                fontFamily: "Arial",
                fontSize: 28,
                fill: "#0720fa",
                align: "center"
            }
        });
        attack1Level.anchor.set(0.5);
        attack1Level.x = this.width / 2 + 50;
        attack1Level.y = this.height / 2 + 50;

        const attack1Up = new PIXI.Text({
            text: "+", style: {
                fontFamily: "Arial",
                fontSize: 30,
                fill: "#0720fa",
                align: "center"
            }
        });
        attack1Up.anchor.set(0.5);
        attack1Up.x = this.width / 2 + 80;
        attack1Up.y = this.height / 2 + 50;
        attack1Up.interactive = true;
        attack1Up.buttonMode = true;
        attack1Up.on('pointerdown', () => this.upgradeSkill('attack1'));

        const attack2 = new PIXI.Text({
            text: "Attack 2", style: {
                fontFamily: "Arial",
                fontSize: 28,
                fill: "#0720fa",
                align: "center"
            }
        });
        attack2.anchor.set(0.5);
        attack2.x = this.width / 2 - 30;
        attack2.y = this.height / 2 + 90;

        const attack2Level = new PIXI.Text({
            text: `${this.skills.attack2}`, style: {
                fontFamily: "Arial",
                fontSize: 28,
                fill: "#0720fa",
                align: "center"
            }
        });
        attack2Level.anchor.set(0.5);
        attack2Level.x = this.width / 2 + 50;
        attack2Level.y = this.height / 2 + 90;

        const attack2Up = new PIXI.Text({
            text: `+`, style: {
                fontFamily: "Arial",
                fontSize: 30,
                fill: "#0720fa",
                align: "center"
            }
        });
        attack2Up.anchor.set(0.5);
        attack2Up.x = this.width / 2 + 80;
        attack2Up.y = this.height / 2 + 90;
        attack2Up.interactive = true;
        attack2Up.buttonMode = true;
        attack2Up.on('pointerdown', () => this.upgradeSkill('attack2'));

        const attack3 = new PIXI.Text({
            text: "Attack 3", style: {
                fontFamily: "Arial",
                fontSize: 28,
                fill: "#0720fa",
                align: "center"
            }
        });
        attack3.anchor.set(0.5);
        attack3.x = this.width / 2 - 30;
        attack3.y = this.height / 2 + 130;

        const attack3Level = new PIXI.Text({
            text: `${this.skills.attack2}`, style: {
                fontFamily: "Arial",
                fontSize: 28,
                fill: "#0720fa",
                align: "center"
            }
        });
        attack3Level.anchor.set(0.5);
        attack3Level.x = this.width / 2 + 50;
        attack3Level.y = this.height / 2 + 130;

        const attack3Up = new PIXI.Text({
            text: `+`, style: {
                fontFamily: "Arial",
                fontSize: 28,
                fill: "#0720fa",
                align: "center"
            }
        });
        attack3Up.anchor.set(0.5);
        attack3Up.x = this.width / 2 + 80;
        attack3Up.y = this.height / 2 + 130;
        attack3Up.interactive = true;
        attack3Up.buttonMode = true;
        attack3Up.on('pointerdown', () => this.upgradeSkill('attack3'));

        this.levelUpMenu.addChild(levelUpText);
        this.levelUpMenu.addChild(basicAttack);
        this.levelUpMenu.addChild(basicAttackLevel);
        if (this.skills.basic < 3) this.levelUpMenu.addChild(basicAttackUp);
        this.levelUpMenu.addChild(attack1);
        this.levelUpMenu.addChild(attack1Level);
        if (this.skills.attack1 < 3) this.levelUpMenu.addChild(attack1Up);
        this.levelUpMenu.addChild(attack2);
        this.levelUpMenu.addChild(attack2Level);
        if (this.skills.attack2 < 3) this.levelUpMenu.addChild(attack2Up);
        this.levelUpMenu.addChild(attack3);
        this.levelUpMenu.addChild(attack3Level);
        if (this.skills.attack3 < 3) this.levelUpMenu.addChild(attack3Up);

        this.app.stage.addChild(this.levelUpMenu);

    }

    upgradeSkill(skill) {
        if (this.skills[skill] < 3) { // Verifica que la habilidad no esté en el máximo nivel 
            this.skills[skill]++;
            console.log(`Habilidad ${skill} mejorada a nivel ${this.skills[skill]}`);
        }
        this.app.stage.removeChild(this.levelUpMenu);
        this.app.ticker.start();
    }

    showGameOverMenu() {
        this.buildGameOverMenu();
    }

    gameOver() {
        this.app.ticker.stop();
        this.isGameOver = true;
        this.showGameOverMenu();
    }

    removePlayer() {
        this.mainContainer.removeChild(this.player);
        this.player.sprite.stop()
        this.player.destruction();
    }

    removeNightmares() {
        for (let nightmare of this.nightmares) {
            this.mainContainer.removeChild(nightmare);
            //nightmare.sprite.stop()
            nightmare.destruction();
        }
        this.nightmares = [];
    }

    placeNightmares(numerNightmares = 10) {
        for (let i = 0; i <= numerNightmares; i++) {
            let nightMare = new Nightmare(Math.random() * this.backgroundSize.x, Math.random() * this.backgroundSize.y, this,this.nightmareLife);
            this.nightmares.push(nightMare);
        }
        this.nightmareLife *= 1.2;
        this.restantNightmare += numerNightmares;
    }

    checkWave(){
        
        if(this.nightmares.length <= 0){
            this.placeNightmares(70);
        }
    }

    pause() {
        if (!this.isPaused) {
            this.app.ticker.stop();
            this.isPaused = true;
        } else {
            this.app.ticker.start();
            this.isPaused = false;
        }
    }

    
}
class UIManager {
    constructor(game) {
        this.game = game;
        this.scaleFactor = this.game.isMobile ? 0.6 : 1;
        this.buildPauseMenu();
    }

    createMainMenu() {

        document.fonts.ready.then(() => {
            // Título del juego
            const gameTitle = document.createElement("p");
            gameTitle.textContent = "LA PESADILLA DEL SEÑOR BIGOTES";
            gameTitle.style.fontFamily = "PixelTerror, Arial, sans-serif";
            gameTitle.style.position = "absolute";
            gameTitle.style.top = `${25 * this.scaleFactor}%`;
            gameTitle.style.left = "50%";
            gameTitle.style.transform = "translate(-50%, -50%)";
            gameTitle.style.padding = "0";
            gameTitle.style.margin = "0";
            gameTitle.style.whiteSpace = "nowrap";
            gameTitle.style.fontSize = `${35 * this.scaleFactor}px`;
            gameTitle.style.color = "#ff0000";
            gameTitle.style.textAlign = "center";
            document.body.appendChild(gameTitle);

            // Botón de inicio
            const startButton = document.createElement("button");
            startButton.textContent = "Start Game";
            startButton.style.position = "absolute";
            startButton.style.top = `${90 * this.scaleFactor}%`;
            startButton.style.left = "50%";
            startButton.style.transform = "translate(-50%, -50%)";
            startButton.style.padding = `${15 * this.scaleFactor}px ${30 * this.scaleFactor}px`;
            startButton.style.fontSize = `${20 * this.scaleFactor}px`;
            startButton.style.fontFamily = "Arial, sans-serif";
            startButton.style.backgroundColor = "#FF5733";
            startButton.style.color = "#FFFFFF";
            startButton.style.border = "none";
            startButton.style.cursor = "pointer";
            startButton.style.borderRadius = `${10 * this.scaleFactor}px`;
            document.body.appendChild(startButton);

            const textLore = document.createElement("p");
            textLore.textContent = "Ayuda al señor Bigotes a enfrentar a sus pesadillas.";
            textLore.style.fontFamily = "Arial, sans-serif";
            textLore.style.position = "fixed";
            textLore.style.top = `${40 * this.scaleFactor}%`;
            textLore.style.left = "50%";
            textLore.style.transform = "translate(-50%, -50%)";
            textLore.style.padding = "0";
            textLore.style.margin = "0";
            textLore.style.whiteSpace = "nowrap";
            textLore.style.fontSize = `${20 * this.scaleFactor}px`;
            textLore.style.color = "#ff0000";
            textLore.style.textAlign = "center";
            document.body.appendChild(textLore);

            // Instrucciones (sección separada)
            const instructions = document.createElement("div");
            instructions.style.fontFamily = "Arial, sans-serif";
            instructions.style.position = "fixed";
            instructions.style.top = `${65 * this.scaleFactor}%`;
            instructions.style.left = "50%";
            instructions.style.transform = "translate(-50%, -50%)";
            instructions.style.padding = "10px";
            instructions.style.margin = "0";
            instructions.style.width = `${80 * this.scaleFactor}%`;
            instructions.style.fontSize = `${25 * this.scaleFactor}px`;
            instructions.style.color = "#cdcfcc";
            instructions.style.textAlign = "center";
            instructions.innerHTML = `
            <p>Utiliza <b>WASD</b> para mover al Señor Bigotes.</p>
            <p>Si la vida del Señor Bigotes es muy baja, busca el pollo que aparece en cada oleada.</p>`;
            document.body.appendChild(instructions);

            // Evento del botón
            startButton.addEventListener("click", () => {
                // Reproducir música de fondo
                this.game.backgroundMusic
                    .play()
                    .then(() => {
                        console.log("Música de fondo iniciada");
                    })
                    .catch((error) => {
                        console.error("Error al reproducir música:", error);
                    });

                // Eliminar elementos del menú
                document.body.removeChild(startButton);
                document.body.removeChild(gameTitle);
                document.body.removeChild(textLore);
                document.body.removeChild(instructions);
                this.game.startGame();
            });
        });
    }

    createGameplayUI() {
        this.uiContainer = new PIXI.Container();
        this.uiContainer.name = "UIContainer"
        this.pointsText = new PIXI.Text({
            text: `Puntos: ${this.game.points}`, style: {
                fontFamily: "Arial",
                fontSize: 28 * this.scaleFactor,
                fill: "#cdcfcc",
                align: "center"
            }
        });
        this.pointsText.anchor.set(0.5);
        this.pointsText.x = 70;
        this.pointsText.y = 15;

        this.uiContainer.addChild(this.pointsText)

        this.waveText = new PIXI.Text({
            text: `Oleada: ${this.game.numberWave}`, style: {
                fontFamily: "Arial",
                fontSize: 28 * this.scaleFactor,
                fill: "#cdcfcc",
                align: "center"
            }
        });
        this.waveText.anchor.set(0.5);
        this.waveText.x = this.game.width / 2;
        this.waveText.y = 15;

        this.uiContainer.addChild(this.waveText)

        this.restantNightmareText = new PIXI.Text({
            text: `pesadillas en el sueño: ${this.game.restantNightmare}`, style: {
                fontFamily: "Arial",
                fontSize: 28 * this.scaleFactor,
                fill: "#cdcfcc",
                align: "center"
            }
        });
        this.restantNightmareText.anchor.set(0.5);
        this.restantNightmareText.x = this.game.width / 2;
        this.restantNightmareText.y = 0 + 50;


        this.uiContainer.addChild(this.restantNightmareText);

        this.pauseIndication = new PIXI.Text({
            text: `Esc para pausar`, style: {
                fontFamily: "Arial",
                fontSize: 28 * this.scaleFactor,
                fill: "#cdcfcc",
                align: "center"
            }
        });
        this.pauseIndication.anchor.set(0.5);
        this.pauseIndication.x = 110;
        this.pauseIndication.y = this.game.height - 50;

        this.uiContainer.addChild(this.pauseIndication);
        this.game.app.stage.addChild(this.uiContainer);
    }

    refreshUI() {
        this.pointsText.text = `Puntos: ${this.game.points}`;
        this.waveText.text = `Oleada: ${this.game.numberWave}`;
        this.restantNightmareText.text = `pesadillas en el sueño: ${this.game.restantNightmare}`;
    }

    miniMap() {
        // Crear contenedor para el mini mapa
        this.miniMapContainer = new PIXI.Container();
        this.miniMapContainer.x = this.game.width - 200;  // Posición del mini mapa
        this.miniMapContainer.y = this.game.height - 200;
        this.mapWidth = this.game.width;
        this.mapHeight = this.game.height;
        this.miniMapContainer.scale.set(0.2 * this.scaleFactor); // Escala del mini mapa
        this.game.app.stage.addChild(this.miniMapContainer);

        // Crear un fondo de mini mapa
        this.miniMapBackground = new PIXI.Graphics();
        this.miniMapBackground.beginFill(0xCCCCCC);
        this.miniMapBackground.drawRect(0, 0, 720 * this.scaleFactor, 480 * this.scaleFactor);
        this.miniMapBackground.endFill();
        this.miniMapContainer.addChild(this.miniMapBackground);

        this.miniMapIcons = new PIXI.Container();
        this.miniMapContainer.addChild(this.miniMapIcons);

        // Crear contenedor para el jugador
        this.playerIcon = new PIXI.Graphics();
        this.playerIcon.beginFill(0x0000FF);
        this.playerIcon.drawCircle(0, 0, 10);
        this.playerIcon.endFill();
        this.miniMapIcons.addChild(this.playerIcon);

        // movimiento del jugador
        this.playerX = 0;
        this.playerY = 0;
    }

    // Actualiza el mini mapa
    updateMiniMap(player, nightmares, healths) {
        const scale = 0.22 * this.scaleFactor;

        if (player.x > player.game.backgroundSize.x / 2) {
            this.miniMapContainer.x = 50 * (this.game.isMobile ? 0.2 : 1)
        } else {
            this.miniMapContainer.x = this.game.width - 200 * (this.game.isMobile ? 0.7 : 1);
        }
        // Actualizar la posición del jugador en el mini mapa
        this.playerIcon.x = player.x * scale;
        this.playerIcon.y = player.y * scale;

        // Dibujar los enemigos en el mini mapa
        this.miniMapIcons.removeChildren();
        this.miniMapIcons.addChild(this.playerIcon); // Volver a añadir el icono del jugador

        nightmares.forEach(enemy => {
            let enemyIcon = new PIXI.Graphics();
            if (enemy.isNightmare) {
                enemyIcon.beginFill(0xFF0000);
                enemyIcon.drawCircle(0, 0, 10);  // Enemigos representados por círculos pequeños
                enemyIcon.endFill();

            } else {
                enemyIcon.beginFill(0xe9f30a);
                enemyIcon.drawCircle(0, 0, 10);  // Enemigos representados por círculos pequeños
                enemyIcon.endFill();

            }
            enemyIcon.x = enemy.x * scale;
            enemyIcon.y = enemy.y * scale;
            this.miniMapIcons.addChild(enemyIcon);
        });

        // Dibujar los items de cura en el mini mapa
        healths.forEach(healthItem => {
            let healthIcon = new PIXI.Graphics();
            healthIcon.beginFill(0x00FF00);
            healthIcon.drawCircle(0, 0, 10);  // Items de cura representados por círculos
            healthIcon.endFill();
            healthIcon.x = healthItem.x * scale;
            healthIcon.y = healthItem.y * scale;
            this.miniMapIcons.addChild(healthIcon);
        });
    }

    buildlevelUpMenu() {
        this.game.app.ticker.stop();
        this.levelUpMenu = new PIXI.Graphics();
        this.levelUpMenu.clear();
        this.levelUpMenu.beginFill("0x000000", 0.7);
        this.levelUpMenu.drawRect(0, 0, this.game.width, this.game.height);
        this.levelUpMenu.endFill()

        const levelUpText = new PIXI.Text({
            text: "Level up", style: {
                fontFamily: "Arial",
                fontSize: 64 * this.scaleFactor,
                fill: "5bde00",
                align: "center"
            }
        });
        levelUpText.anchor.set(0.5);
        levelUpText.x = this.game.width / 2;
        levelUpText.y = 50;

        const scratchImage = new PIXI.Sprite(attacksSprite["zarpaso"]);
        scratchImage.width =  scratchImage.width * this.scaleFactor;
        scratchImage.height = scratchImage.height * this.scaleFactor;
        scratchImage.anchor.set(0.5, 0.5);
        scratchImage.x = this.game.width * 0.23;
        scratchImage.y = this.game.height * 0.24;

        const basicAttack = new PIXI.Text({
            text: "Arañazo", style: {
                fontFamily: "Arial",
                fontSize: 28 * this.scaleFactor,
                fill: "#cdcfcc",
                align: "center"
            }
        });
        basicAttack.anchor.set(0.5);
        basicAttack.x = scratchImage.x;
        basicAttack.y = 270;

        const basicAttackLevel = new PIXI.Text({
            text: `${this.game.skills.basic}`, style: {
                fontFamily: "Arial",
                fontSize: 28 * this.scaleFactor,
                fill: "#ffe806",
                align: "center"
            }
        });
        basicAttackLevel.anchor.set(0.5);
        basicAttackLevel.x = scratchImage.x;
        basicAttackLevel.y = 310;

        const basicAttackUp = new PIXI.Text({
            text: `+`, style: {
                fontFamily: "Arial",
                fontSize: 30 * this.scaleFactor,
                fill: "5bde00",
                align: "center"
            }
        });
        basicAttackUp.anchor.set(0.5);
        basicAttackUp.x = scratchImage.x;
        basicAttackUp.y = 350;
        basicAttackUp.interactive = true;
        basicAttackUp.buttonMode = true;
        basicAttackUp.on('pointerdown', () => this.game.upgradeSkill('basic'));

        const attack1Image = new PIXI.Sprite(attacksSprite["pescadazo"]);
        attack1Image.anchor.set(0.5, 0.5);
        attack1Image.x = this.game.width * 0.53;
        attack1Image.y = this.game.height * 0.24;
        attack1Image.width = 100 * this.scaleFactor;
        attack1Image.height = 100 * this.scaleFactor;

        const attack1 = new PIXI.Text({
            text: "Pescadazo", style: {
                fontFamily: "Arial",
                fontSize: 28 * this.scaleFactor,
                fill: "#cdcfcc",
                align: "center"
            }
        });
        attack1.anchor.set(0.5);
        attack1.x = attack1Image.x;
        attack1.y = 270;

        const attack1Level = new PIXI.Text({
            text: `${this.game.skills.attack1}`, style: {
                fontFamily: "Arial",
                fontSize: 28 * this.scaleFactor,
                fill: "#ffe806",
                align: "center"
            }
        });
        attack1Level.anchor.set(0.5);
        attack1Level.x = attack1Image.x;
        attack1Level.y = 310;

        const attack1Up = new PIXI.Text({
            text: "+", style: {
                fontFamily: "Arial",
                fontSize: 30 * this.scaleFactor,
                fill: "5bde00",
                align: "center"
            }
        });
        attack1Up.anchor.set(0.5);
        attack1Up.x = attack1Image.x;
        attack1Up.y = 350;
        attack1Up.interactive = true;
        attack1Up.buttonMode = true;
        attack1Up.on('pointerdown', () => this.game.upgradeSkill('attack1'));

        const attack2Image = new PIXI.Sprite(attacksSprite["piedritas"]);
        attack2Image.anchor.set(0.5, 0.5);
        attack2Image.x = this.game.width * 0.81;
        attack2Image.y = this.game.height * 0.24;
        attack2Image.width = 120 * this.scaleFactor;
        attack2Image.height = 120 * this.scaleFactor;

        const attack2 = new PIXI.Text({
            text: "Piedritas", style: {
                fontFamily: "Arial",
                fontSize: 28 * this.scaleFactor,
                fill: "#cdcfcc",
                align: "center"
            }
        });
        attack2.anchor.set(0.5);
        attack2.x = attack2Image.x;
        attack2.y = 270;

        const attack2Level = new PIXI.Text({
            text: `${this.game.skills.attack2}`, style: {
                fontFamily: "Arial",
                fontSize: 28 * this.scaleFactor,
                fill: "#ffe806",
                align: "center"
            }
        });
        attack2Level.anchor.set(0.5);
        attack2Level.x = attack2Image.x;
        attack2Level.y = 310;

        const attack2Up = new PIXI.Text({
            text: `+`, style: {
                fontFamily: "Arial",
                fontSize: 30 * this.scaleFactor,
                fill: "5bde00",
                align: "center"
            }
        });
        attack2Up.anchor.set(0.5);
        attack2Up.x = attack2Image.x;
        attack2Up.y = 350;
        attack2Up.interactive = true;
        attack2Up.buttonMode = true;
        attack2Up.on('pointerdown', () => this.game.upgradeSkill('attack2'));


        this.levelUpMenu.addChild(levelUpText);
        this.levelUpMenu.addChild(scratchImage);
        this.levelUpMenu.addChild(basicAttack);
        this.levelUpMenu.addChild(basicAttackLevel);
        if (this.game.skills.basic < 3) this.levelUpMenu.addChild(basicAttackUp);
        this.levelUpMenu.addChild(attack1);
        this.levelUpMenu.addChild(attack1Level);
        this.levelUpMenu.addChild(attack1Image);
        if (this.game.skills.attack1 < 3) this.levelUpMenu.addChild(attack1Up);
        this.levelUpMenu.addChild(attack2);
        this.levelUpMenu.addChild(attack2Level);
        this.levelUpMenu.addChild(attack2Image);
        if (this.game.skills.attack2 < 3) this.levelUpMenu.addChild(attack2Up);

        this.game.app.stage.addChild(this.levelUpMenu);
    }


    buildGameOverMenu() {
        this.gameOverMenu = new PIXI.Graphics();
        this.gameOverMenu.clear();
        this.gameOverMenu.beginFill("#000000", 1);
        this.gameOverMenu.drawRect(0, 0, this.width, this.height);
        this.gameOverMenu.endFill();

        const gameOverText = new PIXI.Text({
            text: "GAME OVER", style: {
                fontFamily: "PixelTerror,Arial",
                fontSize: 120 * this.scaleFactor,
                fill: "#ff0000",
                align: "center"
            }
        });
        gameOverText.anchor.set(0.5);
        gameOverText.x = this.game.width / 2 * (this.game.isMobile ? 0.9 : 1);
        gameOverText.y = 100;

        const finalPoints = new PIXI.Text({
            text: `Puntaje Final: ${this.game.points}`, style: {
                fontFamily: "Arial",
                fontSize: 28 * this.scaleFactor,
                fill: "#cdcfcc",
                align: "center"
            }
        });
        finalPoints.anchor.set(0.5);
        finalPoints.x = this.game.width / 2;
        finalPoints.y = this.game.height / 2;


        // Estilo para el botón de reinicio
        const restartStyle = new PIXI.TextStyle({
            fontSize: 28 * this.scaleFactor,
            fill: "#cdcfcc" // Color verde para "Restart"
        });

        const restartText = new PIXI.Text(`F5 para reiniciar`, restartStyle);
        restartText.anchor.set(0.5);
        restartText.x = this.game.width / 2;
        restartText.y = this.game.height / 2 + 100;

        // Agregar los textos después del fondo, al mismo contenedor
        this.gameOverMenu.addChild(finalPoints)
        this.gameOverMenu.addChild(gameOverText);
        this.gameOverMenu.addChild(restartText);

        // Finalmente, agregar el menú al stage
        this.game.app.stage.addChild(this.gameOverMenu);
    }

    buildPauseMenu() {
        this.pauseMenu = new PIXI.Graphics()
        this.pauseMenu.beginFill("0x000000", 1);
        this.pauseMenu.drawRect(0, 0, this.game.width, this.game.height);
        this.pauseMenu.endFill();


        const pauseText = new PIXI.Text({
            text: `Pausa`, style: {
                fontFamily: "Arial",
                fontSize: 100 * this.scaleFactor,
                fill: "5bde00",
                align: "center"
            }
        });
        pauseText.anchor.set(0.5);
        pauseText.x = (this.game.width / 2) * (this.game.isMobile ? 0.9 : 1);
        pauseText.y = this.game.height / 2;

        this.pauseMenu.addChild(pauseText);
    }
}
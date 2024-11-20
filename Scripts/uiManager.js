class UIManager {
    constructor(game) {
        this.game = game;
    }

    createMainMenu() {
        document.fonts.ready.then(() => {
            const gameTitle = document.createElement("p")
            gameTitle.textContent = "LA PESADILLA DEL SEÑOR BIGOTES";
            gameTitle.style.fontFamily = "PixelTerror, Arial, sans-serif";
            gameTitle.style.position = "absolute";
            gameTitle.style.top = "25%";
            gameTitle.style.left = "50%";
            gameTitle.style.transform = "translate(-50%, -50%)";
            gameTitle.style.padding = "0";
            gameTitle.style.margin = "0";
            gameTitle.style.whiteSpace = "nowrap";
            gameTitle.style.fontSize = "64px";
            gameTitle.style.color = "#ff0000";
            gameTitle.style.textAlign = "center";
            document.body.appendChild(gameTitle);


            const startButton = document.createElement('button');
            startButton.textContent = "Start Game";
            startButton.style.position = "absolute";
            startButton.style.top = "90%";
            startButton.style.left = "50%";
            startButton.style.transform = "translate(-50%, -50%)";
            startButton.style.padding = "15px 30px";
            startButton.style.fontSize = "20px";
            startButton.style.fontFamily = "Arial, sans-serif"
            startButton.style.backgroundColor = "#FF5733";
            startButton.style.color = "#FFFFFF";
            startButton.style.border = "none";
            startButton.style.cursor = "pointer";
            startButton.style.borderRadius = "10px";
            document.body.appendChild(startButton);

            const textLore = `Ayuda al señor Bigotes a enfrentar a sus pesadillas. <br><br> <span style="color: #cdcfcc;">Para eso utiliza WASD para moverlo y deja que él se encargue de golpearlas.</span>
                                <br> <span style="color: #cdcfcc;x";>Si la vida del señor bigotes es muy baja,<br>busca el pollo que aparece en cada oleada</span>`;
            const loreText = document.createElement("p")
            loreText.innerHTML = textLore;
            loreText.style.fontFamily = "Arial, sans-serif";
            loreText.style.position = "fixed";
            loreText.style.top = "55%";
            loreText.style.left = "50%";
            loreText.style.transform = "translate(-50%, -50%)";
            loreText.style.padding = "0";
            loreText.style.margin = "0";
            loreText.style.whiteSpace = "nowrap";
            loreText.style.fontSize = "35px";
            loreText.style.color = "#ff0000";
            loreText.style.textAlign = "center";
            document.body.appendChild(loreText);

            startButton.addEventListener('click', () => {
                // Reproducir música de fondo
                this.game.backgroundMusic.play().then(() => {
                    console.log("Música de fondo iniciada");
                }).catch(error => {
                    console.error("Error al reproducir música:", error);
                });

                // Eliminar botón y empezar el juego
                document.body.removeChild(startButton);
                document.body.removeChild(gameTitle);
                document.body.removeChild(loreText);
                this.game.startGame();
            });

        })
    }

    createGameplayUI() {
        this.uiContainer = new PIXI.Container();
        this.uiContainer.name = "UIContainer"
        this.pointsText = new PIXI.Text({
            text: `Puntos: ${this.game.points}`, style: {
                fontFamily: "Arial",
                fontSize: 28,
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
                fontSize: 28,
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
                fontSize: 28,
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
                fontSize: 28,
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
        this.miniMapContainer.scale.set(0.2); // Escala del mini mapa
        this.game.app.stage.addChild(this.miniMapContainer);

        // Crear un fondo de mini mapa
        this.miniMapBackground = new PIXI.Graphics();
        this.miniMapBackground.beginFill(0xCCCCCC);
        this.miniMapBackground.drawRect(0, 0, 720, 480);
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
        const scale = 0.22;
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

            }else{
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
                fontSize: 64,
                fill: "5bde00",
                align: "center"
            }
        });
        levelUpText.anchor.set(0.5);
        levelUpText.x = this.game.width / 2;
        levelUpText.y = 50;

        const basicAttack = new PIXI.Text({
            text: "Arañazo", style: {
                fontFamily: "Arial",
                fontSize: 28,
                fill: "#cdcfcc",
                align: "center"
            }
        });
        basicAttack.anchor.set(0.5);
        basicAttack.x = this.game.width / 2 - 30;
        basicAttack.y = this.game.height / 2 + 10;

        const basicAttackLevel = new PIXI.Text({
            text: `${this.game.skills.basic}`, style: {
                fontFamily: "Arial",
                fontSize: 28,
                fill: "#ffe806",
                align: "center"
            }
        });
        basicAttackLevel.anchor.set(0.5);
        basicAttackLevel.x = this.game.width / 2 + 60;
        basicAttackLevel.y = this.game.height / 2 + 10;

        const basicAttackUp = new PIXI.Text({
            text: `+`, style: {
                fontFamily: "Arial",
                fontSize: 30,
                fill: "5bde00",
                align: "center"
            }
        });
        basicAttackUp.anchor.set(0.5);
        basicAttackUp.x = this.game.width / 2 + 100;
        basicAttackUp.y = this.game.height / 2 + 10;
        basicAttackUp.interactive = true;
        basicAttackUp.buttonMode = true;
        basicAttackUp.on('pointerdown', () => this.game.upgradeSkill('basic'));

        const attack1 = new PIXI.Text({
            text: "Pescadazo", style: {
                fontFamily: "Arial",
                fontSize: 28,
                fill: "#cdcfcc",
                align: "center"
            }
        });
        attack1.anchor.set(0.5);
        attack1.x = this.game.width / 2 - 30;
        attack1.y = this.game.height / 2 + 50;

        const attack1Level = new PIXI.Text({
            text: `${this.game.skills.attack1}`, style: {
                fontFamily: "Arial",
                fontSize: 28,
                fill: "#ffe806",
                align: "center"
            }
        });
        attack1Level.anchor.set(0.5);
        attack1Level.x = this.game.width / 2 + 60;
        attack1Level.y = this.game.height / 2 + 50;

        const attack1Up = new PIXI.Text({
            text: "+", style: {
                fontFamily: "Arial",
                fontSize: 30,
                fill: "5bde00",
                align: "center"
            }
        });
        attack1Up.anchor.set(0.5);
        attack1Up.x = this.game.width / 2 + 100;
        attack1Up.y = this.game.height / 2 + 50;
        attack1Up.interactive = true;
        attack1Up.buttonMode = true;
        attack1Up.on('pointerdown', () => this.game.upgradeSkill('attack1'));

        const attack2 = new PIXI.Text({
            text: "Piedritas", style: {
                fontFamily: "Arial",
                fontSize: 28,
                fill: "#cdcfcc",
                align: "center"
            }
        });
        attack2.anchor.set(0.5);
        attack2.x = this.game.width / 2 - 30;
        attack2.y = this.game.height / 2 + 90;

        const attack2Level = new PIXI.Text({
            text: `${this.game.skills.attack2}`, style: {
                fontFamily: "Arial",
                fontSize: 28,
                fill: "#ffe806",
                align: "center"
            }
        });
        attack2Level.anchor.set(0.5);
        attack2Level.x = this.game.width / 2 + 60;
        attack2Level.y = this.game.height / 2 + 90;

        const attack2Up = new PIXI.Text({
            text: `+`, style: {
                fontFamily: "Arial",
                fontSize: 30,
                fill: "5bde00",
                align: "center"
            }
        });
        attack2Up.anchor.set(0.5);
        attack2Up.x = this.game.width / 2 + 100;
        attack2Up.y = this.game.height / 2 + 90;
        attack2Up.interactive = true;
        attack2Up.buttonMode = true;
        attack2Up.on('pointerdown', () => this.game.upgradeSkill('attack2'));


        this.levelUpMenu.addChild(levelUpText);
        this.levelUpMenu.addChild(basicAttack);
        this.levelUpMenu.addChild(basicAttackLevel);
        if (this.game.skills.basic < 3) this.levelUpMenu.addChild(basicAttackUp);
        this.levelUpMenu.addChild(attack1);
        this.levelUpMenu.addChild(attack1Level);
        if (this.game.skills.attack1 < 3) this.levelUpMenu.addChild(attack1Up);
        this.levelUpMenu.addChild(attack2);
        this.levelUpMenu.addChild(attack2Level);
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
                fontSize: 120,
                fill: "#ff0000",
                align: "center"
            }
        });
        gameOverText.anchor.set(0.5);
        gameOverText.x = this.game.width / 2;
        gameOverText.y = 100;

        const finalPoints = new PIXI.Text({
            text: `Puntaje Final: ${this.game.points}`, style: {
                fontFamily: "Arial",
                fontSize: 28,
                fill: "#cdcfcc",
                align: "center"
            }
        });
        finalPoints.anchor.set(0.5);
        finalPoints.x = this.game.width / 2;
        finalPoints.y = this.game.height / 2;


        // Estilo para el botón de reinicio
        const restartStyle = new PIXI.TextStyle({
            fontSize: 28,
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
}
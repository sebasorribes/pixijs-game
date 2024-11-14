class Attack {
    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.game = game;
        this.active = true;

        this.container = new PIXI.Container();
        this.container.name = "mainContainer"
        this.innerContainer = new PIXI.Container();
        this.innerContainer.name = "innerContainer"
        this.container.addChild(this.innerContainer);


        this.lastExecutionTime = 0; // Última vez que se ejecutó

        this.game.mainContainer.addChild(this.container);
    }

    // Método básico de ejecución
    execute() {
        if (!this.active) return;

        const currentTime = Date.now();
        if (currentTime - this.lastExecutionTime >= this.interval) {
            this.performAttack();
            this.lastExecutionTime = currentTime; // Actualiza el tiempo de la última ejecución
        }
    }

    // Método para verificar colisiones (en este ejemplo, solo verifica si el ataque toca enemigos)
    checkCollision(enemies) {
        if (!this.active) return;
        enemies.forEach(enemy => {
            //falta el heigth y width
            if (
                isOverlap( 
                    { ...this, y: this.y, x: this.x },
                    enemy
                )
            ) {
                this.hit(enemy);
            }
        });
    }

    // Método para el impacto
    hit(enemy) {
        enemy.takeDamage(this.damage);
    }

    // Método para determinar si hay colisión (a implementar en cada tipo de ataque)
    isColliding(enemy) {
        // Implementar lógica específica de colisión en cada subclase
        return false;
    }

    // Método para destruir el ataque
    destroy() {
        this.active = false;
        console.log("Ataque destruido");
    }
}

class BasicSlashAttack extends Attack {
    constructor(x, y, damage, game, direction) {
        super(x, y, damage, game);
        this.direction = direction; // Dirección del corte
        this.speed = 10; // Velocidad del corte

        this.interval = 5; // Tiempo entre ataques
    }


    performAttack() {
        this.x += this.speed * this.direction;
        this.checkCollision(this.game.enemies);
    }

    update() {

    }

    isColliding(enemy) {
        // Lógica de colisión sencilla
        return Math.abs(this.x - enemy.x) < 10 && Math.abs(this.y - enemy.y) < 10;
    }

}

class BasicSlashAttack extends Attack {
    constructor(x, y, damage, game, direction) {
        super(x, y, damage, game);
        this.direction = direction;
        this.speed = 10;
    }

    makeGraf() {
        this.grafico = new PIXI.Graphics()
            .rect(0, 0, this.width, this.height)
            .fill(0xffd700);
        this.container.addChild(this.grafico);
    }

    execute() {
        if (!this.active) return;
        this.x += this.speed * this.direction;
        this.checkCollision(this.game.enemies);
        this.destroy(); // Desactivar después de un solo uso
    }

    isColliding(enemy) {
        return Math.abs(this.x - enemy.x) < 10 && Math.abs(this.y - enemy.y) < 10;
    }
}
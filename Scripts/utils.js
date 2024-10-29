function limitMagnitude(vector, maxMagnitude) {
    // Calcular la magnitud actual del vector
    const currentMagnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);

    // Si la magnitud actual es mayor que la máxima permitida, limitar el vector
    if (currentMagnitude > maxMagnitude) {
        const scale = maxMagnitude / currentMagnitude;
        vector.x *= scale;
        vector.y *= scale;
    }

    return vector;
}

function generateRandomID(length = 8) {
    // Conjunto de caracteres alfanuméricos (mayúsculas, minúsculas y dígitos)
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    // Genera un ID al azar
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }

    return result;
}

function distance(obj1, obj2) {
    return Math.sqrt((obj1.x - obj2.x) ** 2 + (obj1.y - obj2.y) ** 2);
}

function normalizeVector(vector) {
    // Calcula la magnitud del vector
    const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);

    // Si la magnitud es 0, devuelve el vector original (o maneja el caso de magnitud cero de otra manera)
    if (magnitude === 0) {
        return vector;
    }

    // Divide cada componente del vector por la magnitud
    return {
        x: vector.x / magnitude,
        y: vector.y / magnitude,
    };
}

function isOverlap(rect1, rect2) {
    const { x: x1, y: y1, width: w1, height: h1 } = rect1;
    const { x: x2, y: y2, width: w2, height: h2 } = rect2;

    const rect1Left = x1 - w1 / 2;
    const rect1Right = x1 + w1 / 2;
    const rect1Top = y1;
    const rect1Bottom = y1 + h1;

    const rect2Left = x2 - w2 / 2;
    const rect2Right = x2 + w2 / 2;
    const rect2Top = y2;
    const rect2Bottom = y2 + h2;

    const isOverlapping = rect1Left < rect2Right &&
        rect1Right > rect2Left &&
        rect1Top < rect2Bottom &&
        rect1Bottom > rect2Top;

    return isOverlapping;
}
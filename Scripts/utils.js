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
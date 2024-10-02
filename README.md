# pixijs-game
Nombre: Pesadilla de Bigotes

Categoría/género: Inverse bullet hell, roguelike, oleadas

Inspiración: Vampire Survivors, League of Legends: Modo horda, Survivor.io

Assets:  
Personaje: Gato
Enemigo: Perros
Obstáculos: piedras, árboles, casita de perro, arbusto
Sonido ambiente 
Conejitos (perro derrotado)
Arañazo
Pescado
Piedritas sanitarias
Ovillo de lana
Suelo
Item de vida
Barra de vida personaje

Mecánicas: moverse por el mapa, recibir daño, disparar/pegar en dirección al cursor, utilizar armas, ganar experiencia, recuperar vida.

Moverse por el mapa: cámara fija en el personaje, se mueve con él, al llegar al extremo del mapa aparece por el otro extremo.

Recibir daño: cuando colisionamos con el enemigo éste nos hace daño. Los enemigos reciben daño al impactar contra un ataque básico o arma. 

Disparar/pegar en dirección al cursor:  la habilidad básica se ejecuta en dirección al curso cada cierto tiempo. 

Armas(todas se utilizan automáticamente cada cierto tiempo): 
    Arañazo: ataque básico: realiza un golpe en la dirección en la que mira el personaje. 
             Su mejora realiza dos golpes, uno delante y otro detrás.
    Lanzar pescado(pescadazo):  lanza un pescado hacia arriba que luego cae golpeando a todos los enemigos. 
                                Su mejora lanza un segundo pescado. 
    Piedritas sanitarias: va dejando a su paso un rastro de piedritas sanitarias que le causan daño a sus   
                          enemigos. Mejora: aumenta el tiempo del rastro de piedritas. 
    Ovillo de lana: se lanza en una dirección aleatoria y al impactar con un enemigo u objeto, cambia su 
                    dirección. Mejora: permite atravesar enemigos. 

Ganar experiencia: al vencer a un enemigo éste nos otorga experiencia y esta experiencia nos permite subir de nivel y obtener nuevas armas y/o mejorarlas  (los perros NO mueren sino que son transformados en algo agradable para el gato) 

Recuperar vida: al colisionar con un ítem de vida en el mapa te curas. 

Mapa: se generan obstáculos de forma aleatoria y vidas de forma aleatoria.
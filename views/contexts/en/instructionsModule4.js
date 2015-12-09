module.exports = function(settings, headers) {

    var avalible=settings.standard.CANTIDAD,unit=settings.standard.UNIDAD_ESTANDAR, cantidadESUxPCH=settings.standard.CANTIDAD_ESU_x_PCH,cantidadPCH=settings.standard.CANTIDAD_DE_PCH;
    return {
        title: "InstructionsModule4",
        instructions: "Module 4",
        a:  "Este módulo consta de 10 rondas. Al principio del módulo los participantes serán asignados aleatoriamente a grupos de 4 participantes. En ningún momento conocerás la identidad de los otros miembros de tu grupo. La composición de los grupos se mantendrá fija a lo largo del módulo. En cada grupo, dos miembros serán Tipo G y los otros dos serán Tipo K. Todo participante tiene la misma posibilidad de ser designado tipo G o K.",
        b:  "Cada ronda durará un minuto, y en cada una se te pedirá que resuelvas sumas. Tus Ganancias Preliminares dependerán de cuántas de esas sumas seas capaz de resolver correctamente.  Si eres grupo Tipo G recibirás 200 ECUs por cada respuesta correcta, mientras que si eres tipo K recibirás 100 ECUs.",
        c:  "Al final de cada ronda, una vez que seas informado de tus Ganancias Preliminares, se te pedirá que declares estas ganancias. En este módulo el 10% de las Ganancias Declaradas se deducirá de tus Ganancias Preliminares. ",
        d:  "En cada ronda tus Ganancias Preliminares pueden ser comparadas con tus Ganancias Declaradas con una cierta probabilidad para comprobar que las dos cantidades corresponden. En este módulo esta probabilidad es 0%.",
        e:  "Si existen discrepancias entre tus Ganancias Preliminares  y Ganancias Declaradas se deducirá una cantidad extra de tus Ganancias Preliminares. En este módulo esta cantidad es del 50% de la diferencia entre las Ganancias Preliminares  y las Declaradas. Además, la deducción normal del 10% se aplicará a las Ganancias Preliminares  y no a la cantidad declarada.",
        f:  "Todas las deducciones aplicadas a los cuatro miembros del grupo se sumarán y serán distribuidas a partes iguales entre los miembros del grupo.",
        g:  "Tus ganancias serán calculadas y mostradas al final de cada ronda de la siguiente forma:",
        g1: "   Ganancia = Ganancias Preliminares – Deducciones de las Ganancias Declaradas – Deducciones por discrepancias en la declaración + Parte deducciones del grupo",
        h:  "Al final del módulo una ronda se seleccionará de manera aleatoria y tus ganancias en este módulo serán las de esa ronda con la tasa de cambio 300ECU = $500.-",
        i:  "Se te informará de tus ganancias en este módulo al final del experimento.",
        ifYouUnderstood: "Si haz entendido las instruciones haz click en Start Module 4 ",
        proceed: "Start Module 4"
    };
};

/**
 * Created by joseorellana on 02-12-15.
 */

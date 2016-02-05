module.exports = function(settings, headers) {

    var avalible=settings.standard.CANTIDAD,unit=settings.standard.UNIDAD_ESTANDAR, cantidadESUxPCH=settings.standard.CANTIDAD_ESU_x_PCH,cantidadPCH=settings.standard.CANTIDAD_DE_PCH;
    return {
        title: "InstructionsModule4",
        instructions: "Module 4",
        a:  "En este módulo tomarás 10 decisiones, pero solo una de ellas será usada al final para determinar tus ganancias. Cada una de las decisiones consiste en elegir entre \"Opción A\" u \"Opción B\". Una vez hayas tomado todas las decisiones el servidor seleccionará una de ellas de forma aleatoria. Luego una segunda selección aleatoria determinará cuales son tus ganancias para la opción que hayas elegido, A o B, en esa decisión. Aunque realizarás 10 decisiones, solo una de ellas será relevante para calcular tus ganancias, pero no sabrás de antemano cuál. Obviamente todas las decisiones tienen la misma probabilidad de ser elegidas.",
        b:  "El tipo de decisiones que vas a tomar es el siguiente: En la Decisión 1, Opción A paga $2.000 con probabilidad 10%, y paga $1.600 con probabilidad  90%. Opción B paga $3.850 con probabilidad 10%, y paga $100 con probabilidad 90%. El resto de decisiones son similares, con la única diferencia que la probabilidad de recibir el pago más alto en cada opción aumenta. De hecho, en la Decisión 10, la segunda selección aleatoria del servidor no será necesaria para calcular tus ganancias dado que las dos opciones pagan la cantidad más alta con probabilidad 100%, así que tu Decisión será entre $2.000 y $3.850.",
        c:  "Estas ganancias se añadirán a tus ganancias previas de anteriores módulos y te pagaremos en efectivo al final del experimento.",

        ifYouUnderstood: "Si haz entendido las instruciones haz click en Start Module 4 ",
        proceed: "Start Module 4"
    };
};



/**
 * Created by joseorellana on 02-12-15.
 */

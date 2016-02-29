module.exports = function(settings, headers) {

    var value=settings.standard.CANTIDAD,unidad=settings.standard.UNIDAD_ESTANDAR;
    return {
        title: "Modulo4",
        Module: "Cuestionario",
        text:" Un hogar es definido como una o más personas(no necesariamente familiares) que viven juntas. Y que comparten gastos como unidad respecto a alimentación y otras áreas. El ingreso Bruto del \"HOGAR\" es el ingreso total recibidos de todas las personas que lo componen, incluidos sueldos, salarios o rentas antes de las reducciones por impuesto.",
        text1:" Teniendo en cuenta lo anterior, ¿Cuál su ingreso bruto total?.",
        opcion1:" Menos de 122.300 pesos al mes",
        opcion2:" Entre 122.300 y 160.300 pesos al mes",
        opcion3:" Entre 160.001 y 184.750 pesos al mes",
        opcion4:" Entre 184.751 y 205.800 pesos al mes",
        opcion5:" Entre 205.801 y 230.500 pesos al mes",
        opcion6:" Entre 230.501 y 262.550 pesos al mes",
        opcion7:" Entre 262.551 y 293.050 pesos al mes",
        opcion8:" Entre 293.051 y 324.300 pesos al mes",
        opcion9:" Entre 324.301 y 363.950 pesos al mes",
        opcion10:" Entre 363.951 y 417.300 pesos al mes",
        opcion11:" Entre 417.301 y 475.350 pesos al mes",
        opcion12:" Entre 475.351 y 540.400 pesos al mes",
        opcion13:" Entre 540.401 y 641.900 pesos al mes",
        opcion14:" Entre 641.901 y 765.900 pesos al mes",
        opcion15:" Entre 765.901 y 936.000 pesos al mes",
        opcion16:" Más de $936.000 pesos al mes",
        opcion17:" Prefiero no responder",
        opcion18:" No lo sé",
        proceed:"Continuar",
        error:"Debe responder todas las preguntas antes de continuar.",
        errorClose: "Cerrar",
    };
};
/**
 * Created by joseorellana on 05-02-16.
 */

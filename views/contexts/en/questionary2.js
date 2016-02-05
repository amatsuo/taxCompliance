module.exports = function(settings, headers) {

    var value=settings.standard.CANTIDAD,unidad=settings.standard.UNIDAD_ESTANDAR;
    return {
        title: "Modulo4",
        Module: "Cuestionario",
        a:" Evadir pago transporte público:",
        b:" Mentir en las declaraciones de impuesto si se tiene la oportunidad:",
        c:" Conducir más rápido que el limite de velocidad permitido:",
        d:" Quedarse con dinero encontrado en la Calle:",
        e:" Mentir para seguir los propios intereses:",
        f:" No reportar un daño accidental a un auto después de provocarlo:",
        g:" Botar basura en un lugar público:",
        h:" Conducir bajo influencia del alcohol:",
        i:" Mentir en algunas cosas en una solicitud de trabajo:",
        j:" Comprar algo que sabes que fue robado:",
        opcion1:"Nunca se justifica",
        opcion2:"Raramente se justifica",
        opcion3:"Aveces se justifica",
        opcion4:"Siempre se justifica",

        proceed:"Continuar",
        error:"Debe responder todas las preguntas antes de continuar."

    };
};
/**
 * Created by joseorellana on 04-02-16.
 */

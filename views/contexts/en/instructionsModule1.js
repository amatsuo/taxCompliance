module.exports = function(settings, headers) {

var avalible=settings.standard.CANTIDAD,unit=settings.standard.UNIDAD_ESTANDAR, cantidadESUxPCH=settings.standard.CANTIDAD_ESU_x_PCH,cantidadPCH=settings.standard.CANTIDAD_DE_PCH;
    return {
        title: "InstructionsModule1",
        instructions: "Module 1",
        a: 'En este módulo la mitad de los participantes recibirá un asignación de dinero de '+avalible+' '+unit+' (grupo A), y la otra mitad no los recibirá (grupo B). La tasa de cambio es: '+cantidadESUxPCH+unit+' = $ '+cantidadPCH+'.-',
        b: "Cada participante que reciba la asignación de dinero (grupo A) será emparejado de manera aleatoria con otro participante que no lo haya recibido (grupo B). En ningún momento conocerás la identidad del participante con el que serás emparejado ni el/ella conocerá la tuya. El experimento es totalmente confidencial, dado que las identidades de los participante no serán reveladas en ningún momento.",
        c:"Sin embargo, antes de que se distribuyan las asignaciones de dinero y de que seas emparejado con otro participante, se te solicitará que distribuyas tu asignación entre la persona con la que serás emparejado y tú mismo como si ya hubieras recibido el dinero. ",
        d:"Tus ganancias en este módulo se calcularán de la siguiente forma",
        I:"Grupo A: Ganancia = Asignación – Cantidad Enviada",
        II:"Grupo B: Ganancia = Cantidad Recibido",
        e:"Se te informara de tus ganancias en este módulo al final del experimento.",
        ifYouUnderstood: "Si haz entendido las instruciones haz click en Iniciar Modulo 1 ",
        proceed: "Iniciar Modulo 1"
    };
};
/**
 * Created by joseorellana on 24-11-15.
 */

module.exports = function(settings, headers) {

var avalible = settings.standard.CANTIDAD,
    unit = settings.standard.UNIDAD_ESTANDAR, 
    cantidadESUxPCH = settings.standard.CANTIDAD_ESU_x_PCH,
    cantidadPCH = settings.standard.CANTIDAD_DE_PCH;
    return {
        title: "InstructionsModule1",
        instructions: "Module 1",
        a: 'In this module half of the participants will receive an Endowment of '+avalible+' '+unit+' (group A), and the other half will not (group B). The exchange rate is: '+cantidadESUxPCH+unit+' = $ '+cantidadPCH+'.-',
        b: "Each participant who receives an Endowment (group A) will be randomly paired with another person in this room who has not (group B). You will not know your partner's identity, nor will they know yours. Nor will these identities be revealed after the session is completed.",
        c:"However, before the endowments are distributed and the pairing takes place, you may allocate the endowment between yourself and the other person as you wish if you were to receive this Endowment. ",
        d:"Profits in this module will be calculated in the following way:",
        I:"Group A: Profits = Endowment – Amount Sent",
        II:"Group B: Profits = Amount Received",
        e:"You will be informed of your earnings for this module at the end of the experiment.",
        ifYouUnderstood: "If you understand the instructions, click \"Start Module 1\" ",
        proceed: "Start Module 1"
    };
};
/**
 * Created by joseorellana on 24-11-15.
 * Back translated by amatz on 15-02-16.
 */

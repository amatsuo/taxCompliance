module.exports = function(settings, headers) {

    var value=settings.standard.CANTIDAD,unidad=settings.standard.UNIDAD_ESTANDAR;
    return {
        title: "Modulo4",
        Module: "Questionnaire",
        text:" A household is defined as either one or more persons (not necessarily related) who live including wages, salaries, or rents and before tax deductions.",
        text1:" What is your gross household income?",
        opcion1:" Under $5,000 per year",
        opcion2:" $5,000 to $9,999 per year",
        opcion3:" $10,000 to $14,999 per year",
        opcion4:" $15,000 to $19,999 per year",
        opcion5:" $20,000 to $24,999 per year",
        opcion6:" $25,000 to $29,999 per year",
        opcion7:" $30,000 to $34,999 per year",
        opcion8:" $35,000 to $39,999 per year",
        opcion9:" $40,000 to $44,999 per year",
        opcion10:" $45,000 to $49,999 per year",
        opcion11:" $50,000 to $59,999 per year",
        opcion12:" $60,000 to $69,999 per year",
        opcion13:" $70,000 to $99,999 per year",
        opcion14:" $100,000 to $124,999 per year",
        opcion15:" $125,000 to $149,999 per year",
        opcion16:" $150,000 and over",
        opcion17:" Prefer not to answer",
        opcion18:" Don't know",
        proceed:"Next",
        error:"Please answer the question before proceeding.",
        errorClose: "Close",
    };
};
/**
 * Created by joseorellana on 05-02-16.
 * Back translated by amatz on 15-02-16.
 */

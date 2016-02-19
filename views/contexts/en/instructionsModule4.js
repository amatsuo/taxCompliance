module.exports = function(settings, headers) {

    var avalible=settings.standard.CANTIDAD,unit=settings.standard.UNIDAD_ESTANDAR, cantidadESUxPCH=settings.standard.CANTIDAD_ESU_x_PCH,cantidadPCH=settings.standard.CANTIDAD_DE_PCH;
    return {
        title: "InstructionsModule4",
        instructions: "Module 4",
        a:  "In this Module you will make ten choices, but only one of them will be used in the end to determine your earnings in this module. Each decision is a paired choice between \"Option A\" and \"Option B.\" After you have made all of your choices, the server will select at random one of the ten decisions to be used, and a second random selection will determine what your payoff is for the option you chose, A or B, for the particular decision selected. Even though you will make ten decisions, only one of these will end up affecting your earnings, but you will not know in advance which decision will be used. Obviously, each decision has an equal chance of being used in the end.",
        b:  "The sort of decisions you are going to make are the following: Decision 1,  Option A pays $2.00 with probability 10%, and it pays $1.60 with probability 90%. Opción B paga $3.850 con probabilidad 10%, y paga $100 con probabilidad 90%. The other Decisions are similar, except the chances of the higher payoff for each option increase. In fact, for Decision 10, the second selection will not be needed since each option pays the highest payoff for sure, so your choice here is between $2.00 y $3.85.",
        c:  "These Earnings will be added to your previous earnings, and you will be paid all earnings in cash when you finish.",

        ifYouUnderstood: "If you understand the instructions, click \"Start Module 4\" ",
        proceed: "Start Module 4"
    };
};

/**
 * Created by joseorellana on 02-12-15.
 * Back translated by amatz on 15-02-16.
 */

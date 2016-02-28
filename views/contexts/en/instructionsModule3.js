module.exports = function(settings, headers) {

    var salaryG = settings.standard.SALARY_G,
        salaryK = settings.standard.SALARY_K,
        unit = settings.standard.UNIDAD_ESTANDAR, 
        cantidadESUxPCH = settings.standard.CANTIDAD_ESU_x_PCH,
        cantidadPCH = settings.standard.CANTIDAD_DE_PCH,
        taxRate = settings.standard.TAX_MODULE_3,
        auditRate = settings.standard.PROBABILITY_MODULE_3;
    var taxPct = Math.round(taxRate * 100),
        auditPct = Math.round(auditRate * 100);
    var repeat = settings.standard.REPEAT;

    var btext = "In each one-minute stage you will be asked to compute a series of additions. Your Preliminary Gains depend on how many correct answers you provide. If you are type G, you will get "+salaryG+" ECUs for each correct answer, while if you are type K you will get "+salaryK+" ECUs for each correct answer.";
    if(salaryG == salaryK){
        btext = "In each one-minute stage you will be asked to compute a series of additions. Your Preliminary Gains depend on how many correct answers you provide: You will get "+salaryG+" ECUs for each correct answer";
    }

    return {
        title: "InstructionsModule3",
        instructions: "Module 3",
        a:  "This module consists of " + repeat + " rounds. At the beginning of the module participants are randomly assigned to groups of four. You won’t know the identity of the other group members. The composition of each group will remain unchanged. In each group, two members will be type G and the other two are type K. Each participant has an equal chance of being designated type G or K.",
        b: btext,
        c:  "At the end of each round, once you have received information concerning your Preliminary Gains, you will be asked to declare these gains. In this module "+ taxPct + "% of these Declared Gains will then be deducted from your Preliminary Gains. ",
        d:  "In each round there is a certain probability that your Declared Gains will be compared with your actual Preliminary Gains in order to verify these two amounts correspond. In this module this probability is " + auditPct + "%.",
        e:  "If this verification finds a discrepancy between the Preliminary and Declared gains an extra amount will be deducted from your Preliminary Gains. In this module this amount will correspond to 50% of the observed discrepancy. In addition, the regular deduction of "+ taxPct + "% will apply to the Preliminary Gains and not to the declared amount.",
        f:  "Deductions applying to the four group members will then be pooled and equally distributed amongst those members.",
        g:  "Your profits are calculated and displayed at the end of each round in the following manner:",
        g1: "   Profit = Preliminary Gains – Deduction from the Declared Gains – Potential deductions due to discrepancy + Group amount",
        h:  "At the end of the module one round will be chosen at random, and your earnings will be based on your profit of that round at the exchange rate " + cantidadESUxPCH + unit + " = $" + cantidadPCH + ".",
        i:  "You will be informed of your earnings for this module at the end of the experiment.",
        ifYouUnderstood: "If you understand the instructions, click \"Start Module 3\" ",
        proceed: "Start Module 3"
    };
};

/**
 * Created by joseorellana on 02-12-15.
 * Back translated by amatz on 15-02-16.
 */

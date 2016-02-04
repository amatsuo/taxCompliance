/**
 * # Game settings definition file
 * Copyright(c) 2015 J.Orellana,M.Lopez <jose.orellanan@usach.cl>
 * MIT Licensed
 *
 * The variables in this file will be sent to each client and saved under:
 *
 *   `node.game.settings`
 *
 * The name of the chosen treatment will be added as:
 *
 *    `node.game.settings.treatmentName`
 *
 * http://www.nodegame.org
 * ---
 */
module.exports = {

    // Variables shared by all treatments.

    // Session counter.
    SESSION_ID: 1,

    // Numnber of game rounds repetitions.
    REPEAT: 1,
    //Timer selec_Lang
    TIMER_SELEC_LANG: 100000,
    //Timer instructions
    TIMER_INSTRUCTIONS: 200000,
    //Timer instructions
    TIMER_GAME:2000,
    //
    CANTIDAD:1000,
    CANTIDAD_ESU_x_PCH:300,
    CANTIDAD_DE_PCH:500,
    CANTIDAD_DE_ESUx_POUNDS:300,
    CANTIDAD_DE_POUNS:500,
    //
    SALARY_G:200,
    SALARY_K:100,
    TIMER_TOTAL:90,
    TAX_MODULE_2:0.1,
    PROBABILITY_MODULE_2:0.0,
    TAX_MODULE_3:0.1,
    PROBABILITY_MODULE_3:0.0,

    UNIDAD_ESTANDAR:"ECUs",

    MIN_PLAYERS: 1,

    // Treatments definition.

    // They can contain any number of properties, and also overwrite
    // those defined above.

    // If the `treatments` object is missing a treatment named _standard_
    // will be created automatically, and will contain all variables.

    treatments: {

        standard: {
            fullName: "Standard Treatment",
            description: "Longer time",
            timer: 30000
        },

        pressure: {
            fullName: "Time Pressure Treatment",
            description: "Short times to take decisions",
            timer: 10000
        },

    }
};

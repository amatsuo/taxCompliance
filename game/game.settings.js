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
    GAMENAME: "CESS_TC",
    
    // Session counter.
    SESSION_ID: 1,

    // Numnber of game rounds repetitions.
    REPEAT: 1,
    //Timer selec_Lang
    TIMER_SELEC_LANG: 60000,
    //Timer instructions
    TIMER_INSTRUCTIONS: 180000,
    //Timer Dictator Game
    TIMER_DG: 30000,
    //Timer for RET
    TIMER_GAME:15000,
    //Timer for Declaration
    TIMER_DECLARE: 30000,
    //Timer for Declaration
    TIMER_TAX_RES: 30000,
    //Timer for result screen
    TIMER_RESULT: 30000,

    //
    CANTIDAD:1000, //endowmnet for dictator game
    CANTIDAD_ESU_x_PCH:1000, //exhange rate
    CANTIDAD_DE_PCH:1,
//    CANTIDAD_DE_ESUx_POUNDS:300,
//    CANTIDAD_DE_POUNS:500,
    //
    SALARY_G:200,
    SALARY_K:100,
    TIMER_TOTAL:30,
    TAX_MODULE_2:0.1,
    PROBABILITY_MODULE_2:0.0,
    TAX_MODULE_3:0.1,
    PROBABILITY_MODULE_3:0.8,

    UNIDAD_ESTANDAR:"ECUs",

    MIN_PLAYERS: 2,

    
    RISK_SAFE_HIGH: "1.00",
    RISK_SAFE_LOW: "0.80",
    RISK_GABL_HIGH: "1.95",
    RISK_GABL_LOW: "0.05",

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

/**
 * # Waiting Room settings
 * Copyright(c) 2015 J.Orellana,M.Lopez <jose.orellanan@usach.cl>
 * MIT Licensed
 *
 * http://www.nodegame.org
 * ---
 */
module.exports = {

    // How many clients must connect before groups are formed.
    POOL_SIZE: 1,

    // The size of each group.
    GROUP_SIZE: 1,

    // Treatment assigned to groups.
    // If left undefined, a random treatment will be selected.
    // Use "treatment_rotate" for rotating all the treatments.
    CHOSEN_TREATMENT: 'treatment_rotate',

    // Maximum waiting time.
    MAX_WAIT_TIME: 600000,

    // Optional callback function to be executed when the timeout for the
    // maximum waiting time of a player in the waiting room expires.
    ON_TIMEOUT: function() {
        // Do something.
    }
};

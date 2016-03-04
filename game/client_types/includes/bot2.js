/**
 * # Bot for Tax Compliance Task
 * Copyright(c) 2016 Akitaka Matsuo <akitaka.matsuo@nuffield.ox.ac.uk>
 * MIT Licensed
 *
 * http://www.nodegame.org
 * ---
 */
module.exports = function(node, deductions) {
    var d, sum, count;
    sum = 0, count = 0;

    // Bot that returns the average deduction level.
    for (d in deductions) {
        if (deductions.hasOwnProperty(d)) {
            if ('undefined' !== typeof deductions[d]) {
                sum = sum + deductions[d];
                count++;
            }
        }
    }
    // Making sure we have at most 2 decimals.
    return parseFloat((sum/count).toFixed(2), 10);
};
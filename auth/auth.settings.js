/**
 * # Authorization settings
 * Copyright(c) 2015 J.Orellana,M.Lopez <jose.orellanan@usach.cl>
 * MIT Licensed
 *
 * http://www.nodegame.org
 * ---
 */
module.exports = {

    // If authorization is enabled clients must use a valid code,
    // as exported by the codes property here, to be allowed to
    // load resources from the server.
    enabled: false, //  [true, false] Default: TRUE.

    // Option specifying how to load the codes.
    mode: 'file', // ['auto'] Default: 'auto'

    // Codes file. Must export a function that returns an array of codes
    // synchronously or asynchronously. Default file: 'auth.codes.js'
    codes: 'auth.codes.js',

    // Future option. Not available now. Path to login page in `public/`
    page: 'login.htm'

};

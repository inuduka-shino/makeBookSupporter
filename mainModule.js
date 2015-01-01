/*jslint node: true, indent: 4 , nomen:true */
/*global jQuery */

function unuseVars() {
    'use strict';
    return undefined;
}

module.exports = (function () {
    'use strict';
    var router = require('express').Router({
            strict: false
        });

    router.use(/\//, function (req, res) {
        unuseVars(req);
        console.log('makeBookSupporter web server top page.');
        res.sendFile(__dirname + '/contents/top.html');
    });

    router.use(':jsfile(*.js)', function (req, res) {
        // console.log('js loaded.');
        // console.log(req.params.jsfile);
        res.sendFile(__dirname + '/contents' + req.params.jsfile);
    });

    router.use(':url(*)', function (req) {
        console.log(req.params.url);
        throw new Error('not found ' + req.params.url);
    });
    return router;
}());


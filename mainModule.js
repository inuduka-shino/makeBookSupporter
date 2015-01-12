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
        }),
        ajaxDriver = require('./ajaxDriver').driver;

    router.use(/\//, function (req, res) {
        unuseVars(req);
        //console.log('makeBookSupporter web server top page.');
        res.sendFile(__dirname + '/contents/top.html');
    });

    router.use('/api/:ajaxtype(*)', function (req, res) {
        //console.log('ajax api call.');
        //console.log(req.params.ajaxtype);
        //console.log(req.body);
        try {
            res.json(ajaxDriver(req.params.ajaxtype, req.body));
        } catch (ev) {
            if (ev.status !== undefined) {
                res.status(501).json({
                    message:    ev.message
                });
            } else {
                throw ev;
            }
        }
    });

    router.use(':jsfile(*.js)', function (req, res) {
        //console.log('js loaded.');
        //console.log(req.params.jsfile);
        res.sendFile(__dirname + '/contents' + req.params.jsfile);
    });


    router.use(':url(*)', function (req) {
        console.log('route no match');
        console.log(req.params.url);
        throw new Error('not found ' + req.params.url);
    });
    return router;
}());

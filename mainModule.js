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
        ajaxDriverAsync = require('./ajaxDriver').driverAsync;

    router.use(/^\//, function (req, res) {
        unuseVars(req);
        //console.log('makeBookSupporter web server top page.');
        //res.sendFile(__dirname + '/contents/view.html');
        res.redirect('/mbs/view.html');
    });

    router.use('/api/:ajaxtype(*)', function (req, res) {
        //console.log('ajax api call.');
        //console.log(req.params.ajaxtype);
        //console.log(req.body);
        try {
            ajaxDriverAsync(req.params.ajaxtype, req.body)
                .done(function (response) {
                    // console.log('async done!');
                    res.json(response);
                })
                .fail(function (error) {
                    res.status(501).json(error);
                });

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

    router.use(':htmlfile(*.html)', function (req, res) {
        res.sendFile(__dirname + '/contents' + req.params.htmlfile);
    });
    router.use(':jsfile(*.js)', function (req, res) {
        res.sendFile(__dirname + '/contents' + req.params.jsfile);
    });
    router.use(':cssfile(*.css)', function (req, res) {
        res.sendFile(__dirname + '/contents' + req.params.cssfile);
    });


    router.use(':url(*)', function (req) {
        console.log('route no match');
        console.log(req.params.url);
        throw new Error('not found ' + req.params.url);
    });
    return router;
}());


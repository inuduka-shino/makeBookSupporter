/*jslint node: true, indent: 4 , nomen:true */
/*global jQuery, Promise */

function unuseVars() {
    'use strict';
    return undefined;
}

module.exports = (function () {
    'use strict';
    var driverPromise = require('./apiDriver').driverPromise,
        dynamicImage = require('./dynamicImage'),

        router;

    router = require('express').Router({
        strict: false
    });

    router.use(/^\//, function (req, res) {
        unuseVars(req);
        res.redirect(301, '/mbs/view.html');
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

    function genErrorInfo(err) {
        if (typeof err === 'string') {
            return {
                errorName: '<reject>',
                message: err
            };
        }
        return {
            errorName: err.name,
            message: err.message,
            stack: err.stack
        };
    }
    router.use('/api/:apitype(*)', function (req, res) {
        driverPromise(req.params.apitype, req.body)
            .then(function (response) {
                res.json(response);
                //throw new Error('test Error');
                //return Promise.reject(new Error('test Error'));
                //return Promise.reject('simple test Error');
            })
            .catch(function (err) {
                var errInfo;
                console.log('Error in request:' + req.params.apitype);
                errInfo = genErrorInfo(err);
                console.dir(errInfo);
                res.status(501).json(errInfo).end();
            });
    });

    router.use('/image/:jpegtype/:jpegfile(*.jpg)', function (req, res) {
        dynamicImage.getBuffer({
            jpegfile: req.params.jpegfile,
            jpegtype: req.params.jpegtype,
            query: req.query
        }).then(function (imageBuffer) {
            res.status(200)
                .set({'Content-Type': 'image/jpeg' })
                .send(imageBuffer);
        }).catch(function (err) {
            var errInfo;
            console.log([
                'Error in request image',
                req.params.jpegtype,
                req.params.jpegtype
            ].join(':'));
            errInfo = genErrorInfo(err);
            console.dir(errInfo);
            res.status(501).json(errInfo).end();
        });
    });

    router.use(':url(*)', function (req) {
        console.log('route no match');
        console.log(req.params.url);
        throw new Error('not found ' + req.params.url);
    });

    return router;
}());

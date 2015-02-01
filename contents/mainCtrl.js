/*jslint indent: 4 */
/*global md */
md(function (modules) {
    'use strict';
    var requestGenBKL = modules.requestGenBKL.call;
    modules.genBKLCtrl.progress(function (count) {
        var req;
        console.log('count=' + count);
        req = requestGenBKL(count);
        req.done(function () {
            console.log('create gen BK list.');
        });
    });
});


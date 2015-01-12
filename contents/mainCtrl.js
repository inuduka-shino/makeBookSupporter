/*jslint indent: 4 */
/*global md */
md(function (modules) {
    'use strict';
    var requestGenBKL = modules.requestGenBKL.call;
    modules.genBKLCtrl.progress(function (count) {
        console.log('count=' + count);
        requestGenBKL(count);
    });
});


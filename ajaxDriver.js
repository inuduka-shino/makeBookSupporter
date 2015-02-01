/*jslint node: true, indent: 4 , nomen:true */
/*global jQuery */
module.exports = (function () {
    'use strict';
    var
        genBooklogFolderCtrl = require('../booklog/apiInterface'),
        genBooklogFolder = genBooklogFolderCtrl();

    function driver(reqType, param) {
        if (reqType === 'genBKL') {
            genBooklogFolder.genFolder(param.count);
            return {
                status: 'OK'
            };
        }
        throw new Error('unkown reqType:' + reqType);
    }
    function driverAsync(reqType, param) {
        var ret;
        //console.log('ajax driver');
        //console.log(reqType);
        //console.log(param);
        if (reqType === 'genBKL') {
            ret = genBooklogFolder.genFolderAsync(param.count)
                .then(function () {
                    return {
                        status: 'OK'
                    };
                }, function (error) {
                    console.log(error);
                    return {
                        status: 'ERROR'
                    };
                })
                .promise();
            return ret;
        }
        throw new Error('unkown reqType:' + reqType);
    }
    return {
        driver: driver,
        driverAsync: driverAsync,
    };
}());


/*jslint node: true, indent: 4 , nomen:true */
/*global jQuery */
module.exports = (function () {
    'use strict';
    var genBooklogFolderCtrl = require('../booklog/apiInterface'),
        genBooklogFolder = genBooklogFolderCtrl();

    function driver(reqType, param) {
        //console.log('ajax driver');
        //console.log(reqType);
        //console.log(param);
        genBooklogFolder.genFolder(param.count);
        if (reqType === 'genBKL') {
            return {
                status: 'OK'
            };
        } else {
            throw new Error('unkown reqType:' + reqType);
        }
    }

    return {
        driver: driver
    };
}());


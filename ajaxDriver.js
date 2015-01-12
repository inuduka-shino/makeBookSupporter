/*jslint node: true, indent: 4 , nomen:true */
/*global jQuery */
module.exports = (function () {
    'use strict';
    function driver(reqType, param) {
        //console.log('ajax driver');
        //console.log(reqType);
        //console.log(param);
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


/*jslint node: true, indent: 4 , nomen:true */
/*global jQuery */
module.exports = (function () {
    'use strict';
    var
        deferred = require('jquery-deferred').Deferred,
        genBooklogFolderCtrl = require('../booklog/apiInterface'),
        genBooklogFolder = genBooklogFolderCtrl(),
        bookFoldersCntrl = require('./bookFolders'),
        queryBookFolders = bookFoldersCntrl.query,
        jpgFilesCntrl = require('./jpgFiles'),
        queryJpgFiles = jpgFilesCntrl.query,
        bookFolderBasePath = require('../setting/setting_booklog').basePath;

    bookFoldersCntrl.init(bookFolderBasePath);
    jpgFilesCntrl.init(bookFolderBasePath);

    function driverAsync(reqType, param) {
        var ret;
        /*
        console.log('ajax driver');
        console.log(reqType);
        console.log(param);
        */
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
        if (reqType === 'queryBookFolders') {
            return queryBookFolders()
                .then(function (folders) {

                    return {
                        status: 'OK',
                        folders: folders
                    };

                });
        }
        if (reqType === 'queryJpgFiles') {
            return queryJpgFiles(param.name)
                .then(function (files) {
                    return {
                        status: 'OK',
                        files: files
                    };

                });
        }
        if (reqType === 'sample') {
            return deferred().resolve({
                status: 'OK',
                data: [
                    {name: 'a-1'},
                    {name: 'a-2'},
                    {name: 'a-3'}
                ]
            });
        }
        throw new Error('unkown reqType:' + reqType);
    }
    function driver(reqType, param) {
        if (reqType === 'genBKL') {
            genBooklogFolder.genFolder(param.count);
            return {
                status: 'OK'
            };
        }
        throw new Error('unkown reqType:' + reqType);
    }
    return {
        driver: driver,
        driverAsync: driverAsync,
    };
}());


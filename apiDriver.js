/*jslint node: true, indent: 4 , nomen:true */
/*global jQuery, Promise */
module.exports = (function () {
    'use strict';
    var
        genBooklogFolder = require('../booklog/apiInterface')(),
        queryBookFolders = require('./bookFolders').query,
        queryJpgFiles = require('./bookFolders').queryJpegFiles,
        zipBookFolder = require('./zipBookFolder'),
        scanFolder =  require('./scanFolder'),
        localSetting = require('../setting/setting_booklog').local;

    function driverPromise(reqType, param) {
        return Promise.resolve().then(function () {
            if (reqType === 'setting') {
                return Promise.resolve(localSetting);
            }
            if (reqType === 'genBKL') {
                return new Promise(function (resolve) {
                    var count = param.count;
                    genBooklogFolder.genFolderAsync(count)
                        .then(function () {
                            resolve({
                                status: 'OK'
                            });
                        });
                });
            }
            if (reqType === 'queryBookFolders') {
                return queryBookFolders().then(function (folders) {
                    return {
                        status: 'OK',
                        folders: folders
                    };
                });
            }
            if (reqType === 'queryJpgFiles') {
                return queryJpgFiles(param.name).then(function (result) {
                    return {
                        status: 'OK',
                        files: result.files
                    };
                });
            }
            if (reqType === 'makeZipFile') {
                return zipBookFolder.makeZipFile(param.foldername, param.files)
                    .then(function (result) {
                        return {
                            status: 'OK',
                            result: result
                        };
                    });
            }
            if (reqType === 'checkZipFile') {
                return zipBookFolder.checkZipFile(param.foldername)
                    .then(function (zipCheck) {
                        return {
                            status: 'OK',
                            zipCheck: zipCheck
                        };
                    });
            }
            if (reqType === 'queryScanFolders') {
                return scanFolder.queryScanFolders(param.targetCategory);
            }
            if (reqType === 'queryOneBandFile') {
                return scanFolder.queryOneBandFile();
            }
            if (reqType === 'requestMoveGrayJpg') {
                return scanFolder.moveGrayFolderFiles(param.foldername);
            }
            if (reqType === 'requestMoveJacketFiles') {
                return scanFolder.moveJacketFiles();
            }
            if (reqType === 'requestMoveInnerCoverFiles') {
                return scanFolder.moveInnerCoverFiles();
            }
            if (reqType === 'requestMoveBandFiles') {
                return scanFolder.moveBandFiles();
            }

            return Promise.reject(new Error('unkown reqType:' + reqType));
        });
    }

    return {
        driverPromise: driverPromise
    };
}());

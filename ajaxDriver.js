/*jslint node: true, indent: 4 , nomen:true */
/*global jQuery, Promise */
module.exports = (function () {
    'use strict';
    var
        genBooklogFolderCtrl = require('../booklog/apiInterface'),
        genBooklogFolder = genBooklogFolderCtrl(),
        bookFoldersCntrl = require('./bookFolders'),
        queryBookFolders = bookFoldersCntrl.query,
        jpgFilesCntrl = require('./jpgFiles'),
        queryJpgFiles = jpgFilesCntrl.query,
        bookFolderBasePath = require('../setting/setting_booklog').basePath,
        zipBookFolder = require('./zipBookFolder'),
        localSetting = require('../setting/setting_booklog').local;

    bookFoldersCntrl.init(bookFolderBasePath);
    jpgFilesCntrl.init(bookFolderBasePath);
    zipBookFolder.init(bookFolderBasePath);

    function driverPromise(reqType, param) {
        /*
        console.log('ajax driver');
        console.log(reqType);
        console.log(param);
        */
        if (reqType === 'setting') {
            return Promise.resolve(localSetting);
        }
        if (reqType === 'genBKL') {
            return new Promise(function (resolve) {
                genBooklogFolder.genFolderAsync(param.count)
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
            return new Promise(function (resolve) {
                queryJpgFiles(param.name).then(function (result) {
                    resolve({
                        status: 'OK',
                        files: result.files
                    });
                });
            });
        }
        if (reqType === 'makeZipFile') {
            return new Promise(function (resolve) {
                zipBookFolder.makeZipFile(param.foldername, param.files)
                    .then(function (result) {
                        resolve({
                            status: 'OK',
                            result: result
                        });
                    });
            });
        }
        if (reqType === 'checkZipFile') {
            return new Promise(function (resolve) {
                zipBookFolder.checkZipFile(param.foldername)
                    .then(function (zipCheck) {
                        resolve({
                            status: 'OK',
                            zipCheck: zipCheck
                        });
                    });
            });
        }
        /*
        if (reqType === 'sample') {
            return Promise.resolve({
                status: 'OK',
                data: [
                    {name: 'a-1'},
                    {name: 'a-2'},
                    {name: 'a-3'}
                ]
            });
        }
        */
        return Promise.reject(new Error('unkown reqType:' + reqType));
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
        driverPromise: driverPromise
    };
}());

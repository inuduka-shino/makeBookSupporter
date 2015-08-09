/*jslint node: true, indent: 4 , nomen:true */
/*global Promise */

module.exports = (function () {
    'use strict';
    var //fs = require('fs'),
        fsUtil = require('./fsUtil'),
        path = require('path'),
        bookFolderBasePath = require('../setting/setting_booklog').basePath;

    function getBookFolderInfo(bookname) {
        var fullpath = path.join(bookFolderBasePath, bookname),
            xinfopath = path.join(fullpath, 'xinfo.txt');

        //console.log(bookname);
        return fsUtil.stat(fullpath).then(function (stats) {
            if (stats.isDirectory() === false) {
                return {
                    isFolder: false,
                    isXinfo: undefined
                };
            }
            return fsUtil.stat(xinfopath).then(function (statsXinfo) {
                return {
                    isFolder: true,
                    isXinfo: true,
                    statsXinfo: statsXinfo
                };
            }, function (errXinfo) {
                if (errXinfo.code === 'ENOENT') {
                    return {
                        isFolder: true,
                        isXinfo: false
                    };
                }
            });
        }).then(function (stats) {
            return {
                name: bookname,
                isFolder: stats.isFolder,
                isXinfo: stats.isXinfo
            };
        }).catch(function (err) {
            return Promise.reject(err);
            /*
            return Promise.reject({
                name: bookname,
                error: 'error',
                statErr: err.statErr,
                xinfoErr: err.xinfoErr
            });
            */
        });
    }

    function query() {
        return fsUtil.readdir(bookFolderBasePath).then(function (booknameList) {
            return Promise.all(booknameList.map(function (bookname) {
                return getBookFolderInfo(bookname);
            }));
        });
    }

    function queryJpegFiles(bookname) {
        var folderPath = path.join(bookFolderBasePath, bookname);

        return fsUtil.readdir(folderPath).then(function (files) {
            return {
                files: files.map(function (filename) {
                    return {
                        name: filename
                    };
                }),
                folderPath: folderPath
            };
        });
    }

    return {
        query: query,
        queryJpegFiles: queryJpegFiles
    };
}());

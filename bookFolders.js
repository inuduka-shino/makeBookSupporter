/*jslint node: true, indent: 4 , nomen:true */
/*global Promise */

module.exports = (function () {
    'use strict';
    var fs = require('fs'),
        path = require('path'),

        booksFolderPath;

    function init(booksFolderPath0) {
        booksFolderPath = booksFolderPath0;
    }

    function getBookFolderInfo(filename) {
        var fullpath = path.join(booksFolderPath, filename),
            xinfopath = path.join(fullpath, 'xinfo.txt');

        //console.log(filename);
        return new Promise(function (resolve, reject) {
            fs.stat(fullpath, function (err, stats) {
                if (!err) {
                    resolve(stats);
                } else {
                    reject({statErr: err});
                }
            });
        }).then(function (stats) {
            if (stats.isDirectory() === false) {
                return {
                    isFolder: false,
                    isXinfo: undefined
                };
            }
            return new Promise(function (resolve, reject) {
                fs.stat(xinfopath, function (errXinfo, statsXinfo) {
                    if (!errXinfo) {
                        resolve({
                            isFolder: true,
                            isXinfo: true,
                            statsXinfo: statsXinfo
                        });
                    } else {
                        //console.log(errXinfo);
                        if (errXinfo.code === 'ENOENT') {
                            resolve({
                                isFolder: true,
                                isXinfo: false
                            });
                        } else {
                            reject({errXinfo: errXinfo});
                        }
                    }
                });
            });
        }).then(function (stats) {
            return {
                name: filename,
                isFolder: stats.isFolder,
                isXinfo: stats.isXinfo
            };
        }).catch(function (err) {
            return Promise.reject({
                name: filename,
                error: 'error',
                statErr: err.statErr,
                xinfoErr: err.xinfoErr
            });
        });
    }

    function query() {
        return new Promise(function (resolve, reject) {
            var queryStats = [];
            fs.readdir(booksFolderPath, function (err, files) {
                if (!err) {
                    files.forEach(function (filename) {
                        queryStats.push(getBookFolderInfo(filename));
                    });
                    resolve(Promise.all(queryStats));
                } else {
                    reject(err);
                }
            });

        });

    }

    return {
        init: init,
        query: query
    };
}());

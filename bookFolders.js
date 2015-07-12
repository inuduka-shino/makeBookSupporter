/*jslint node: true, indent: 4 , nomen:true */
/*global jQuery, Promise */

module.exports = (function () {
    'use strict';
    var deferred = require('jquery-deferred').Deferred,
        when = require('jquery-deferred').when,
        fs = require('fs'),
        path = require('path'),

        booksFolderPath;

    function init(booksFolderPath0) {
        booksFolderPath = booksFolderPath0;
    }

    function getBookFolderInfo(filename) {
        var //statdfr = deferred(),
            fullpath = path.join(booksFolderPath, filename),
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
                return Promise.resolve({
                    isFolder: false,
                    isXinfo: undefined
                });
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
            return {
                name: filename,
                error: 'error',
                statErr: err.statErr,
                xinfoErr: err.xinfoErr
            };
        });
    }

    function query() {
        var dfr = deferred();
        fs.readdir(booksFolderPath, function (err, files) {
            var queryStats = [];
            if (!err) {
                files.forEach(function (filename) {
                    queryStats.push(getBookFolderInfo(filename));
                });
                when.apply(null, queryStats).done(function () {
                    var len = arguments.length,
                        argv = [],
                        idx;
                    for (idx = 0; idx < len; idx += 1) {
                        argv.push(arguments[idx]);
                    }
                    dfr.resolve(argv);
                });
            } else {
                dfr.reject(err);
            }
        });

        return dfr.promise();
    }

    return {
        init: init,
        query: query
    };
}());

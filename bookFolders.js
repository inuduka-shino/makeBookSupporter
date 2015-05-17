/*jslint node: true, indent: 4 , nomen:true */
/*global jQuery */

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
        var statdfr = deferred(),
            xinfodfr = deferred(),

            fullpath = path.join(booksFolderPath, filename),
            xinfopath = path.join(fullpath, 'xinfo.txt');

        //console.log(filename);
        fs.stat(fullpath, function (err, stats) {
            var isFolder;
            if (!err) {
                isFolder = stats.isDirectory();
                statdfr.resolve({
                    isFolder: isFolder
                });
                if (isFolder) {
                    //fs.stat(xinfopath, function (errXinfo, statsXinfo) {
                    fs.stat(xinfopath, function (errXinfo) {
                        if (!errXinfo) {
                            xinfodfr.resolve(true);
                        } else {
                            //console.log(errXinfo);
                            if (errXinfo.code === 'ENOENT') {
                                xinfodfr.resolve(false);
                            } else {
                                xinfodfr.reject(errXinfo);
                            }
                        }
                    });
                } else {
                    xinfodfr.resolve();
                }
            } else {
                statdfr.reject(err);
                xinfodfr.reject();
            }
        });

        return when(statdfr, xinfodfr).then(function (stat, xinfo) {
            return {
                name: filename,
                isFolder: stat.isFolder,
                isXinfo: xinfo
            };
        }, function (statErr, xinfoErr) {
            return {
                name: filename,
                error: 'error',
                statErr: statErr,
                xinfoErr: xinfoErr
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


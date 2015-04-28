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
    function getFileInfo(filename) {
        var statdfr = deferred();

        fs.stat(path.join(booksFolderPath, filename), function (err, stats) {
            statdfr.resolve({
                isFolder: stats.isDirectory()
            });
        });

        return when(statdfr).then(function (stat) {
            return {
                name: filename,
                isFolder: stat.isFolder
            };
        });
    }
    function query() {
        var dfr = deferred();
        fs.readdir(booksFolderPath, function (err, files) {
            var
                queryStats = [];
            files.forEach(function (filename) {
                queryStats.push(getFileInfo(filename));
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

        });

        return dfr.promise();
    }

    return {
        init: init,
        query: query
    };
}());


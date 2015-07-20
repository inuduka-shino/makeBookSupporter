/*jslint node: true, indent: 4 , nomen:true */
/*global Promise */

module.exports = (function () {
    'use strict';
    var // deferred = require('jquery-deferred').Deferred,
        //when = require('jquery-deferred').when,
        fs = require('fs'),
        path = require('path'),

        booksFolderPath;

    function init(booksFolderPath0) {
        booksFolderPath = booksFolderPath0;
    }

    function query(foldername) {
        var folderPath = path.join(booksFolderPath, foldername);

        return new Promise(function (resolve, reject) {
            fs.readdir(folderPath, function (err, files) {
                if (!err) {
                    resolve({
                        files: files.map(function (filename) {
                            return {
                                name: filename
                            };
                        }),
                        folderPath: folderPath
                    });
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

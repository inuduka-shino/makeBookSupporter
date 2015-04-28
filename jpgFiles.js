/*jslint node: true, indent: 4 , nomen:true */
/*global jQuery */

module.exports = (function () {
    'use strict';
    var deferred = require('jquery-deferred').Deferred,
        //when = require('jquery-deferred').when,
        fs = require('fs'),
        path = require('path'),

        booksFolderPath;

    function init(booksFolderPath0) {
        booksFolderPath = booksFolderPath0;
    }

    function query(foldername) {
        var dfr = deferred(),
            folderPath = path.join(booksFolderPath, foldername);
        fs.readdir(folderPath, function (err, files) {
            if (!err) {
                dfr.resolve(files.map(function (filename) {
                    return {
                        name: filename
                    };
                }));
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


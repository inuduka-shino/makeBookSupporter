/*jslint node: true, indent: 4 , nomen:true */
/*global jQuery */

module.exports = (function () {
    'use strict';
    var deferred = require('jquery-deferred').Deferred,
        path = require('path'),
        fs = require('fs'),

        booksFolderPath;

    function init(booksFolderPath0) {
        booksFolderPath = booksFolderPath0;
    }

    function zipBookFilePath(folderName) {
        return path.join(booksFolderPath, folderName + '.zip');
    }

    function checkZipFile(folderName) {
        var dfr = deferred(),
            zipFilePath = zipBookFilePath(folderName);

        fs.open(zipFilePath, 'r', function (err, fd) {
            if (err) {
                // console.log('zipCHeck:' + folderName);
                // console.log(err);
                if (err.code === 'ENOENT') {
                    dfr.resolve({
                        exists: 'no'
                    });
                } else {
                    dfr.resolve({
                        exists: 'unknown'
                    });
                }
            } else {
                fs.close(fd, function () {
                    dfr.resolve({
                        exists: 'yes'
                    });
                });
            }
        });


        return dfr.promise();
    }
    function makeZipFile(folderName, files) {
    }

    return {
        init: init,
        checkZipFile: checkZipFile,
        makeZipFile: makeZipFile
    };
}());

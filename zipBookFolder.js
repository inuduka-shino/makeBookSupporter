/*jslint node: true, indent: 4 , nomen:true */
/*global jQuery */

module.exports = (function () {
    'use strict';
    var deferred = require('jquery-deferred').Deferred,
        when = require('jquery-deferred').when,
        path = require('path'),
        fs = require('fs'),
        Zip = require('zip-archiver').Zip,
        jpgFiles = require('./jpgFiles'),

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
                        exists: 'no',
                        zipFilePath: zipFilePath
                    });
                } else {
                    dfr.resolve({
                        exists: 'unknown',
                        zipFilePath: zipFilePath
                    });
                }
            } else {
                fs.close(fd, function () {
                    dfr.resolve({
                        exists: 'yes',
                        zipFilePath: zipFilePath
                    });
                });
            }
        });

        return dfr.promise();
    }
    function checkFiles(foldername, files) {
        return jpgFiles.query(foldername).then(function (jpgFilesInfo) {
            var idx,
                fullpathList = [],
                currentFileList = jpgFilesInfo.files.map(function (file) {
                    return file.name;
                });

            if (files.length !== currentFileList.length) {
                return {
                    result: 'ng',
                    reason: 'different file count'
                };
            }
            for (idx = 0; idx < files.length; idx += 1) {
                if (files[idx] !== currentFileList[idx]) {
                    //console.log('file miss match ' + files[idx] + '-' + currentFileList[idx]);
                    return {
                        result: 'ng',
                        reason: 'filename miss match (' + files[idx] +
                                '-' + currentFileList[idx] + ')'
                    };
                }
                fullpathList.push(path.join(booksFolderPath, foldername, files[idx]));
            }
            //console.log('files OK');
            return {
                result: 'ok',
                fullpathList: fullpathList
            };
        });
    }
    function makeZipFile(folderName, files) {
        var dfr = deferred();
        when(
            checkZipFile(folderName),
            checkFiles(folderName, files)
        ).done(function (zipFileStatus, filesStatus) {
            var zipFile,
                zipFilePath,
                fullpathList,
                addFileDfrList = [];
            if (zipFileStatus.exists !== 'no') {
                dfr.resolve({
                    makeZipFileStatus: 'ng',
                    reason: zipFileStatus.reason
                });
            } else if (filesStatus.result !== 'ok') {
                dfr.resolve({
                    makeZipFileStatus: 'ng',
                    reason: 'zip file already exists.'
                });
            } else {
                zipFilePath = zipFileStatus.zipFilePath;
                fullpathList = filesStatus.fullpathList;
                //console.log(zipFilePath);
                //console.log(zipFolderPath);
                zipFile = new Zip({file: zipFilePath});
                fullpathList.forEach(function (filepath) {
                    var addDfr = deferred();
                    addFileDfrList.push(addDfr);
                    console.log(filepath);
                    zipFile.add(
                        filepath,
                        function () {
                            addDfr.resolve();
                        }
                    );
                });
                when.apply(null, addFileDfrList).done(function () {
                    zipFile.done();
                    console.log('gen ' + zipFilePath);
                    dfr.resolve({
                        makeZipFileStatus: 'ok'
                    });

                });
            }
        });

        return dfr.promise();
    }

    return {
        init: init,
        checkZipFile: checkZipFile,
        makeZipFile: makeZipFile
    };
}());

/*jslint node: true, indent: 4 , nomen:true */
/*global jQuery */

module.exports = (function () {
    'use strict';
    var deferred = require('jquery-deferred').Deferred,
        when = require('jquery-deferred').when,
        path = require('path'),
        fs = require('fs'),
        archiver = require('archiver'),
        jpgFiles = require('./jpgFiles'),

        zipArchiver,
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
    zipArchiver = (function () {
        function append(self, filelname, filePath) {
            self.archive.append(fs.createReadStream(filePath), {
                name: filelname
            });
        }
        function finalize(self, handler) {
            self.archive.finalize();
            handler();
        }
        return function (zipFilePath) {
            var self = {};
            self.stream = fs.createWriteStream(zipFilePath);
            self.archive = archiver('zip');
            self.archive.pipe(self.stream);

            return {
                append: append.bind(null, self),
                finalize: finalize.bind(null, self)
            };
        };
    }());
    function makeZipFile(folderName, files) {
        var dfr = deferred();
        when(
            checkZipFile(folderName),
            checkFiles(folderName, files)
        ).done(function (zipFileStatus, filesStatus) {
            var zipArchive;
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
                //console.log(zipFilePath);
                //console.log(zipFolderPath);
                zipArchive = zipArchiver(zipFileStatus.zipFilePath);
                filesStatus.fullpathList.forEach(function (filepath, idx) {
                    zipArchive.append(files[idx], filepath);
                });
                zipArchive.finalize(function () {
                    console.log('gen ' + zipFileStatus.zipFilePath);
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

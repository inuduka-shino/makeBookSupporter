/*jslint node: true, indent: 4 , nomen:true */
/*global Promise */

module.exports = (function () {
    'use strict';
    var path = require('path'),
        fs = require('fs'),
        archiver = require('archiver'),
        queryJpegFiles = require('./bookFolders').queryJpegFiles,

        bookFolderBasePath = require('../setting/setting_booklog').basePath,

        zipArchiver;

    function zipBookFilePath(folderName) {
        return path.join(bookFolderBasePath, folderName + '.zip');
    }

    function checkZipFile(folderName) {
        var zipFilePath = zipBookFilePath(folderName);

        return new Promise(function (resolve) {
            fs.open(zipFilePath, 'r', function (err, fd) {
                if (err) {
                    // console.log('zipCHeck:' + folderName);
                    // console.log(err);
                    if (err.code === 'ENOENT') {
                        resolve({
                            exists: 'no',
                            zipFilePath: zipFilePath
                        });
                    } else {
                        resolve({
                            exists: 'unknown',
                            zipFilePath: zipFilePath
                        });
                    }
                } else {
                    fs.close(fd, function () {
                        resolve({
                            exists: 'yes',
                            zipFilePath: zipFilePath
                        });
                    });
                }
            });

        });
    }

    function checkFiles(foldername, files) {
        return queryJpegFiles(foldername).then(function (jpgFilesInfo) {
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
                fullpathList.push(path.join(bookFolderBasePath, foldername, files[idx]));
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
        function finalize(self) {
            self.archive.finalize();
            return self.finalizePromise;
        }
        return function (zipFilePath) {
            var self = {};
            self.stream = fs.createWriteStream(zipFilePath);
            self.archive = archiver('zip');
            self.archive.pipe(self.stream);
            self.finalizePromise = new Promise(function (resolve) {
                self.stream.on('finish', function () {
                    console.log('arcive finished');
                    resolve();
                });
            });

            return {
                append: append.bind(null, self),
                finalize: finalize.bind(null, self)
            };
        };
    }());

    function makeZipFile(folderName, files) {
        return Promise.all([
            checkZipFile(folderName),
            checkFiles(folderName, files)
        ]).then(function (args) {
            var zipFileStatus = args[0],
                filesStatus = args[1],
                zipArchive;
            if (zipFileStatus.exists !== 'no') {
                return {
                    makeZipFileStatus: 'ng',
                    reason: zipFileStatus.reason
                };
            }
            if (filesStatus.result !== 'ok') {
                return {
                    makeZipFileStatus: 'ng',
                    reason: 'zip file already exists.'
                };
            }
            //console.log(zipFilePath);
            //console.log(zipFolderPath);
            zipArchive = zipArchiver(zipFileStatus.zipFilePath);
            filesStatus.fullpathList.forEach(function (filepath, idx) {
                zipArchive.append(files[idx], filepath);
            });
            return zipArchive.finalize().then(function () {
                console.log('gen ' + zipFileStatus.zipFilePath);
                return {
                    makeZipFileStatus: 'ok'
                };
            });
        });
    }

    return {
        checkZipFile: checkZipFile,
        makeZipFile: makeZipFile
    };
}());

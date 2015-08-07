/*jslint node: true, indent: 4 , nomen:true */
/*global Promise */

module.exports = (function () {
    'use strict';
    var path = require('path'),
        fsUtil = require('./fsUtil'),
        imageMagicUtil = require('./imagemagickUtil'),
        setting,

        jpgFileName,
        fileNameParser,

        moveGrayFolderFiles;

    setting = (function () {
        var
            setting_booklog  = require('../setting/setting_booklog'),
            setting_scanFolders = require('../setting/setting_scanFolders');
            /*
                {
                    basePath: '......',
                    grayFolderPath: '.....'
                    grayFolderFilePattern = /PN[0-9A-Za-z\-_]+\.jpg/,
            */
        return {
            grayFolder: {
                prefix: setting_scanFolders.grayFolder.prefix,
                fullpath: path.join(
                    setting_scanFolders.basePath,
                    setting_scanFolders.grayFolder.path
                ),
                filePattern: setting_scanFolders.grayFolder.filePattern,
                bookFolderPath: function (foldername) {
                    return path.join(setting_booklog.basePath, foldername);
                }

            },
            colorSF: {
                folderPath: path.join(
                    setting_scanFolders.basePath,
                    setting_scanFolders.colorSF.path
                ),
                filePattern: setting_scanFolders.colorSF.filePattern
            },
            jacket: {
                frontPrefix: setting_scanFolders.jacket.frontPrefix,
                frontJacketFolderPath: path.join(
                    setting_scanFolders.basePath,
                    setting_scanFolders.jacket.frontpath
                ),
                prefix: setting_scanFolders.jacket.prefix,
                jacketFolderPath: path.join(
                    setting_scanFolders.basePath,
                    setting_scanFolders.jacket.path
                )
            },
            innercover: {
                folderPath: path.join(
                    setting_scanFolders.basePath,
                    setting_scanFolders.innercover.path
                ),
                prefix: setting_scanFolders.innercover.prefix
            },
            bandF: {
                folderPath: path.join(
                    setting_scanFolders.basePath,
                    setting_scanFolders.bandF.path
                ),
                filePattern: setting_scanFolders.bandF.filePattern
            },
            band: {
                folderPath: path.join(
                    setting_scanFolders.basePath,
                    setting_scanFolders.band.path
                ),
                prefix: setting_scanFolders.band.prefix
            }

        };
    }());

    jpgFileName = (function () {
        function zeroPadding(num) {
            return ('000' + num).slice(-3);
        }
        function zeroPaddingBig(num) {
            return ('000000' + num).slice(-9);
        }
        function setCount(self, count) {
            self.count = count;
        }
        function genFilename(self) {
            var prefix = self.prefix,
                count = self.count,
                filename;
            if (count < 1000) {
                filename = [
                    prefix,
                    zeroPadding(count),
                    '.jpg'
                ].join('');
            } else {
                filename = [
                    prefix,
                    'XXX',
                    zeroPaddingBig(count),
                    '.jpg'
                ].join('');
            }
            self.count += 1;
            return filename;
        }

        return function (prefix, count) {
            var self = {
                prefix: prefix,
                count: count
            };
            if (count === undefined) {
                self.count = 1;
            }
            return {
                genFilename: genFilename.bind(null, self),
                setCount: setCount.bind(null, self)
            };
        };

    }());

    fileNameParser = (function fileNameParser() {
        function getNum(pattern, filename) {
            var rslt;
            rslt = pattern.exec(filename);
            if (rslt === null) {
                return -1;
            }
            return Number(rslt[1]);
        }
        return function (prefix) {
            var pattern = new RegExp(prefix + "([0-9]+)\\.jpg");
            return {
                getNum: getNum.bind(null, pattern)
            };
        };
    }());

    console.log(setting.jacket);
    function genMoveFilesProcess(categoryType) {
        var
            srcFolderPath,
            srcFilePattern,
            moveToFolderPath,
            moveToPrefix,
            copyToFolderPath,
            copyToPrefix,

            fnParserMV,
            fnParserCP,

            errorNoTargetFiles = new Error('NoTargetFiles');

        if (categoryType === 'jacket') {
            srcFolderPath = setting.colorSF.folderPath;
            srcFilePattern = setting.colorSF.filePattern;
            moveToFolderPath = setting.jacket.jacketFolderPath;
            moveToPrefix = setting.jacket.prefix;
            copyToFolderPath = setting.jacket.frontJacketFolderPath;
            copyToPrefix = setting.jacket.frontPrefix;
        } else if (categoryType === 'innercover') {
            srcFolderPath = setting.colorSF.folderPath;
            srcFilePattern = setting.colorSF.filePattern;
            moveToFolderPath = setting.innercover.folderPath;
            moveToPrefix = setting.innercover.prefix;
        } else if (categoryType === 'band') {
            srcFolderPath = setting.bandF.folderPath;
            srcFilePattern = setting.bandF.filePattern;
            moveToFolderPath = setting.band.folderPath;
            moveToPrefix = setting.band.prefix;
        }
        fnParserMV =  fileNameParser(moveToPrefix);
        if (copyToPrefix !== undefined) {
            fnParserCP =  fileNameParser(copyToPrefix);
        }

        console.log(categoryType + ' path:');
        console.log([moveToFolderPath, copyToFolderPath].join(' - '));
        return function () {
            var targetDirs = [
                    srcFolderPath,
                    moveToFolderPath
                ];

            if (copyToFolderPath !== undefined &&
                    copyToFolderPath !== moveToFolderPath) {
                targetDirs.push(copyToFolderPath);
            }

            return Promise.all(targetDirs.map(function (dirPath) {
                return fsUtil.readdir(dirPath);
            })).then(function (filesArray) {
                var srcFolderFiles = filesArray[0],
                    moveToFolderFiles = filesArray[1],
                    copyToFolderFiles = filesArray[2],
                    startCount,
                    srcFiles,
                    filenameCtrlMV,
                    filenameCtrlCP;

                startCount = (function () {
                    var count;
                    count = moveToFolderFiles.reduce(function (preValue, filename) {
                        var val = fnParserMV.getNum(filename);
                        if (val > preValue) {
                            return val;
                        }
                        return preValue;
                    }, 0);
                    if (fnParserCP !== undefined) {
                        if (copyToFolderFiles === undefined) {
                            copyToFolderFiles = moveToFolderFiles;
                        }
                        count = copyToFolderFiles.reduce(function (preValue, filename) {
                            var val = fnParserCP.getNum(filename);
                            if (val > preValue) {
                                return val;
                            }
                            return preValue;
                        }, count);
                    }
                    return count + 1;
                }());

                srcFiles = srcFolderFiles
                    .filter(function (filename) {
                        return srcFilePattern.test(filename);
                    })
                    .sort();
                if (srcFiles.length === 0) {
                    throw errorNoTargetFiles;
                }

                filenameCtrlMV = jpgFileName(moveToPrefix, startCount);
                if (copyToPrefix !== undefined) {
                    filenameCtrlCP = jpgFileName(copyToPrefix, startCount);
                }

                return Promise.all(srcFiles.map(function (filename) {
                    var srcFilePath,
                        dstFilePaths;

                    srcFilePath = path.join(srcFolderPath, filename);
                    dstFilePaths = [path.join(
                        moveToFolderPath,
                        filenameCtrlMV.genFilename()
                    )];

                    if (filenameCtrlCP !== undefined) {
                        dstFilePaths.push(path.join(
                            copyToFolderPath,
                            filenameCtrlCP.genFilename()
                        ));
                    }

                    return fsUtil
                        .readFile(srcFilePath)
                        .then(
                            imageMagicUtil.converter({
                                rotate: 90
                            }).conv
                        )
                        .then(function (buff) {
                            return Promise.all(dstFilePaths.map(function (filepath) {
                                return fsUtil.writeFile(filepath, buff);
                            }));
                        })
                        .then(fsUtil.remove.bind(null, srcFilePath));

                }));
            }).then(function () {
                return {
                    status: 'OK'
                };
            }).catch(function (err) {
                if (err === errorNoTargetFiles) {
                    return {
                        status: 'NOTARGET'
                    };
                }
                return {
                    status: 'ERROR',
                    err: err
                };
            });
        };
    }

    moveGrayFolderFiles = (function () {
        var filePrefix = setting.grayFolder.prefix,
            bookFolderPath = setting.grayFolder.bookFolderPath,
            grayFolderPath = setting.grayFolder.fullpath,
            filePattern = setting.grayFolder.filePattern,

            errorExistSameCategoryFiles = new Error('ExistSameCategoryFiles'),
            errorNoTargetFiles = new Error('NoTargetFiles');

        return function (foldername) {
            var targetFolderPath = bookFolderPath(foldername);

            return Promise.all([
                fsUtil.readdir(grayFolderPath),
                fsUtil.readdir(targetFolderPath)
            ]).then(function (results) {
                var sourceFolderFiles = results[0],
                    destFolderFiles = results[1],
                    genFilename = jpgFileName(filePrefix).genFilename,
                    files;
                if (destFolderFiles.filter(function (filename) {
                        return filename.slice(0, 2) === filePrefix;
                    }).length !== 0) {
                    //console.log(">> すでにある");
                    throw errorExistSameCategoryFiles;
                }
                files = sourceFolderFiles
                    .sort()
                    .filter(function (filename) {
                        return filePattern.test(filename);
                    });
                if (files.length === 0) {
                    //console.log(">> ファイルがない");
                    throw errorNoTargetFiles;
                }
                return Promise.all(files.map(function (filename) {
                    var srcFilepath,
                        destFilepath;
                    srcFilepath = path.join(
                        grayFolderPath,
                        filename
                    );
                    destFilepath =  path.join(
                        targetFolderPath,
                        genFilename()
                    );
                    return fsUtil.rename(srcFilepath, destFilepath);
                }));
            }).then(function () {
                return {
                    status: 'OK'
                };
            }).catch(function (err) {
                if (err === errorExistSameCategoryFiles) {
                    return {
                        status: 'NOTMOVE'
                    };
                }
                if (err === errorNoTargetFiles) {
                    return {
                        status: 'NOTARGET'
                    };
                }
            });
        };
    }());

    return {
        moveGrayFolderFiles: moveGrayFolderFiles,
        moveJacketFiles: genMoveFilesProcess("jacket"),
        moveInnerCoverFiles:  genMoveFilesProcess("innercover"),
        moveBandFiles: genMoveFilesProcess("band")
    };
}());

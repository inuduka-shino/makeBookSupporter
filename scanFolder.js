/*jslint node: true, indent: 4 , nomen:true */
/*eslint no-console: 0 */
/*global Promise */

module.exports = (function () {
    'use strict';
    var path = require('path'),
        fsUtil = require('./fsUtil'),
        imagemagicUtil = require('./gmBuffUtil'),
        //imagemagicUtil = require('./imagemagickUtil'),

        setting,
        getScanfolderInfo,
        getBookfolderInfo,

        jpgFileName,
        fileNameParser,

        imageRotateConverters,

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
            colorMF: {
                folderPath: path.join(
                    setting_scanFolders.basePath,
                    setting_scanFolders.colorMF.path
                ),
                filePattern: setting_scanFolders.colorMF.filePattern
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

    getScanfolderInfo = (function () {
        var
            setting_scanFolders = require('../setting/setting_scanFolders'),
            basePath = setting_scanFolders.basePath,

            infoMap = {};

        function genInfo(info) {
            var  folderPath = path.join(
                basePath,
                info.folderPath
            );
            return {
                folderPath: folderPath,
                filePattern: folderPath,
                filePath: function (filename) {
                    return path.join(folderPath, filename);
                }
            };
        }

        [{
            name: 'band',
            folderPath: setting_scanFolders.bandF.path,
            filePattern: setting_scanFolders.bandF.filePattern
        }].forEach(function (info) {
            infoMap[info.name] = genInfo(info);
        });

        return function (categoryType) {
            return infoMap[categoryType];
        };

    }());

    getBookfolderInfo = (function () {
        var setting_booklog  = require('../setting/setting_booklog');
        return function (bookname) {
            var folderPath = path.join(setting_booklog.basePath, bookname);
            return {
                folderPath: folderPath,
                filePath: function (filename) {
                    return path.join(folderPath, filename);
                }
            };
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
            var pattern = new RegExp(prefix + '([0-9]+)\\.jpg');
            return {
                getNum: getNum.bind(null, pattern)
            };
        };
    }());

    imageRotateConverters = (function () {
        var cnvs = {};
        [
            {name: 'e', rotate: 90},
            {name: 's', rotate: 180},
            {name: 'w', rotate: -90}
        ].forEach(function (info) {
            cnvs[info.name] = imagemagicUtil.converter({
                rotate: info.rotate
            }).conv;
        });
        return cnvs;
    }());
    function queryScanFolders() {
        return Promise.all([
            {
                categoryType: 'gray',
                folderPath: setting.grayFolder.fullpath,
                filePattern: setting.grayFolder.filePattern
            }, {
                categoryType: 'colorSF',
                folderPath: setting.colorSF.folderPath,
                filePattern: setting.colorSF.filePattern
            }, {
                categoryType: 'colorMF',
                folderPath: setting.colorMF.folderPath,
                filePattern: setting.colorMF.filePattern
            }, {
                categoryType: 'band',
                folderPath: setting.bandF.folderPath,
                filePattern: setting.bandF.filePattern
            }
        ].map(function (info) {
            return fsUtil.readdir(info.folderPath).then(function (files) {
                var filePattern = info.filePattern;
                return {
                    categoryType: info.categoryType,
                    fileCount: files.filter(function (filename) {
                        return filePattern.test(filename);
                    }).length
                };
            });
        })).then(function (dirInfos) {
            var ret = {status: 'OK'};
            //console.log(dirInfos);
            dirInfos.forEach(function (value) {
                ret[value.categoryType] = value.fileCount;
            });
            //console.log(ret);
            return ret;
        });
    }

    function queryOneBandFile(start) {
        var folderPath = setting.bandF.folderPath,
            filePattern = setting.bandF.filePattern,

            filename;

        return fsUtil.readdir(folderPath).then(function (files) {
            return files.filter(function (file) {
                return filePattern.test(file);
            }).sort();
        }).then(function (files) {
            var filepath;
            if (files.length === 0) {
                //console.log('no files');
                return null;
            }
            if (start >= files.length) {
                start = 0;
            }
            filename = files[start];
            filepath = path.join(folderPath, filename);
            return fsUtil.readFile(filepath).then(imagemagicUtil.identify);
        }).then(function (info) {
            var dir = 'n';
            if (info === null) {
                return {
                    filename: null
                };
            }
            if (info.identify.height > info.identify.width) {
                dir = 'e';
            }
            return {
                filename: filename,
                dir: dir,
                index: start
            };
        });
    }

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
                            imagemagicUtil.converter({
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
                throw err;
            });
        };
    }


    function moveFiles(info) {
        var srcFilepath = getScanfolderInfo(
                info.categoryType
            ).filePath(info.filename),
            dstFilePath = getBookfolderInfo(
                info.bookname
            ).filePath(info.filename);
        if (info.dir === 'n') {
            return fsUtil.rename(srcFilepath, dstFilePath)
                .then(function () {
                    return {
                        status: 'OK'
                    };
                })
                .catch(function (err) {
                    console.log('scanFolder.js moveFiles rename Error');
                    console.dir(err);
                    throw err;
                });
        }
        return fsUtil.readFile(srcFilepath)
            .then(imageRotateConverters[info.dir])
            .then(fsUtil.writeFile.bind(null, dstFilePath))
            .then(fsUtil.remove.bind(null, srcFilepath))
            .then(function () {
                return {
                    status: 'OK'
                };
            })
            .catch(function (err) {
                console.log('scanFolder.js moveFiles trans Error');
                console.dir(err);
                throw err;
            });
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
                throw err;
            });
        };
    }());

    return {
        setting: setting,
        queryScanFolders: queryScanFolders,
        queryOneBandFile: queryOneBandFile,
        moveFiles: moveFiles,
        moveGrayFolderFiles: moveGrayFolderFiles,
        moveJacketFiles: genMoveFilesProcess('jacket'),
        moveInnerCoverFiles:  genMoveFilesProcess('innercover'),
        moveBandFiles: genMoveFilesProcess('band')
    };
}());

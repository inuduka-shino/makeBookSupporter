/*jslint node: true, indent: 4  */
/*global Promise */
module.exports = (function () {
    'use strict';
    var fs = require('fs');

    function stat(filepath) {
        return new Promise(function (resolve, reject) {
            fs.stat(filepath, function (err, stat) {
                if (err) {
                    reject(err);
                } else {
                    resolve(stat);
                }
            });
        });
    }
    function readdir(folderPath) {
        return new Promise(function (resolve, reject) {
            fs.readdir(folderPath, function (err, files) {
                if (err) {
                    reject(err);
                } else {
                    resolve(files);
                }
            });
        });
    }
    function rename(srcPath, dstPath) {
        return new Promise(function (resolve, reject) {
            fs.rename(srcPath, dstPath, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
    function readFile(srcPath) {
        return new Promise(function (resolve, reject) {
            fs.readFile(srcPath, function (err, buff) {
                if (err) {
                    reject(err);
                } else {
                    resolve(buff);
                }
            });
        });
    }
    function writeFile(dstPath, buff) {
        return new Promise(function (resolve, reject) {
            fs.writeFile(dstPath, buff, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    function remove(filePath) {
        return new Promise(function (resolve, reject) {
            fs.unlink(filePath, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    function trans(srcPath, dstPath, transFunc) {
        if (transFunc === undefined) {
            transFunc = function (buffer) {
                return Promise.resolve(buffer);
            };
        }
        return Promise.all([
            new Promise(function (resolve, reject) {
                var stream = fs.createReadStream(srcPath);
                stream
                    .on('open', function () {
                        resolve(stream);
                    })
                    .on('error', function (err) {
                        reject(err);
                    });
            }),
            new Promise(function (resolve, reject) {
                var stream = fs.createWriteStream(dstPath, {flags: 'wx'});
                //"wx"はファイルが存在するとエラー
                stream
                    .on('open', function () {
                        resolve(stream);
                    })
                    .on('error', function (err) {
                        reject(err);
                    });
            })
        ]).then(function (streams) {
            var srcStream = streams[0],
                dstStream = streams[1];

            return new Promise(function (resolve) {
                //var buffer = new Buffer();
                var chunks = [];
                srcStream
                    .on('data', function (chunk) {
                        //buffer.concat([chunk]);
                        chunks.push(chunk);
                    })
                    .on('close', function () {
                        resolve(Buffer.concat(chunks));
                    });
            }).then(function (buffer) {
                return transFunc(buffer);
            }).then(function (buffer) {
                dstStream.write(buffer);
                dstStream.end();
            });
        });
    }
    function copy(srcPath, dstPath) {
        return Promise.all([
            new Promise(function (resolve, reject) {
                var stream = fs.createReadStream(srcPath);
                stream
                    .on('open', function () {
                        resolve(stream);
                    })
                    .on('error', function (err) {
                        reject(err);
                    });
            }),
            new Promise(function (resolve, reject) {
                var stream = fs.createWriteStream(dstPath, {flags: 'wx'});
                //"wx"はファイルが存在するとエラー
                stream
                    .on('open', function () {
                        resolve(stream);
                    })
                    .on('error', function (err) {
                        reject(err);
                    });
            })
        ]).then(function (streams) {
            var srcStream = streams[0],
                dstStream = streams[1];

            return new Promise(function (resolve) {
                srcStream
                    .on('data', function (chunk) {
                        dstStream.write(chunk);
                    })
                    .on('close', function () {
                        dstStream.end();
                        resolve();
                    });
            });
        });
    }


    return {
        stat: stat,
        readdir: readdir,
        rename: rename,
        readFile: readFile,
        writeFile: writeFile,
        remove: remove,
        copy: copy,
        trans: trans
    };

}());

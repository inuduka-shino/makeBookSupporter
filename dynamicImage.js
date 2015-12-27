/*jslint node: true, indent: 4  */
/*global  Promise */
module.exports = (function () {
    'use strict';
    var path = require('path'),
        fsUtil = require('./fsUtil'),
        imagemagicUtil = require('./gmUtil'),
        setting = require('./scanFolder').setting,

        bandFolderPath;

    bandFolderPath = setting.bandF.folderPath;

    function getBuffer(arg) {
        var jpegfile = arg.jpegfile,
            jpegtype = arg.jpegtype,
            query = arg.query,

            filename;

        if (jpegfile === 'blank.jpg') {
            return Promise.resolve(new Buffer(0));
        }
        if (jpegtype === 'band') {
            filename = path.join(bandFolderPath, jpegfile);
            return fsUtil.readFile(filename).then(function (buffer) {
                var im = imagemagicUtil.genImage(buffer);

                if (query.dir === 'n') {
                    /*eslint no-empty: 2*/
                } else if (query.dir === 's') {
                    im.rotate('180');
                } else if (query.dir === 'e') {
                    im.rotate('90');
                } else if (query.dir === 'w') {
                    im.rotate('-90');
                } else {
                    throw new Error('unkown dir code:' + query.dir);
                }
                im.resize(null, 150);
                return im.toBufferPromise();
            });
        }
    }

    return {
        getBuffer: getBuffer
    };
}());

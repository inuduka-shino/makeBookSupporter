/*jslint node: true, indent: 4  */
/*global  Promise */
module.exports = (function () {
    'use strict';
    var path = require('path'),
        fsUtil = require('./fsUtil'),
        imagemagicUtil = require('./imagemagickUtil'),
        setting = require('./scanFolder').setting,

        bandFolderPath,
        convert_sideways,
        convert_reverse,
        converter_Fixsize,
        converter_fixHight;

    // console.log(setting);
    bandFolderPath = setting.bandF.folderPath;
    converter_Fixsize = imagemagicUtil.converter({
        width: 150,
        height: 150,
        resizeStyle: 'aspectfit',
        gravity: 'Center'
    });
    converter_fixHight = imagemagicUtil.converter({
        height: 150,
        resizeStyle: 'aspectfit',
        gravity: 'Center'
    });
    convert_sideways = imagemagicUtil.converter({
        rotate: 90
    });
    convert_reverse = imagemagicUtil.converter({
        rotate: 180
    });
    function getBuffer(arg) {
        var jpegfile = arg.jpegfile,
            jpegtype = arg.jpegtype,
            query = arg.query,

            filename;

        //onsole.log(jpegtype);
        //console.log(jpegfile);
        //console.log(query);
        if (jpegtype === 'band') {
            filename = path.join(bandFolderPath, jpegfile);
            return (function () {
                var fixHightPromise;
                fixHightPromise = fsUtil.readFile(filename)
                    .then(imagemagicUtil.identify)
                    .then(function (info) {
                        if (info.identify.height > info.identify.width) {
                            return convert_sideways.conv(info.data);
                        }
                        return info.data;
                    })
                    .then(converter_fixHight.conv);
                if (query.dir === 'n') {
                    return fixHightPromise;
                }
                return fixHightPromise.then(convert_reverse.conv);
            }());
        }
        //console.log(bandFolderPath);
        if (query.aaa === "1") {
            filename = path.join(bandFolderPath, 'PAD003.jpg');
        } else {
            filename = path.join(bandFolderPath, 'PAD003.jpg');
        }


        return fsUtil.readFile(filename)
            .then(converter_Fixsize.conv);
    }
    return {
        getBuffer: getBuffer
    };
}());

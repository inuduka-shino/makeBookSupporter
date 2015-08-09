/*jslint node: true, indent: 4  */
/*global  Promise */
module.exports = (function () {
    'use strict';
    var path = require('path'),
        fsUtil = require('./fsUtil'),
        imagemagicUtil = require('./imagemagickUtil'),
        setting = require('./scanFolder').setting,

        bandFolderPath,
        converter_Fixsize;

    // console.log(setting);
    bandFolderPath = setting.band.folderPath;
    converter_Fixsize = imagemagicUtil.converter({
        width: 150,
        height: 150,
        resizeStyle: 'aspectfit',
        gravity: 'Center'
    });

    function getBuffer(arg) {
        var jpegfile = arg.jpegfile,
            jpegtype = arg.jpegtype,
            query = arg.query,

            filename;

        //onsole.log(jpegtype);
        //console.log(jpegfile);
        console.log(bandFolderPath);
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

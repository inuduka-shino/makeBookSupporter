/*jslint node: true, indent: 4  */
/*global  Promise */
module.exports = (function () {
    'use strict';
    var fsUtil = require('./fsUtil'),
        imagemagicUtil = require('./imagemagickUtil'),
        converter_Fixsize;

 
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

        console.log(jpegtype);
        console.log(jpegfile);
        if (query.aaa === "1") {
            filename = '/mnt/bookshelf/lib/Scan/work/PA001.jpg';
        } else {
            filename = '/mnt/bookshelf/lib/Scan/work/PA002.jpg';
        }


        return fsUtil.readFile(filename)
            .then(converter_Fixsize.conv);
    }
    return {
        getBuffer: getBuffer
    };
}());

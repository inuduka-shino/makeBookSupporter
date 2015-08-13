/*jslint node: true, indent: 4  */
/*global Promise */
module.exports = (function () {
    'use strict';
    var imagemagic = require('imagemagick-native');

    function conv(options, srcBuff) {
        return new Promise(function (resolve, reject) {
            options.srcData = srcBuff;
            imagemagic.convert(
                options,
                function (err, buff) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(buff);
                    }
                }
            );
        });
    }

    function converter(options) {
        return {
            conv: conv.bind(null, options)
        };
    }

    function identify(buffer) {
        return new Promise(function (resolve, reject) {
            imagemagic.identify({
                srcData: buffer
            }, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        identify: result,
                        data: buffer
                    });
                }
            });
        });
    }

    return {
        converter: converter,
        identify: identify
    };
}());

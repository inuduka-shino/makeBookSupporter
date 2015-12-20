/*eslint no-console: 0 */
/*global Promise */

module.exports = (function () {
    'use strict';
    var //imagemagic = require('./gmUtil'),
        imagemagic = require('gm').subClass({imageMagick: true});

    function conv(options, buffer) {
        return new Promise(function (resolve, reject) {
            var im = imagemagic(buffer);

            if (options.rotate !== undefined) {
                im = im.rotate('green', options.rotate);
            }
            if (options.width !== undefined || options.height !== undefined) {
                im = im.resize(options.width, options.height);
            }
            im.toBuffer('JPEG',function (err, buffer) {
                if (err) {
                    reject(err);
                } else {
                    resolve(buffer);
                }
            });
        });
    }

    function converter(options) {
        return {
            conv: conv.bind(null, options)
        };
    }

    function identify(buffer) {
        return new Promise(function (resolve, reject) {
            imagemagic(buffer).identify(function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        identify: {
                            width: result.size.width,
                            height: result.size.height
                        },
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

/*eslint no-console: 0 */
/*global Promise */

module.exports = (function () {
    'use strict';
    var //imagemagic = require('./gmUtil'),
        imagemagic = require('gm').subClass({imageMagick: true});

    function identifyPromise(cntxt) {
        return new Promise(function (resolve, reject) {
            cntxt.gmInst.identify(function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        identify: result,
                        image: cntxt.selfIF
                    });
                }
            });
        });
    }

    function rotate(cntxt, degrees) {
        cntxt.gmInst.rotate('green', degrees);
        return cntxt.selfIF;
    }
    function resize(cntxt, width , height) {
        cntxt.gmInst.resize(width , height);
        return cntxt.selfIF;
    }
    function toBufferPromise(cntxt) {
        return new Promise(function (resolve, reject) {
            cntxt.gmInst.toBuffer('JPEG',function (err, buffer) {
                if (err) {
                    reject(err);
                } else {
                    resolve(buffer);
                }
            });
        });
    }

    function genImage(data) {
        // data: Buffer
        var cntxt = {
            gmInst: imagemagic(data)
        };

        return cntxt.selfIF = {
            rotate: rotate.bind(null, cntxt),
            resize: resize.bind(null, cntxt),
            toBufferPromise: toBufferPromise.bind(null, cntxt),
            identifyPromise: identifyPromise.bind(null, cntxt)
        };
    }

    return {
        genImage: genImage
    };
}());

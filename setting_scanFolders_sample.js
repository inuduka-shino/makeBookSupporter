/*jslint node: true, indent: 4 */
/* global module */

module.exports = (function () {
    'use strict';
    return {
        basePath: '.....',
        grayFolder: {
            prefix: 'PN',
            path: '_',
            filePattern: /PN[0-9A-Za-z\-_]+\.jpg/
        },
        colorSF: {
            path: 'Color-S',
            filePattern: /PC[0-9A-Za-z\-_]+\.jpg/
        },
        jacket: {
            path: 'work',
            frontPrefix: 'PAA',
            prefix: 'PAB'
        },
        innercover: {
            path: 'work',
            prefix: 'PAD'
        },
        bandF: {
            path: 'Color-E',
            filePattern: /PE[0-9A-Za-z\-_]+\.jpg/
        },
        band: {
            path: 'work',
            prefix: 'PAC'
        }

    };
}());

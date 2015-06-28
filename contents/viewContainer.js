/*jslint indent: 4 */
/*global define */
define(['jquery'], function ($) {
    'use strict';
    var containers = (function () {
            var $containers = {};
            function add(code, $container) {
                $containers[code] = $container;
            }
            function forEach(callback) {
                var code;
                for (code in $containers) {
                    if ($containers.hasOwnProperty(code)) {
                        if (callback(code, $containers[code]) === false) {
                            break;
                        }
                    }
                }
            }

            return {
                add: add,
                forEach: forEach
            };
        }());


    function change(containerName) {
        containers.forEach(function (codeName, $cntnr) {
            if (codeName === containerName) {
                $cntnr.show();
            } else {
                $cntnr.hide();
            }
        });
    }

    (function () {
        containers.add('folderList', $('div#mbs-container-folderList'));
        containers.add('fileList', $('div#mbs-container-fileList'));
    }());

    return {
        change: change
    };
});

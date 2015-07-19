/*jslint indent: 4 */
/*global define */
define(['jquery'], function ($) {
    'use strict';
    var containers = (function () {
            var $containers = {},
                options = {};

            function add(code, $container, option) {
                $containers[code] = $container;
                options[code] = {
                    changable: (option === undefined) ?
                            undefined : option.changable
                };
            }
            function forEach(callback, opt) {
                var code,
                    changableModde = (opt === undefined) ?
                            undefined : opt.changable;
                for (code in $containers) {
                    if ($containers.hasOwnProperty(code)) {
                        if (changableModde === true &&
                                options[code].changable !== true) {
                            continue;
                        }
                        if (callback(code, $containers[code]) === false) {
                            break;
                        }
                    }
                }
            }
            function get(code) {
                return $containers[code];
            }

            return {
                add: add,
                forEach: forEach,
                get: get
            };
        }());


    function change(containerName) {
        containers.forEach(function (codeName, $cntnr) {
            if (codeName === containerName) {
                $cntnr.show();
            } else {
                $cntnr.hide();
            }
        }, {
            changable: true
        });
    }
    function hide(containerName) {
        containers.get(containerName).hide();
    }

    (function () {
        containers.add('loading', $('div#mbs-container-loading'));
        containers.add('folderList', $('div#mbs-container-folderList'), {
            changable: true
        });
        containers.add('fileList', $('div#mbs-container-fileList'), {
            changable: true
        });
    }());

    return {
        change: change,
        hide: hide
    };
});

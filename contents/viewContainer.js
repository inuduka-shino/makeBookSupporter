/*jslint indent: 4 */
/*global $, md */
md('viewContainer', function () {
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

    $(function () {
        containers.add('folderList', $('div#mbs-container-folderList'));
        containers.add('fileList', $('div#mbs-container-fileList'));
    });

    function change(containerName) {
        containers.forEach(function (codeName, $cntnr) {
            if (codeName === containerName) {
                $cntnr.show();
            } else {
                $cntnr.hide();
            }
        });
    }

    return {
        change: change
    };
});
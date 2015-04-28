/*jslint indent: 4 */
/*global md, $ */
md('jsonCall', function () {
    'use strict';
    function jsonCall(url, param) {
        var jqXHR;
        jqXHR = $.ajax({
            type: 'POST',
            url: url,

            contentType: 'application/json',
            data: JSON.stringify(param),

            dataType: 'json',
        });
        return jqXHR;
    }

    function requestGenBKL(count) {
        return jsonCall(
            'mbs/api/genBKL',
            {
                count: count
            }
        );
    }
    function compUndefined(a, b) {
        if (a === undefined) {
            if (b === undefined) {
                return 0;
            }
            return 1;
        }
        if (b === undefined) {
            return -1;
        }
        if (a === b) {
            return 0;
        }
        if (typeof a === 'boolean' && typeof b === 'boolean') {
            return (a < b) ? 1 : -1;
        }
        return (a > b) ? 1 : -1;
    }

    function queryBookFolders() {
        return jsonCall(
            'mbs/api/queryBookFolders'
        ).then(function (response) {
            response.folders = response.folders.sort(function (a, b) {
                var cmpXinfo = compUndefined(a.isXinfo, b.isXinfo),
                    cmpFolder;

                if (cmpXinfo !== 0) {
                    return cmpXinfo;
                }
                cmpFolder = compUndefined(a.isFolder, b.isFolder);
                if (cmpFolder !== 0) {
                    return cmpFolder;
                }
                if (a.name === b.name) {
                    return 0;
                }
                return (a.name > b.name) ? 1 : -1;

            });
            return response;
        });
    }

    function queryJpgFiles(foldername) {
        return jsonCall(
            'mbs/api/queryJpgFiles',
            {
                name: foldername
            }
        );
    }
    return {
        requestGenBKL: requestGenBKL,
        queryBookFolders: queryBookFolders,
        queryJpgFiles: queryJpgFiles
    };
});

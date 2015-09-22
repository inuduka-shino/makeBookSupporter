/*jslint indent: 4 */
/*global define, Promise */
define(['jquery'], function ($) {
    'use strict';
    function jsonCall(url, param) {
        var jqXHR;
        jqXHR = $.ajax({
            type: 'POST',
            url: url,

            contentType: 'application/json',
            data: JSON.stringify(param),

            dataType: 'json'
        });
        return jqXHR;
    }
    function jsonCallPromise(url, param) {
        return new Promise(function (resolve, reject) {
            try {
                jsonCall(url, param)
                    .done(function (response) {
                        resolve(response);
                    })
                    .fail(function (response) {
                        reject(response);
                    });
            } catch (err) {
                reject(err);
            }
        });
    }

    function loadSetting() {
        return jsonCall(
            'api/setting'
        );
    }

    function requestGenBKL(count) {
        return jsonCall(
            'api/genBKL',
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
            'api/queryBookFolders'
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
            'api/queryJpgFiles',
            {
                name: foldername
            }
        );
    }
    function checkZipFile(foldername) {
        return jsonCall(
            'api/checkZipFile',
            {
                foldername: foldername
            }
        ).then(function (response) {
            // return zipfile makable flag
            var zipFileExists = response.zipCheck.exists;
            if (zipFileExists === 'no') {
                return true;
            }
            return false;
        });
    }
    function makeZipFile(foldername, files) {
        return jsonCall(
            'api/makeZipFile',
            {
                foldername: foldername,
                files: files
            }
        );
    }
    function queryScanFolders(categoryType) {
        return jsonCallPromise(
            'api/queryScanFolders',
            {
                categoryType: categoryType
            }
        );
    }

    function queryOneBandFile(start) {
        if (start === undefined) {
            start = 0;
        }
        return jsonCallPromise(
            'api/queryOneBandFile',
            {
                start: start
            }
        );
    }
    function requestMoveGrayJpg(foldername) {
        return jsonCallPromise(
            'api/requestMoveGrayJpg',
            {
                foldername: foldername
            }
        );
    }
    function requestMoveJacketFiles() {
        return jsonCallPromise(
            'api/requestMoveJacketFiles'

        );
    }
    function requestMoveInnerCoverFiles() {
        return jsonCallPromise(
            'api/requestMoveInnerCoverFiles'

        );
    }
    function requestMoveBandFiles() {
        return jsonCallPromise(
            'api/requestMoveBandFiles'
        );
    }
    function requestMoveFilesFromScanFolders(fileinfo) {
        return jsonCallPromise(
            'api/requestMoveFilesFromScanFolders',
            fileinfo
        );
    }

    return {
        loadSetting: loadSetting,
        requestGenBKL: requestGenBKL,
        queryBookFolders: queryBookFolders,
        queryJpgFiles: queryJpgFiles,
        checkZipFile: checkZipFile,
        makeZipFile: makeZipFile,
        queryScanFolders: queryScanFolders,
        queryOneBandFile: queryOneBandFile,
        requestMoveGrayJpg: requestMoveGrayJpg,
        requestMoveJacketFiles: requestMoveJacketFiles,
        requestMoveInnerCoverFiles: requestMoveInnerCoverFiles,
        requestMoveBandFiles: requestMoveBandFiles,
        requestMoveFilesFromScanFolders: requestMoveFilesFromScanFolders

    };
});

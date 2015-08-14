/*jslint indent: 4, es5: true */
/*global define, console, Promise, window, $ */
define([
    'viewScanFolders',
    'jsonCall'
], function (viewScanFolders, jsonCall) {
    'use strict';

    function recount() {
        var allCategory = [
            'gray', 'colorSF', 'colorMF', 'band'
        ];
        jsonCall.queryScanFolders().then(function (info) {
            allCategory.forEach(function (category) {
                viewScanFolders.setBadgeCount(category, info[category]);
            });
        });
    }

    function refleshBandFolder() {
        jsonCall.queryOneBandFile().then(function (info) {
            //console.dir(info);
            viewScanFolders.bandCtrl.setImage(info);
        });
    }

    // カラー片面　パネル
    (function () {
        var colorSFCtrl = viewScanFolders.colorSFCtrl,
            requestMoveJacketFiles = jsonCall.requestMoveJacketFiles,
            requestMoveInnerCoverFiles = jsonCall.requestMoveInnerCoverFiles,
            requestMoveBandFiles =  jsonCall.requestMoveBandFiles;

        colorSFCtrl.click(function (selectedVal) {
            return new Promise(function (resolve, reject) {
                colorSFCtrl.message();
                if (selectedVal === 'Jacket') {
                    requestMoveJacketFiles().then(function (response) {
                        resolve(response);
                        recount();
                    });
                } else if (selectedVal === 'Cover') {
                    requestMoveInnerCoverFiles().then(function (response) {
                        resolve(response);
                        recount();
                    });
                } else if (selectedVal === '帯') {
                    requestMoveBandFiles().then(function (response) {
                        resolve(response);
                        recount();
                    });
                } else {
                    colorSFCtrl.message('unkown select value:' + selectedVal);
                    reject(new Error(['bad select value [', selectedVal, ']'].join('')));
                }
            }).then(function (response) {
                if (response.status === 'NOTARGET') {
                    colorSFCtrl.message('対象ファイルがありません。');
                }
            });
        });
    }());

    // 白黒パネル
    (function () {
        var grayCtrl = viewScanFolders.grayCtrl,
            requestMoveGrayJpg = jsonCall.requestMoveGrayJpg;

        // 移動
        grayCtrl.click(function (title) {
            return new Promise(function (resolve, reject) {
                //console.log('click 移動 - ' + title);
                grayCtrl.message();
                requestMoveGrayJpg(title).then(function (response) {
                    resolve();
                    if (response.status === 'NOTARGET') {
                        grayCtrl.message('対象ファイルがありません。');
                    } else if (response.status === 'NOTMOVE') {
                        grayCtrl.message('同じカテゴリのファイルが在るためファイルは移動しませんでした。');
                    } else {
                        recount();
                    }
                }).catch(function (err) {
                    grayCtrl.message('エラー発生');
                    reject(err);
                });
            });
        });

        grayCtrl.select(function () {
            grayCtrl.message();
        });
    }());

    $(function () {
        recount();
        refleshBandFolder();
    });
});

/*jslint indent: 4, es5: true */
/*global define, console, Promise, window, $ */
define([
    'viewScanFolders',
    'jsonCall'
], function (viewScanFolders, jsonCall) {
    'use strict';
    var refleshBandFolder;

    // recount
    function recount() {
        var allCategory = [
            'gray', 'colorSF', 'colorMF', 'band'
        ];
        return jsonCall.queryScanFolders().then(function (info) {
            allCategory.forEach(function (category) {
                viewScanFolders.setBadgeCount(category, info[category]);
            });
        });
    }

    $(recount);
    viewScanFolders.tabsClick(recount);

    // refleshBandFolder
    refleshBandFolder = (function () {
        var start = 0;

        return function (offset) {
            if (offset !== undefined) {
                start += offset;
            }
            return jsonCall.queryOneBandFile(start)
                .then(function (info) {
                    if (info.index === undefined) {
                        start = 0;
                    } else {
                        start = info.index;
                    }
                    return info;
                }).then(viewScanFolders.bandCtrl.setImage);
        };
    }());

    $(function () {refleshBandFolder(); });
    viewScanFolders.bandCtrl.tabClick(refleshBandFolder);
    viewScanFolders.bandCtrl.clickPass(function () {
        refleshBandFolder(1);
    });

    viewScanFolders.bandCtrl.click(function (bookname) {
        var imageInfo = viewScanFolders.bandCtrl.getImageInfo();
        // console.log(imageInfo);
        // console.log(bookname);
        if (imageInfo.filename === null) {
            return true;
        }
        return jsonCall.requestMoveFilesFromScanFolders({
            categoryType: 'band',
            filename: imageInfo.filename,
            dir: imageInfo.dir,
            bookname: bookname
        }).then(function () {
            recount();
            return refleshBandFolder();
        });
    });

    // カラー片面　パネル
    (function () {
        var colorSFCtrl = viewScanFolders.colorSFCtrl,
            requestMoveJacketFiles = jsonCall.requestMoveJacketFiles,
            requestMoveInnerCoverFiles = jsonCall.requestMoveInnerCoverFiles;

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
            grayCtrl.message('ファイル移動中:' + title);
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
                        grayCtrl.message('ファイル移動終了:' + title);
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

});

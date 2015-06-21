/*jslint indent: 4 */
/*global require, console */
require([
    'jquery',
    'jsonCall',
    'categoryManager',
    'viewCtrl',
    'bootstrap'
], function (
    $,
    jsonCall,
    categoryManager,
    viewCtrl
) {
    'use strict';
    var queryBookFolders = jsonCall.queryBookFolders,
        requestGenBKL = jsonCall.requestGenBKL,
        queryJpgFiles = jsonCall.queryJpgFiles,
        checkZipFile = jsonCall.checkZipFile,
        requestMakeZipFile = jsonCall.makeZipFile,

        viewContainer = viewCtrl.viewContainer,
        viewBKLog = viewCtrl.viewBKLog,
        viewBookFolder = viewCtrl.viewBookFolder,
        viewFilePanel = viewCtrl.viewFilePanel,
        viewFileList = viewCtrl.viewFileList,
        viewCategoryList = viewCtrl.viewCategoryList,
        viewFileListButton = viewCtrl.viewFileListButton,

        genCategoryManager = categoryManager.genCategoryManager,
        categoryDict = categoryManager.categoryDict,

        currentSelectedFileInfo;


    // category
    function makeCategorysInfo(categorySet) {
        var codeList = categorySet.getCategoryCodeList();

        return codeList.map(function (catCode) {
            var ctg = categorySet.getCategory(catCode),
                ctgInfo = categoryDict(catCode);
            return {
                count: ctg.count(),
                files: ctg.files(),
                name: ctgInfo.name,
                extClass: ctgInfo.extClass
            };
        });

    }

    // BookFolderクリック
    function clickFolderHandler(fileInfo) {
        var foldername = fileInfo.name;
        // load files info
        queryJpgFiles(foldername).done(function (response) {
            var categorySet = genCategoryManager(response.files);

            currentSelectedFileInfo = {
                name: fileInfo.name,
                type: fileInfo.type,
                files: response.files.map(function (fileInfo) {
                    return fileInfo.name;
                })
            };

            viewCategoryList.setCategorys(
                makeCategorysInfo(categorySet),
                function (ctgInfo) {
                    viewFileList.setFiles(ctgInfo.files);
                }
            );
        });

        // query zipFile status
        checkZipFile(foldername).done(function (zipFileMakable) {
            if (zipFileMakable) {
                viewFileListButton.zipBtnCtrl.enable();
            } else {
                viewFileListButton.zipBtnCtrl.disable();
            }
        });

        // fileList panel 初期化
        // TODO loading... message
        viewFilePanel.setTitle(fileInfo);
        viewFileList.clearFiles();
        viewContainer.change('fileList');
    }
    // BookFolder情報取得＆描画
    function redrawFolderView() {
        queryBookFolders().done(function (response) {
            viewBookFolder.clear();
            response.folders.forEach(function (folder) {
                var fileInfo = {
                        name: folder.name
                    };
                if (folder.isXinfo) {
                    fileInfo.type = "bookFolder";
                } else if (folder.isFolder) {
                    fileInfo.type = "folder";
                } else {
                    fileInfo.type = "file";
                }
                viewBookFolder.add(fileInfo, clickFolderHandler.bind(null, fileInfo));
            });
        });
    }

    // 初期表示
    (function () {
        viewContainer.change('folderList');
        redrawFolderView();
    }());

    // ファイルリスト　戻るボタン
    viewFileListButton.backBtnCtrl.click(function () {
        currentSelectedFileInfo = undefined;
        redrawFolderView();
        viewContainer.change('folderList');
    });
    // ファイルリスト　zipボタン
    viewFileListButton.zipBtnCtrl.click(function () {
        var dfr = $.Deferred(),
            name = currentSelectedFileInfo.name,
            files = currentSelectedFileInfo.files;
        requestMakeZipFile(name, files).done(function (response) {
            dfr.resolve();
            if (response.result.makeZipFileStatus === 'ok') {
                viewFileListButton.zipBtnCtrl.disable();
            }
        });
        return dfr.promise();
    });

    // 再描画ボタンクリック
    viewBKLog.redrawCtrl.click.progress(function () {
        redrawFolderView();
    });

    // 生成ボタンクリック
    viewBKLog.progress(function (count) {
        var req;
        console.log('count=' + count);
        req = requestGenBKL(count);
        req.done(function () {
            redrawFolderView();
        });
    });

});

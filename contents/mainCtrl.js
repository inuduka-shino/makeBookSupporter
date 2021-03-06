/*jslint indent: 4, es5: true */
/*global require, console, Promise */
require([
    'jquery',
    'jsonCall',
    'categoryManager',
    'viewCtrl',
    'bootstrap',
    'ctrlScanfolders'
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
        scanFolderBooklilst = viewCtrl.viewScanFolders.booklist,
        //grayCtrl = viewCtrl.viewScanFolders.grayCtrl,

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
                }),
                folderItem: fileInfo.selfIF
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
        viewFilePanel.setTitle(fileInfo);
        viewFileList.clearFiles();
        viewContainer.change('fileList');
    }

    function clickZipBtnHandler(fileInfo) {
        console.log('clickZipBtnHandler');
        console.log(fileInfo);
        /*
        requestMakeZipFile(name, files).done(function (response) {
            if (response.result.makeZipFileStatus === 'ok') {
                viewFileListButton.zipBtnCtrl.disable();
                // zip後のbehavior
                // zipbutton disable
                console.log('ziped.');
            }
        });
        */

    }

    function zipFileBasename(filename) {
        /*jslint regexp: true */
        var zipFilePattern = /(.*)\.zip$/;
        /*jslint regexp: true*/

        if (zipFilePattern.test(filename)) {
            return RegExp.$1;
        }
        return undefined;
    }

    // BookFolder情報取得＆描画
    function redrawFolderView() {
        return Promise.resolve(queryBookFolders()).then(function (response) {
            var folderItems = {},
                sfBooklist = scanFolderBooklilst();

            viewBookFolder.clear();
            //grayCtrl.clearOption();
            response.folders.forEach(function (folder) {
                var foldername = folder.name,
                    fileInfo = {
                        name: foldername
                    },
                    zfBasename;

                if (folder.isXinfo) {
                    fileInfo.type = "bookFolder";
                    sfBooklist.add(foldername);
                } else if (folder.isFolder) {
                    fileInfo.type = "folder";
                } else {
                    fileInfo.type = "file";
                    zfBasename = zipFileBasename(foldername);
                }

                if ((zfBasename !== undefined) &&
                        (folderItems[zfBasename] !== undefined)) {
                    folderItems[zfBasename].zipped();
                } else {
                    folderItems[foldername] = viewBookFolder.add(
                        fileInfo,
                        clickFolderHandler.bind(null, fileInfo),
                        clickZipBtnHandler.bind(null, fileInfo)
                    );
                }

            });
            sfBooklist.close();
        });
    }

    // 初期表示
    (function () {
        redrawFolderView().then(function () {
            viewContainer.change('folderList');
            viewContainer.show('scanFolder');
            viewContainer.hide('loading');
        });
    }());

    // ファイルリスト　戻るボタン
    viewFileListButton.backBtnCtrl.click(function () {
        currentSelectedFileInfo = undefined;
        //redrawFolderView();
        viewContainer.change('folderList');
    });
    // ファイルリスト　zipボタン
    viewFileListButton.zipBtnCtrl.click(function () {
        var dfr = $.Deferred(),
            name = currentSelectedFileInfo.name,
            files = currentSelectedFileInfo.files,
            folderItem = currentSelectedFileInfo.folderItem;

        viewFileListButton.zipBtnCtrl.disable();
        folderItem.zipping();
        requestMakeZipFile(name, files).done(function (response) {
            dfr.resolve();
            if (response.result.makeZipFileStatus === 'ok') {
                folderItem.zipping('END');
            } else {
                viewFileListButton.zipBtnCtrl.enable();
                folderItem.hide();
            }
        });
        return dfr.promise();
    });

    // 再描画ボタンクリック
    viewBKLog.setRedrawBtnClikcCB(redrawFolderView);

    // 生成ボタンクリック
    viewBKLog.setGenBKLBtnClickCB(function (count) {
        var req;
        console.log('count=' + count);
        req = requestGenBKL(count);
        req.done(function () {
            redrawFolderView();
        });
    });

});

/*jslint indent: 4, regexp: true */
/*global md, $ */
md(function (modules) {
    'use strict';
    var queryBookFolders = modules.jsonCall.queryBookFolders,
        requestGenBKL = modules.jsonCall.requestGenBKL,
        queryJpgFiles = modules.jsonCall.queryJpgFiles,
        checkZipFile = modules.jsonCall.checkZipFile,
        requestMakeZipFile = modules.jsonCall.makeZipFile,

        viewContainer = modules.viewContainer,
        viewBKLog = modules.viewBKLog,
        viewBookFolder = modules.viewBookFolder,
        viewFilePanel = modules.viewFilePanel,
        viewFileList = modules.viewFileList,
        viewCategoryList = modules.viewCategoryList,
        viewFileListButton = modules.viewFileListButton,

        genCategoryManager = modules.categoryManager.genCategoryManager,
        categoryDict = modules.categoryManager.categoryDict,

        currentSelectedFileInfo;


    // category情報
    function makeCategorysInfo(categorySet) {
        var codeList = categorySet.getCategoryCodeList();

        return codeList.map(function (catCode) {
            var ctg = categorySet.getCategory(catCode),
                ctgInfo = categoryDict(catCode);
            return {
                count: ctg.count(),
                files: ctg.files(),
                name: ctgInfo.name,
                extClass: ctgInfo.extClass,
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

    function zipFileBasename(filename) {
        if (/(.*)\.zip$/.test(filename)) {
            return RegExp.$1;
        }
        return undefined;
    }

    // BookFolder情報取得＆描画
    function redrawFolderView() {
        queryBookFolders().done(function (response) {
            var folderItems = {};
            viewBookFolder.clear();
            response.folders.forEach(function (folder) {
                var foldername = folder.name,
                    fileInfo = {
                        name: foldername
                    },
                    zfBasename;
                if (folder.isXinfo) {
                    fileInfo.type = "bookFolder";
                } else if (folder.isFolder) {
                    fileInfo.type = "folder";
                } else {
                    fileInfo.type = "file";
                    zfBasename = zipFileBasename(foldername);
                }

                if ((zfBasename !== undefined) &&
                        (folderItems[zfBasename] !== undefined)) {
                    folderItems[zfBasename].existZip();
                } else {
                    folderItems[foldername] = viewBookFolder.add(
                        fileInfo,
                        clickFolderHandler.bind(null, fileInfo)
                    );
                }

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


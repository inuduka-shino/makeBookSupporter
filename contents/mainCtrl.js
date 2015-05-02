/*jslint indent: 4 */
/*global md, $ */
md(function (modules) {
    'use strict';
    var queryBookFolders = modules.jsonCall.queryBookFolders,
        requestGenBKL = modules.jsonCall.requestGenBKL,
        queryJpgFiles = modules.jsonCall.queryJpgFiles,
        checkZipFile = modules.jsonCall.checkZipFile,

        viewContainer = modules.viewContainer,
        viewBKLog = modules.viewBKLog,
        viewBookFolder = modules.viewBookFolder,
        viewFilePanel = modules.viewFilePanel,
        viewFileList = modules.viewFileList,
        viewCategoryList = modules.viewCategoryList,
        viewZipButton = modules.viewZipButton,

        genCategoryManager = modules.categoryManager.genCategoryManager,
        categoryDict = modules.categoryManager.categoryDict;



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
                viewZipButton.enable();
            }
        });

        // fileList panel 初期化
        // TODO loading... message
        viewFilePanel.setTitle(fileInfo);
        viewZipButton.reset();
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


    // ファイルリスト　戻るボタン
    viewFileList.clickBack(function () {
        viewContainer.change('folderList');
    });
    // ファイルリスト　zipボタン
    viewZipButton.click(function () {
        var dfr = $.Deferred();
        //dfr.resolve();
        return dfr.promise();
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

    // 初期表示
    $(function () {
        viewContainer.change('folderList');
        redrawFolderView();
    });
});


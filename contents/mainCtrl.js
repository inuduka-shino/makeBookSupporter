/*jslint indent: 4 */
/*global md */
md(function (modules) {
    'use strict';
    var queryBookFolders = modules.jsonCall.queryBookFolders,
        requestGenBKL = modules.jsonCall.requestGenBKL,
        queryJpgFiles = modules.jsonCall.queryJpgFiles,

        genBKLCtrl = modules.genBKLCtrl,
        folderListCtrl = modules.folderListCtrl,
        fileListCtrl = modules.fileListCtrl,
        categoryListCtrl = modules.categoryListCtrl,

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
        // load files info
        queryJpgFiles(fileInfo.name).done(function (response) {
            var categorySet = genCategoryManager(response.files);

            categoryListCtrl.setCategorys(
                makeCategorysInfo(categorySet),
                function (ctgInfo) {
                    fileListCtrl.setFiles(ctgInfo.files);
                }
            );
            /*
            categoryListCtrl.clickCategoryItem();
            */
        });

        // TODO loading... message
        genBKLCtrl.hide();
        folderListCtrl.hide();
        fileListCtrl.show(fileInfo);
    }

    // BookFolder情報取得＆描画
    queryBookFolders().done(function (response) {
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
            folderListCtrl.add(fileInfo, clickFolderHandler.bind(null, fileInfo));
        });
    });

    // ファイルリスト　戻る　ボタン
    fileListCtrl.clickBack(function () {
        fileListCtrl.hide();
        genBKLCtrl.show();
        folderListCtrl.show();
    });

    // 生成ボタンクリック
    modules.genBKLCtrl.progress(function (count) {
        var req;
        console.log('count=' + count);
        req = requestGenBKL(count);
        req.done(function () {
            console.log('create gen BK list.');
        });
    });

});


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
        getCategoryName = modules.categoryManager.getCategoryName;

    function makeCategorysInfo(categorySet) {
        var codeList = categorySet.getCategoryCodeList();

        return codeList.map(function (catCode) {
            return {
                name: getCategoryName(catCode),
                count: 0
            };
        });

    }

    // BookFolderクリック
    function clickFolderHandler(fileInfo) {
        //console.log(folder.name);
        genBKLCtrl.hide();
        folderListCtrl.hide();
        fileListCtrl.show(fileInfo);

        queryJpgFiles(fileInfo.name).done(function (response) {
            var categorySet = genCategoryManager(response.files);

            categoryListCtrl.setCategorys(makeCategorysInfo(categorySet));
            fileListCtrl.setFiles(response.files);
        });
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


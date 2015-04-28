/*jslint indent: 4 */
/*global md */
md(function (modules) {
    'use strict';
    var queryBookFolders = modules.jsonCall.queryBookFolders,
        requestGenBKL = modules.jsonCall.requestGenBKL,
        queryJpgFiles = modules.jsonCall.queryJpgFiles,
        genBKLCtrl = modules.genBKLCtrl,
        folderListCtrl = modules.folderListCtrl,
        fileListCtrl = modules.fileListCtrl;

    function clickFolderHandler(fileInfo) {
        //console.log(folder.name);
        genBKLCtrl.hide();
        folderListCtrl.hide();
        fileListCtrl.show(fileInfo);
        queryJpgFiles(fileInfo.name).done(function (response) {
            fileListCtrl.addFiles(response.files);
        });
    }

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

    fileListCtrl.clickBack(function () {
        fileListCtrl.hide();
        genBKLCtrl.show();
        folderListCtrl.show();
    });

    modules.genBKLCtrl.progress(function (count) {
        var req;
        console.log('count=' + count);
        req = requestGenBKL(count);
        req.done(function () {
            console.log('create gen BK list.');
        });
    });

});


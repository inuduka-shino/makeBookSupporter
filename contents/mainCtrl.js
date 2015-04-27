/*jslint indent: 4 */
/*global md */
md(function (modules) {
    'use strict';
    var queryBookFolders = modules.jsonCall.queryBookFolders,
        requestGenBKL = modules.jsonCall.requestGenBKL,
        fileListCtrl = modules.fileListCtrl;

    modules.genBKLCtrl.progress(function (count) {
        var req;
        console.log('count=' + count);
        req = requestGenBKL(count);
        req.done(function () {
            console.log('create gen BK list.');
        });
    });

    queryBookFolders().done(function (response) {
        //console.log('queryBookFolders.');

        //fileListCtrl.add('test');
        //fileListCtrl.add('テスト', 'gray');
        response.folders.forEach(function (folder) {
            fileListCtrl.add(folder.name);
        });

    });
});


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

    function compUndefined(a, b) {
        if (a === undefined) {
            if (b === undefined) {
                return 0;
            }
            return 1;
        }
        if (b === undefined) {
            return -1;
        }
        if (a === b) {
            return 0;
        }
        if (typeof a === 'boolean' && typeof b === 'boolean') {
            return (a < b) ? 1 : -1;
        }
        return (a > b) ? 1 : -1;
    }
    queryBookFolders().done(function (response) {
        //console.log('queryBookFolders.');

        //fileListCtrl.add('test');
        //fileListCtrl.add('テスト', 'gray');
        response.folders.sort(function (a, b) {
            var cmpXinfo = compUndefined(a.isXinfo, b.isXinfo),
                cmpFolder;

            if (cmpXinfo !== 0) {
                return cmpXinfo;
            }
            cmpFolder = compUndefined(a.isFolder, b.isFolder);
            if (cmpFolder !== 0) {
                return cmpFolder;
            }
            if (a.name === b.name) {
                return 0;
            }
            return (a.name > b.name) ? 1 : -1;

        }).forEach(function (folder) {
            var type;
            if (folder.isXinfo) {
                type = "bookFolder";
            } else if (folder.isFolder) {
                type = "folder";
            } else {
                type = "file";
            }
            fileListCtrl.add({
                name: folder.name,
                type: type,
            });
        });

    });
});


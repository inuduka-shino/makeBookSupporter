/*jslint indent: 4 */
/*global $, md */
md('categoryManager', function () {
    'use strict';
    var categoryDict,
        jpgFilePattern,
        getCategory,
        genCategoryManager;

    categoryDict = {
        'unknown': {
            priority: 10,
            name: 'Unknown',
            extClass: 'list-group-item-warning'
        },
        'front':  {
            priority: 200,
            name: '前付'
        },
        'frontispiece':  {
            priority: 300,
            name: '口絵'
        },
        'eyecatch':  {
            priority: 400,
            name: 'アイキャッチ'
        },
        'colorbody':  {
            priority: 530,
            name: 'カラー'
        },
        'body':  {
            priority: 550,
            name: '本文'
        },
        'back':  {
            priority: 600,
            name: '後付'
        },
        'supplement':  {
            priority: 700,
            name: '付録'
        },
        'info': {
            priority: 900,
            name: 'information file(xinfo.txt)'
        }
    };
    jpgFilePattern = /^P([A-Z])([A-Za-z]?)([0-9]{3}|)(\w*)\.jpg$/;
    function categoryRule(name) {
        var parse,
            pageType;
        if (name === 'xinfo.txt') {
            return 'info';
        }
        parse = jpgFilePattern.exec(name);
        if (parse !== null) {
            pageType = parse[1];
            if (pageType >= 'A' && pageType <= 'J') {
                return 'front';
            }
            if (pageType === 'K') {
                return 'frontispiece';
            }
            if (pageType === 'L') {
                return 'eyecatch';
            }
            if (pageType === 'M') {
                return 'colorbody';
            }
            if (pageType === 'N') {
                return 'body';
            }
            if (pageType >= 'O' && pageType <= 'Q') {
                return 'back';
            }
            if (pageType >= 'R' && pageType <= 'Z') {
                return 'supplement';
            }
        }


        return 'unknown';
    }

    getCategory = (function () {
        function ctgForEach(ctgSelf, handler) {
            ctgSelf.pool.forEach(handler);
        }

        function ctgCount(ctgSelf) {
            return ctgSelf.pool.length;
        }
        function ctgFiles(ctgSelf) {
            return ctgSelf.pool;
        }

        return function (ctgmSelf, catCode) {
            var pool = ctgmSelf.categoryPool[catCode],
                ctgSelf = {
                    code: catCode,
                    super: ctgmSelf,
                    pool: pool
                };


            return {
                count: ctgCount.bind(null, ctgSelf),
                files: ctgFiles.bind(null, ctgSelf),
                forEach: ctgForEach.bind(null, ctgSelf)
            };
        };
    }());

    genCategoryManager = (function () {
        function checkCategoryList(ctgmSelf) {
            var categoryPool = ctgmSelf.categoryPool,
                code,
                codeArray;
            if (ctgmSelf.categoryList !== undefined) {
                return;
            }

            codeArray = [];
            for (code in categoryPool) {
                if (categoryPool.hasOwnProperty(code)) {
                    codeArray.push(code);
                }
            }
            ctgmSelf.categoryList = codeArray.sort(function (a, b) {
                var ctgDictA,
                    ctgDictB;
                if (a === b) {
                    return 0;
                }
                ctgDictA = categoryDict[a];
                ctgDictB = categoryDict[b];
                return (ctgDictA.priority > ctgDictB.priority) ? 1 : -1;
            });
        }
        function addFileInfo(ctgmSelf, fileInfo) {
            var catCode = categoryRule(fileInfo.name),
                pool = ctgmSelf.categoryPool[catCode];

            if (pool === undefined) {
                //ctgmSelf.categoryList.push(catCode);
                pool = ctgmSelf.categoryPool[catCode] = [];
            }
            pool.push(fileInfo);
        }
        function addFileInfos(ctgmSelf, fileInfoList) {
            fileInfoList.forEach(function (fileInfo) {
                addFileInfo(ctgmSelf, fileInfo);
            });
        }


        function getCategoryCodeList(ctgmSelf) {
            checkCategoryList(ctgmSelf);
            return ctgmSelf.categoryList;
        }

        function init() {
            var ctgmSelf = {
                    categoryPool: {},
                    categoryList: undefined
                };
            return {
                addFileInfos: addFileInfos.bind(null, ctgmSelf),
                getCategoryCodeList: getCategoryCodeList.bind(null, ctgmSelf),
                getCategory: getCategory.bind(null, ctgmSelf),
            };
        }

        return function (fileInfoList) {
            var cat = init();
            cat.addFileInfos(fileInfoList);
            return cat;
        };

    }());

    return {
        genCategoryManager: genCategoryManager,
        categoryDict: function (catCode) {
            return categoryDict[catCode];
        }
    };
});

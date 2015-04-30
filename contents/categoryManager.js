/*jslint indent: 4 */
/*global $, md */
md('categoryManager', function () {
    'use strict';
    var categoryDict,
        getCategory,
        genCategoryManager;

    categoryDict = {
        'info': {
            priority: 900,
            name: 'information file(xinfo.txt)'
        },
        'unknown': {
            priority: 999,
            name: 'Unknown'
        }
    };

    function categoryRule(name) {
        if (name === 'xinfo.txt') {
            return 'info';
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

        return function (ctgmSelf, catCode) {
            var pool = ctgmSelf.categoryPool[catCode],
                ctgSelf = {
                    code: catCode,
                    super: ctgmSelf,
                    pool: pool
                };


            return {
                forEach: ctgForEach.bind(null, ctgSelf),
                count: ctgCount.bind(null, ctgSelf),
                name: function () {
                    return categoryDict[catCode].name;
                }
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
        genCategoryManager: genCategoryManager
        //getCategoryName: function (catCode) {
        //    return categoryDict[catCode].name;
        //}
    };
});

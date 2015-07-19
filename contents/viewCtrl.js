/*jslint indent: 4 */
/*global define */
define([
    'viewContainer',
    'viewBKLog',
    'viewBookFolder',
    'viewFilePanel',
    'viewFileList',
    'viewCategoryList',
    'viewFileListButton'
], function (
    viewContainer,
    viewBKLog,
    viewBookFolder,
    viewFilePanel,
    viewFileList,
    viewCategoryList,
    viewFileListButton

) {
    'use strict';
    return {
        viewContainer:  viewContainer,
        viewBKLog:  viewBKLog,
        viewBookFolder: viewBookFolder,
        viewFilePanel:  viewFilePanel,
        viewFileList:   viewFileList,
        viewCategoryList:   viewCategoryList,
        viewFileListButton: viewFileListButton
    };
});

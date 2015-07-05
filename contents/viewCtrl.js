/*jslint indent: 4 */
/*global define */
define([
    'viewContainer',
    'viewBKLog',
    'viewBookFolder',
    'viewFilePanel',
    'viewFileList',
    'viewCategoryList',
    'viewFileListButton',
    'viewLoading'
], function (
    viewContainer,
    viewBKLog,
    viewBookFolder,
    viewFilePanel,
    viewFileList,
    viewCategoryList,
    viewFileListButton,
    viewLoading

) {
    'use strict';
    return {
        viewContainer:  viewContainer,
        viewBKLog:  viewBKLog,
        viewBookFolder: viewBookFolder,
        viewFilePanel:  viewFilePanel,
        viewFileList:   viewFileList,
        viewCategoryList:   viewCategoryList,
        viewFileListButton: viewFileListButton,
        viewLoading: viewLoading
    };
});

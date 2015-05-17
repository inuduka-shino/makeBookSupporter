/*jslint indent: 4 */
/*global $, md */
md('viewCategoryList', function () {
    'use strict';
    var
        $panel = $('div.panel.mbs-file-list-ctrl'),
        $categoryList = $('template#categoryItemTemplate', $panel),
        $template = $($categoryList.html()),
        $listBox = $categoryList.parent();

    function genClickHandler(clickUserHandler) {
        return function (ctgInfo) {
            clickUserHandler(ctgInfo);
            return false;
        };
    }

    function setCategorys(ctgInfoList, clickUserHandler) {
        var clickHandler = genClickHandler(clickUserHandler);
        $listBox.empty();
        ctgInfoList.forEach(function (ctgInfo) {
            var $item = $template.clone();

            $('span.categoryName', $item).text(ctgInfo.name);
            $('span.mbs-ctg-file-count', $item).text(ctgInfo.count);
            if (ctgInfo.extClass !== undefined) {
                $item.addClass(ctgInfo.extClass);
            }
            $item.on('click', clickHandler.bind(null, ctgInfo));
            $listBox.append($item);
        });
    }


    return {
        setCategorys: setCategorys
    };

});

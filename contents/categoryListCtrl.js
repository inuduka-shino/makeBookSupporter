/*jslint indent: 4 */
/*global $, md */
md('categoryListCtrl', function () {
    'use strict';
    var
        $panel = $('div.panel.mbs-file-list-ctrl'),
        $categoryList = $('template#categoryItemTemplate', $panel),
        $template = $($categoryList.html()),
        $listBox = $categoryList.parent();

    function setCategorys(ctgInfoList) {
        $listBox.empty();
        ctgInfoList.forEach(function (ctgInfo) {
            var $item = $template.clone();
            $('span.categoryName', $item).text(ctgInfo.name);
            $listBox.append($item);
        });

    }

    return {
        setCategorys: setCategorys
    };

});

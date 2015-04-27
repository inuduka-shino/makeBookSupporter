/*jslint indent: 4 */
/*global $, md */
md('fileListCtrl', function () {
    'use strict';
    var $fileList = $('#fileListItem'),
        $template = $($fileList.html());

    function add(name, className) {
        var $item = $template.clone(),
            $icon =  $item.children('span.glyphicon'),
            $folderName = $item.children('span.folderName');

        $folderName.text(name);
        $icon.addClass(className);
        $fileList.before($item);
    }
    return {
        add: add
    };
});

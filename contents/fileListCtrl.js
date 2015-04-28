/*jslint indent: 4 */
/*global $, md */
md('fileListCtrl', function () {
    'use strict';
    var $fileList = $('#fileListItem'),
        $template = $($fileList.html());

    function add(item) {
        var $item = $template.clone(),
            $icon =  $item.children('span.glyphicon'),
            $folderName = $item.children('span.folderName'),

            name = item.name,
            type = item.type;

        $folderName.text(name);
        if (type === 'folder' || type === 'file') {
            $icon.addClass('gray');
        }
        $fileList.before($item);
    }
    return {
        add: add
    };
});

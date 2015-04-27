/*jslint indent: 4 */
/*global $, md */
md('fileListCtrl', function () {
    'use strict';
    var fileListCtrl = (function () {
        var $fileList = $('#fileListItem'),
            $template = $($fileList.html());

        function add(name, className) {
            var $item = $template.clone(),
                $icon =  $item.children('span.glyphicon'),
                $folderName = $item.children('span.folderName');

            $folderName.text(name);
            $icon.addClass(className);
            $fileList.after($item);
        }
        return {
            add: add
        };
    }());

    fileListCtrl.add('test');
    fileListCtrl.add('テスト', 'gray');
});

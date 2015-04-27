/*jslint indent: 4 */
/*global $, md */
md('fileListCtrl', function () {
    'use strict';
    var fileListCtrl = (function () {
        var $fileList = $('#fileListItem'),
            $template = $($fileList.html());

        function add(name) {
            var $item = $template.clone(),
                $folderName = $item.children('span.folderName');

            $folderName.text(name);
            $fileList.after($item);
        }
        return {
            add: add
        };
    }());

    fileListCtrl.add('test');
    fileListCtrl.add('テスト');
});

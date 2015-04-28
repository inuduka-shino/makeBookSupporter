/*jslint indent: 4 */
/*global $, md */
md('folderListCtrl', function () {
    'use strict';
    var $panel = $('div.panel.mbs-folder-list-ctrl'),
        $folderList = $('#folderListItemTemplate'),
        $template = $($folderList.html());


    function add(info, handler) {
        var $item = $template.clone(),
            $icon =  $item.children('span.glyphicon'),
            $folderName = $item.children('span.folderName'),

            name = info.name,
            type = info.type;

        $folderName.text(name);
        if (type === 'folder' || type === 'file') {
            $icon.removeClass('golden');
        }
        if (type === 'file') {
            $icon
                .removeClass('glyphicon-folder-open')
                .addClass('glyphicon-file');
            $item.addClass('disabled');
        }
        if (handler !== undefined && type !== 'file') {
            $item.on('click', handler.bind(null, info));
        }

        $folderList.before($item);
    }
    return {
        add: add,
        hide: function () {
            $panel.hide();
        },
        show: function () {
            $panel.show();
        },
    };
});

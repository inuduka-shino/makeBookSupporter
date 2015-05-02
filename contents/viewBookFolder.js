/*jslint indent: 4 */
/*global $, md */
md('viewBookFolder', function () {
    'use strict';
    var $panel = $('div.panel.mbs-folder-list-ctrl'),
        $folderList = $('template#folderListItemTemplate', $panel),
        $template = $($folderList.html()),
        $listbox = $folderList.parent();

    function clear() {
        $listbox.empty();
    }

    function genClickHandler(clickUserHandler) {
        if (clickUserHandler === undefined) {
            return undefined;
        }
        return function (info) {
            clickUserHandler(info);
            return false;
        };
    }

    function add(info, handler) {
        var $item = $template.clone(),
            $icon =  $item.children('span.glyphicon'),
            $folderName = $item.children('span.folderName'),

            clickHandler = genClickHandler(handler),
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
        if (clickHandler !== undefined && type !== 'file') {
            $item.on('click', clickHandler.bind(null, info));
        }

        $listbox.append($item);
    }
    $(function () {
        clear();
    });

    return {
        add: add,
        clear: clear
    };
});

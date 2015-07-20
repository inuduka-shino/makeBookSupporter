/*jslint indent: 4 */
/*global define */
define(['jquery'], function ($) {
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

    function add(info, handler, zipBtnHandler) {
        var $item = $template.clone(),
            $icon =  $item.find('span.mbs-folder-icon'),
            $zipBtn =  $item.find('button.mbs-zip-btn'),
            $folderName = $item.find('span.folderName'),

            clickHandler = genClickHandler(handler),
            name = info.name,
            type = info.type;

        $folderName.text(name);
        // TODO 表示判定をmainで
        if (type === 'folder' || type === 'file') {
            $icon.removeClass('golden');
            $zipBtn.hide();
        }
        if (type === 'file') {
            $icon
                .removeClass('glyphicon-folder-open')
                .addClass('glyphicon-file');
            $item.addClass('disabled');
            $zipBtn.hide();
        }
        if (clickHandler !== undefined && type !== 'file') {
            $item.on('click', clickHandler.bind(null, info));
        }

        $zipBtn.on('click', genClickHandler(zipBtnHandler));
        $listbox.append($item);

        function disable() {
            $zipBtn.css('cursor', 'not-allowed');
            $zipBtn.addClass('mbs-disabled');
            $zipBtn.removeClass('btn-info');
            $zipBtn.addClass('btn-default');
        }

        return {
            disable: disable
        };
    }
    $(function () {
        clear();
    });

    return {
        add: add,
        clear: clear
    };
});

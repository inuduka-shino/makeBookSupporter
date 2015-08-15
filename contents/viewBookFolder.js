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
            $zipBtnTxt = $('span', $zipBtn).eq(1),
            $folderName = $item.find('span.folderName'),

            clickHandler = genClickHandler(handler),
            name = info.name,
            type = info.type,
            zippingFlag = false,
            selfIF;

        /*
        function disable() {
            $zipBtn.addClass('mbs-disabled');
            $zipBtn.removeClass('btn-info');
            $zipBtn.addClass('btn-default');
        }
        */
        function hide() {
            $zipBtn.hide();
        }
        function zipped() {
            if (zippingFlag) {
                return;
            }
            $zipBtnTxt.text('ziped');
            $zipBtn.removeClass('btn-success');
            $zipBtn.addClass('btn-info');
            $zipBtn.show();
        }
        function zipping(stat) {
            if (stat === 'END') {
                zippingFlag = false;
                zipped();
                return;
            }
            zippingFlag = true;
            $zipBtnTxt.text('zipping');
            $zipBtn.removeClass('btn-info');
            $zipBtn.addClass('btn-success');
            $zipBtn.show();
        }
        selfIF = {
            hide: hide,
            zipped: zipped,
            zipping: zipping
        };

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
            info.selfIF = selfIF;
            $item.on('click', clickHandler.bind(null, info));
        }

        $zipBtn.hide();
        $zipBtn.css('cursor', 'not-allowed');
        $zipBtn.on('click', genClickHandler(zipBtnHandler));

        $listbox.append($item);

        return selfIF;
    }
    $(function () {
        clear();
    });

    return {
        add: add,
        clear: clear
    };
});

/*jslint indent: 4 */
/*global $, md */
md('viewFilePanel', function () {
    'use strict';
    var $panel = $('div.panel.mbs-file-list-ctrl'),
        $titleIcon = $('div.panel-heading span.folderIcon', $panel),
        $title = $('div.panel-heading span.folderName', $panel);

    function setTitle(info) {
        var name = info.name,
            type = info.type;

        $title.text(name);
        if (type === 'folder' || type === 'file') {
            $titleIcon.removeClass('golden');
        } else {
            $titleIcon.addClass('golden');
        }
        if (type === 'file') {
            $titleIcon
                .removeClass('glyphicon-folder-open')
                .addClass('glyphicon-file');
        } else {
            $titleIcon
                .removeClass('glyphicon-file')
                .addClass('glyphicon-folder-open');
        }

    }

    return {
        setTitle: setTitle
    };

});

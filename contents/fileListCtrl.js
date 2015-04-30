/*jslint indent: 4 */
/*global $, md */
md('fileListCtrl', function () {
    'use strict';
    var $panel = $('div.panel.mbs-file-list-ctrl'),
        $backBtn = $('button.mbs-back-btn', $panel),
        $titleIcon = $('div.panel-heading span.folderIcon', $panel),
        $title = $('div.panel-heading span.folderName', $panel),
        $fileList = $('#fileListItemTemplate', $panel),
        $template = $($fileList.html()),
        $listBox = $fileList.parent();

  　 function addFile(fileInfo) {
        var $item = $template.clone(),
            $filename = $('span.fileName', $item);
        if (fileInfo.type === 'no data') {
            $filename.text('no data');
        } else if (fileInfo.type === 'no select') {
            $filename.text('no select');
        } else {
            $filename.text(fileInfo.name);
        }
        $listBox.append($item);
    }

    function setFiles(files) {
        $listBox.empty();
        files.forEach(function (file) {
            addFile(file);
        });
        if (files.length === 0) {
            addFile({
                type: 'no data'
            });
        }
    }

    function hide() {
        $panel.hide();
    }
    function show(info) {
        var name = info.name,
            type = info.type;

        // title部分
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

        $listBox.empty();
        addFile({
            type: 'no select'
        });
        $panel.show();
    }


    hide();

    return {
        hide: hide,
        show: show,
        clickBack: function (handler) {
            $backBtn.on('click', handler);
        },
        setFiles: setFiles
    };

});

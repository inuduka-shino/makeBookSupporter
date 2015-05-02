/*jslint indent: 4 */
/*global $, md */
md('viewFileList', function () {
    'use strict';
    var $panel = $('div.panel.mbs-file-list-ctrl'),
        $backBtn = $('button.mbs-back-btn', $panel),
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
            $item.addClass('list-group-item-info');
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
    function clearFiles() {
        $listBox.empty();
        addFile({
            type: 'no select'
        });    }

    return {
        clickBack: function (handler) {
            $backBtn.on('click', handler);
        },
        clearFiles: clearFiles,
        setFiles: setFiles
    };

});
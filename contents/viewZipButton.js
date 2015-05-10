/*jslint indent: 4 */
/*global $, md */
md('viewZipButton', function () {
    'use strict';
    var $panel = $('div.panel.mbs-file-list-ctrl'),
        $zipButton = $('button.mbs-zip-btn', $panel),
        clickNotify = $.Deferred(),

        clickProcess, //  = undefined
        enableFlag = true;

    function enable() {
        enableFlag = true;
        $zipButton.removeClass('disabled');
        $zipButton.removeClass('btn-default');
        $zipButton.addClass('btn-info');
    }
    function disable() {
        enableFlag = false;
        $zipButton.addClass('disabled');
        $zipButton.removeClass('btn-info');
        $zipButton.addClass('btn-default');
    }
    function clearClickProcess() {
        if (clickProcess !== undefined) {
            clickProcess.reject();
            clickProcess = undefined;
        }
    }
    function active() {
        $zipButton.addClass('active');
    }
    function deactive() {
        $zipButton.removeClass('active');
    }
    function rest() {
        disable();
        clearClickProcess();
        deactive();
    }
    $zipButton.on('click', function () {
        if (enableFlag && (clickProcess === undefined)) {
            active();
            clickNotify.notify();
        }
    });

    function click(handler) {
        clickNotify.progress(function () {
            clearClickProcess();
            clickProcess = $.Deferred();
            handler().done(function () {
                clickProcess.resolve();
            });
            clickProcess.done(function () {
                deactive();
            });
        });
    }

    return {
        enable: enable,
        diable: disable,
        reset: rest,
        click: click
    };

});

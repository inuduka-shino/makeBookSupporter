/*jslint indent: 4 */
/*global define */
define(['jquery'], function ($) {
    'use strict';
    var $panel = $('div.panel.mbs-file-list-ctrl'),
        zipBtnCtrl,
        backBtnCtrl,
        renumBtnCtrl,

        makeButtonCtrl;

    makeButtonCtrl = (function () {

        function enable(self) {
            var $button = self.$button;
            self.enableFlag = true;
            $button.removeClass('disabled');
            $button.removeClass('btn-default');
            $button.addClass('btn-info');
        }
        function disable(self) {
            var $button = self.$button;
            self.enableFlag = false;
            $button.addClass('disabled');
            $button.removeClass('btn-info');
            $button.addClass('btn-default');
        }

        function clearClickProcess(self) {
            if (self.clickProcess !== undefined) {
                self.clickProcess.reject();
                self.clickProcess = undefined;
            }
        }

        function reset(self) {
            enable(self);
            clearClickProcess(self);
            self.$button.removeClass('active');
        }

        function click(self, handler) {
            self.handler = handler;
        }

        return function ($button) {
            var self = {
                    $button: $button,
                    clickProcess: undefined,
                    enableFlag: true,
                    handler: undefined
                };

            $button.on('click', function () {
                var handlerRet;
                if (self.enableFlag === false) {
                    return;
                }
                if (self.handler === undefined) {
                    return;
                }
                if (self.clickProcess !== undefined) {
                    return;
                }
                $button.addClass('active');
                clearClickProcess(self);
                self.clickProcess = $.Deferred();
                handlerRet = self.handler();
                if (handlerRet !== undefined) {
                    handlerRet.done(function () {
                        self.clickProcess.resolve();
                    });
                } else {
                    self.clickProcess.resolve();
                }
                self.clickProcess.done(function () {
                    $button.removeClass('active');
                    self.clickProcess = undefined;
                });
            });

            return {
                enable: enable.bind(null, self),
                disable: disable.bind(null, self),
                click: click.bind(null, self),
                reset: reset.bind(null, self)
            };
        };
    }());

    zipBtnCtrl = makeButtonCtrl($('button.mbs-zip-btn', $panel));
    backBtnCtrl = makeButtonCtrl($('button.mbs-back-btn', $panel));
    renumBtnCtrl = makeButtonCtrl($('button.mbs-renumber-btn', $panel));

    function reset() {
        zipBtnCtrl.reset();
        backBtnCtrl.reset();
        renumBtnCtrl.reset();
    }
    return {
        reset: reset,
        zipBtnCtrl: zipBtnCtrl,
        backBtnCtrl: backBtnCtrl,
        renumBtnCtrl: renumBtnCtrl
    };

});

/*jslint indent: 4, es5: true */
/*global define, console, Promise */
define(['jquery'], function ($) {
    'use strict';
    var $panel = $('div#mbs-container-scanFolder'),

        genHandlers,
        genViewMessage,
        genViewButton,

        colorSFCtrl,
        grayCtrl;

    genHandlers = (function () {
        function progress(handlers, handler) {
            handlers.push(handler);
        }
        function notify(handlers, arg) {
            return handlers.map(function (handler) {
                return handler(arg);
            });
        }
        return function (assignHandler) {
            var handlers = [];
            assignHandler(notify.bind(null, handlers));
            return {
                progress: progress.bind(null, handlers)
            };
        };
    }());

    genViewMessage = (function () {
        function message($message, msgStr) {
            if (msgStr === undefined) {
                msgStr = '';
            }
            $message.text(msgStr);
        }
        return function ($message) {
            message($message, '');
            return {
                message: message.bind(null, $message)
            };
        };
    }());

    genViewButton = (function () {
        function processed($button) {
            $button.button('loading');
            $button.prop('disabled', true);
        }
        function reset($button) {
            $button.button('reset');
            $button.prop('disabled', false);
        }
        return function ($button) {
            return {
                reset: reset.bind(null, $button),
                processed: processed.bind(null, $button)
            };
        };
    }());

    function assinFormButtonHandlers($form, $button, valFunc) {
        var viewButton = genViewButton($button);

        return genHandlers(function (notify) {

            $form.on('submit', function () {
                viewButton.processed();
                Promise.resolve().then(function () {
                    return Promise.all(notify(valFunc()));
                })
                    .then(viewButton.reset)
                    .catch(function (err) {
                        viewButton.reset();
                        throw err;
                    });
                return false;
            });
        });
    }


    // color-SingleFace tab
    colorSFCtrl = (function () {
        var $tabpanel = $('div#mbs-scanFolder-colorS', $panel),
            $form = $('form', $tabpanel),
            $select = $('select', $form),
            //viewButton =  genViewButton($('button', $form)),
            viewMessage = genViewMessage($('span.mbs-message', $form)),

            clickHandlers;


        clickHandlers = assinFormButtonHandlers(
            $form,
            $('button', $form),
            function () {
                return $select.val();
            }
        );

        function addOption(title) {
            $select.append($('<option>').text(title));
        }
        ["Jacket", "Cover", "帯"].forEach(function (optionName) {
            addOption(optionName);
        });

        return {
            click: clickHandlers.progress,
            message: viewMessage.message
        };

    }());
    // gray tab
    grayCtrl = (function () {
        var $tabpanel = $('div#mbs-scanFolder-gray', $panel),
            $form = $('form', $tabpanel),
            //$button = $('button', $form),
            $select = $('select', $form),
            viewMessage = genViewMessage($('span.mbs-message', $form)),
            //handlers = [],
            clickHandlers;

        clickHandlers = assinFormButtonHandlers(
            $form,
            $('button', $form),
            function () {
                return $select.val();
            }
        );

        function addOption(title) {
            $select.append($('<option>').text(title));
        }
        function clearOption() {
            $select.empty();
        }
        function select(handler) {
            $select.on('change', function () {
                handler($select.val());
            });
        }

        return {
            click: clickHandlers.progress,
            select: select,
            addOption: addOption,
            clearOption: clearOption,
            message: viewMessage.message
        };
    }());

    return {
        grayCtrl: grayCtrl,
        colorSFCtrl: colorSFCtrl
    };


});

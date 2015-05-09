/*jslint indent: 4 */
/*global $, md */
md('genBKLCtrl', function () {
    'use strict';
    var $panel = $('div.mbs-gbl-ctrl'),
        ctrlPlusMinus = (function () {
            var
                $pmBlock = $('span.mbs-plus-minus', $panel),
                $buttons = $('button', $pmBlock),
                $btnPlus = $buttons.eq(0),
                $btnMinus = $buttons.eq(1),
                dfr = $.Deferred();

            $btnPlus.on('click', function () {
                dfr.notify('plus');
            });
            $btnMinus.on('click', function () {
                dfr.notify('minus');
            });

            return dfr.promise();
        }()),
        ctrlCount = (function () {
            var $input = $('input', $panel),
                val = Number($input.val());
            return {
                value: function () {
                    return val;
                },
                up: function () {
                    val += 1;
                    $input.val(val);
                },
                down: function () {
                    val -= 1;
                    if (val < 1) {
                        val = 1;
                    }
                    $input.val(val);
                }
            };
        }()),
        ctrlGenBKL = (function () {
            var $btn = $('button.mbs-genBKL-btn', $panel),
                dfr = $.Deferred();
            $btn.on('click', function () {
                dfr.notify();
            });
            return dfr.promise();
        }()),
        dfrBtn = $.Deferred();

    (function () {
        var $form = $('form', $panel);
        $form.on('submit', function () {
            return false;
        });
    }());

    ctrlPlusMinus.progress(function (dir) {
        //console.log('plus-minus:' + dir);
        if (dir === 'plus') {
            ctrlCount.up();
        } else if (dir === 'minus') {
            ctrlCount.down();
        }
    });

    ctrlGenBKL.progress(function () {
        //console.log('click gen bklog:' + ctrlCount.value());
        dfrBtn.notify(ctrlCount.value());

        ctrlCount.up();
    });

    return dfrBtn.promise();
});

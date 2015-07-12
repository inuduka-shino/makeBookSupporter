/*jslint indent: 4 */
/*global define */
define(['jquery', 'setting'], function ($, setting) {
    'use strict';
    var $panel = $('div.mbs-gbl-ctrl'),
        ctrlPlusMinus,
        ctrlCountInput,
        ctrlGenBKLBtn,
        ctrlRedrawBtn,
        noop = function () {
            return undefined;
        };

    // form subnit 抑止
    (function () {
        var $form = $('form', $panel);
        $form.on('submit', function () {
            return false;
        });
    }());

    // + - ボタン
    ctrlPlusMinus = (function () {
        var
            $pmBlock = $('span.mbs-plus-minus', $panel),
            $buttons = $('button', $pmBlock),
            $btnPlus = $buttons.eq(0),
            $btnMinus = $buttons.eq(1),
            clickCB = noop;

        $btnPlus.on('click', function () {
            clickCB('plus');
        });
        $btnMinus.on('click', function () {
            clickCB('minus');
        });

        return {
            setChangeCB: function (cb) {
                clickCB = cb;
            }
        };
    }());

    // count input
    ctrlCountInput = (function () {
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
    }());

    // PlusMinusBtn - countInput behavior
    ctrlPlusMinus.setChangeCB(function (dir) {
        //console.log('plus-minus:' + dir);
        if (dir === 'plus') {
            ctrlCountInput.up();
        } else if (dir === 'minus') {
            ctrlCountInput.down();
        }
    });

    // Gen-Booklog button
    ctrlGenBKLBtn = (function () {
        var $btn = $('button.mbs-genBKL-btn', $panel),
            clickCB = noop;

        $btn.on('click', function () {
            clickCB();
        });
        return {
            setClickCB: function (cb) {
                clickCB = cb;
            }
        };
    }());

    // booklog link
    (function () {
        var $bklogLink = $('a.mbs-bklog-link', $panel);
        setting.done(function (setting) {
            $bklogLink.attr('href', setting.bklogUrl);
        });
    }());

    // Redraw Button
    ctrlRedrawBtn = (function () {
        var $redraw = $('button.mbs-redraw', $panel),
            clickCB = noop;

        $redraw.on('click', function () {
            clickCB();
        });
        return {
            setClickCB: function (cb) {
                clickCB = cb;
            }
        };
    }());

    return {
        setGenBKLBtnClickCB: function (cb) {
            ctrlGenBKLBtn.setClickCB(function () {
                //console.log('click gen bklog:' + ctrlCount.value());
                cb(ctrlCountInput.value());
                ctrlCountInput.up();
            });
        },
        setRedrawBtnClikcCB: ctrlRedrawBtn.setClickCB
    };
});

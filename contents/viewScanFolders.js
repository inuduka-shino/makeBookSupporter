/*jslint indent: 4, es5: true */
/*global define, console, Promise */
define(['jquery'], function ($) {
    'use strict';
    var $panel = $('div#mbs-container-scanFolder'),

        genHandlers,
        genViewMessage,
        genViewButton,

        colorSFCtrl,
        grayCtrl,
        bandCtrl,
        badgesCtrl;


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
        function click($button, handler) {
            var ret;
            $button.on('click', function () {
                //console.log('reverse button click');
                processed($button);
                ret = handler();
                if (ret === undefined) {
                    reset($button);
                } else {
                    ret.then(reset.bind(null, $button));
                }
            });
        }
        return function ($button) {
            return {
                reset: reset.bind(null, $button),
                processed: processed.bind(null, $button),
                click: click.bind(null, $button)
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

    badgesCtrl = (function () {
        var $ancorList = $('ul>li>a', $panel),
            $badgeMap = {};
        [
            {category: 'gray', name: "mbs-scanFolder-gray"},
            {category: 'colorSF', name: "mbs-scanFolder-colorS"},
            {category: 'colorMF', name: "mbs-scanFolder-colorM"},
            {category: 'band', name: "mbs-scanFolder-band"}

        ].forEach(function (info) {
            var $ancor;
            $ancor = $ancorList.filter(
                ['a[aria-controls=', info.name, ']'].join('')
            );
            $badgeMap[info.category] =  $('span.badge', $ancor);
        });

        return {
            setCount: function (category, count) {
                $badgeMap[category].text(count);
            }
        };
    }());
    // band tab
    bandCtrl = (function () {
        var $tabpanel = $('div#mbs-scanFolder-band', $panel),
            $form = $('form', $tabpanel),
            $select = $('select', $form),
            $img = $('img', $tabpanel),
            reverseButton = genViewButton(
                $('button.mbs-reverse-button', $tabpanel)
            ),
            //viewButton =  genViewButton($('button', $form)),
            viewMessage = genViewMessage($('span.mbs-message', $form)),
            viewImg,
            viewImg0,

            clickHandlers;

        viewImg = (function () {
            var reverseMap = {
                'n': 's',
                's': 'n',
                'e': 'w',
                'w': 'e'
            };
            function setLink(cntxt, info) {
                if (info !== undefined) {
                    cntxt.filename = info.filename;
                    cntxt.dir = info.dir;
                }
                $img.attr('src', [
                    'image/band/',
                    cntxt.filename,
                    '?dir=',
                    cntxt.dir
                ].join(''));
            }
            function reverse(cntxt) {
                cntxt.dir = reverseMap[cntxt.dir];
                setLink(cntxt);
            }
            function getInfo(cntxt) {
                return {
                    filename: cntxt.filename,
                    dir: cntxt.dir
                };
            }
            return function ($img) {
                var cntxt = {
                    $img: $img,
                    filename: undefined,
                    dir: undefined
                };
                //setLink(cntxt);
                return {
                    reverse: reverse.bind(null, cntxt),
                    setLink: setLink.bind(null, cntxt),
                    getInfo: getInfo.bind(null, cntxt)
                };
            };
        }());

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

        viewImg0 = viewImg($img);
        function setImage(info) {
            viewImg0.setLink(info);
        }
        function getImageInfo() {
            return viewImg0.getInfo();
        }

        reverseButton.click(viewImg0.reverse);

        return {
            addOption: addOption,
            click: clickHandlers.progress,
            message: viewMessage.message,
            setImage: setImage,
            getImageInfo: getImageInfo
            //clickReverseBtn: reverseButton.click
        };

    }());
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
        setBadgeCount: badgesCtrl.setCount,
        grayCtrl: grayCtrl,
        colorSFCtrl: colorSFCtrl,
        bandCtrl: bandCtrl
    };


});
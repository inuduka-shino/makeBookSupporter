/*jslint indent: 4 */
/*global define */
define(['jquery'], function ($) {
    'use strict';
    var $container = $('div.container-fluid#mbs-container-loading');
    return {
        hide: function () {
            $container.hide();
        }
    };
});

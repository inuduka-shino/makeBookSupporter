/*jslint indent: 4 */
/*global define */
define(['jquery', 'jsonCall'], function ($, jsonCall) {
    'use strict';
    var dfr = $.Deferred();

    jsonCall.loadSetting().done(function (response) {
        dfr.resolve(response);
    });

    return dfr.promise();
});

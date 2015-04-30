/*jslint indent: 4 */
/*global $, md */
md('setting', function (modules) {
    'use strict';
    var dfr = $.Deferred();

    modules.jsonCall.loadSetting().done(function (response) {
        dfr.resolve(response);
    });

    return dfr.promise();
});

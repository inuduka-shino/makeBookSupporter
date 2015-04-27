/*jslint node: true, indent: 4 , nomen:true */
/*global jQuery */

module.exports = (function () {
    'use strict';
    var deferred = require('jquery-deferred').Deferred;

    function query() {
        var dfr = deferred();
        dfr.resolve([
            { name: 'test11'},
            { name: 'テストテスト'}
        ]);

        return dfr.promise();
    }

    return {
        query: query
    };
}());


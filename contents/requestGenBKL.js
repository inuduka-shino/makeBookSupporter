/*jslint indent: 4 */
/*global md, $ */
md('requestGenBKL', function (modules) {
    'use strict';
    var jsonCall = modules.jsonCall.call;
    function requestGenBKL(count) {
        return jsonCall(
            'mbs/api/genBKL',
            {
                count: count
            }
        );
    }
    return {
        call: requestGenBKL
    };
});

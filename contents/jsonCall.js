/*jslint indent: 4 */
/*global md, $ */
md('jsonCall', function () {
    'use strict';
    function jsonCall(url, param) {
        var jqXHR;
        jqXHR = $.ajax({
            type: 'POST',
            url: url,

            contentType: 'application/json',
            data: JSON.stringify(param),

            dataType: 'json',
        });
        return jqXHR;
    }

    function requestGenBKL(count) {
        return jsonCall(
            'mbs/api/genBKL',
            {
                count: count
            }
        );
    }
    function queryBookFolders() {
        return jsonCall(
            'mbs/api/queryBookFolders'
        );
    }

    return {
        requestGenBKL: requestGenBKL,
        queryBookFolders: queryBookFolders
    };
});

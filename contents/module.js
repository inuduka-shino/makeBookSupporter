/*jslint indent: 4 */
/*global $ */
var md = (function () {
    'use strict';
    var moudles = [];
    function md(moduleName, moduleDef) {
        var moduleIF;
        if ($.isFunction(moduleName)) {
            moduleDef = moduleName;
            moduleName = undefined;
        }
        moduleIF = moduleDef(moudles);
        if (moduleName !== undefined) {
            moudles[moduleName] = moduleIF;
        }
    }
    return md;
}());

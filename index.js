/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
  change in 2016/7/25
  fix es6 bug: don't support dynamic key in webview.Syntax Error.
*/
/* global define */
define("game.fish.Classnames", function(require, exports, module) {
    var _cacheThisModule_;
    (function() {
        var hasOwn = {}.hasOwnProperty;

        function classNames() {
            var classes = [];

            for (var i = 0; i < arguments.length; i++) {
                var arg = arguments[i];
                if (!arg) continue;

                var argType = typeof arg;
                var joinValue1 = '',joinValue2 = '', joinValue3 = '',newkey='';
                if (argType === 'string' || argType === 'number') {
                    classes.push(arg);
                } else if (Array.isArray(arg)) {
                    classes.push(classNames.apply(null, arg));
                } else if (argType === 'object') {
                    //为了解决 arg key为动态的情况
                    if(arg['@1']){
                        joinValue1 = arg['@1'];
                        arg.remove
                    }
                    if(arg['@2']){
                        joinValue2 = arg['@2'];
                    }
                    if(arg['@3']){
                        joinValue3 = arg['@3'];
                    }
                    
                    for (var key in arg) {
                        
                        if(key.split('@1') && key.split('@1').length > 1){
                            newkey = key.replace('@1',joinValue1);
                        }else if(key.split('@2') && key.split('@2').length > 1){
                            newkey = key.replace('@2',joinValue2);
                        }else if(key.split('@3') && key.split('@3').length > 1){
                            newkey = key.replace('@3',joinValue3);
                        }else {
                            newkey = key;
                        }
                        if (hasOwn.call(arg, key) && arg[key] && key !='@1' && key!='@2' && key!='@3') {
                            classes.push(newkey);
                        }
                    
                    }
                }
            }

            return classes.join(' ');
        }

        if (typeof module !== 'undefined' && module.exports) {
            module.exports = classNames;
        } else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
            // register as 'classnames', consistent with npm package name
            define('classnames', [], function() {
                return classNames;
            });
        } else {
            window.classNames = classNames;
        }
    }());
});

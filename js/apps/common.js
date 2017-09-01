(function (win, $, doc) {
    'use strict';
    win.examProject = win.examProject || {};

    var hasOwnProperty = Object.prototype.hasOwnProperty;

    win.examProject.common = (function () {
        return {
            util : {
                isSupportTransform : (function () {
                    return ('WebkitTransform' in doc.body.style || 'MozTransform' in doc.body.style || 'msTransform' in doc.body.style || 'OTransform' in doc.body.style || 'transform' in doc.body.style);
                })(),
                isDevice : (function () {
                    return ('ontouchstart' in win || (win.DocumentTouch && doc instanceof win.DocumentTouch));
                })(),
                def : function (org, src) {
                    for (var prop in src) {
                        if (!hasOwnProperty.call(src, prop)) continue;
                        if ('object' === $.type(org[prop])) {
                            org[prop] = ('array' === $.type(org[prop])) ? src[prop].slice(0) : this.def(org[prop], src[prop]);
                        } else {
                            org[prop] = src[prop];
                        }
                    }
                    return org;
                },
                winSize : (function () {
                    var isWinSafari = (function () {
                        var appNetscape = (navigator.appName === "Netscape"),
                            appVersionMac = (navigator.appVersion.indexOf("Mac") !== -1),
                            userAgentSafari = (navigator.userAgent.indexOf("Safari") !== -1),
                            userAgentChrome = (navigator.userAgent.indexOf("Chrome") !== -1);
                        return (appNetscape && !appVersionMac && userAgentSafari && !userAgentChrome);
                    })();
                    if (isWinSafari) {
                        return function () {
                            var win_wh = {
                                w : $(win).width(),
                                h : $(win).height()
                            };
                            return win_wh;
                        }
                    } else {
                        return function () {
                            var win_wh = {
                                w : win.innerWidth || doc.documentElement.clientWidth || doc.body.clientWidth,
                                h : win.innerHeight || doc.documentElement.clientHeight || doc.body.clientHeight
                            };
                            return win_wh;
                        }
                    }
                })(),
                requestAFrame : (function () {
                    return win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.oRequestAnimationFrame || win.msRequestAnimationFrame ||
                        function (callback) {
                            return win.setTimeout(callback, 1000 / 60);
                        };
                })(),
                cancelAFrame : (function () {
                    return win.cancelAnimationFrame || win.webkitCancelAnimationFrame || win.mozCancelAnimationFrame || win.oCancelAnimationFrame || win.msCancelAnimationFrame ||
                        function (id) {
                            win.clearTimeout(id);
                        };
                })(),
                getRestrictBytes : function (str, maxBytes) {
                    var strLeng = str.length,
                        rByte = 0,
                        rLen = 0,
                        strChar = '';
                    maxBytes = maxBytes || 100;
                    for (var i = 0; i < strLeng; i++) {
                        strChar = str.charAt(i);
                        if (escape(strChar).length > 4) {
                            rByte += 2;
                        } else {
                            rByte++;
                        }
                        if (rByte <= maxBytes) {
                            rLen = i+1;
                        }
                    }
                    return {
                        bytes : rByte,
                        rectLeng : rLen
                    }
                },
                imgLoader : function (selector, callback) {
                    $(selector).each(function () {
                        var cb = (callback || function () {});
                        if (this.complete || $(this).height() > 0) {
                            cb.apply(this);
                        } else {
                            $(this).on('load', function () {
                                cb.apply(this);
                                $(this).off('load');
                            });
                        }
                    });
                }
            }
        }
    })();
})(window, window.jQuery, window.document);
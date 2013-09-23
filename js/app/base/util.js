define(function(require, exports) {
    var $ = require('$');
    var moment = require('moment');
    var util = {};
    util.date_f = function(ndate, fmt) {
        return ndate? (new Date(ndate)).toString(fmt||'MMM dd, yyyy hh:mm tt') : '';
    };
    util.date = function(ndate) {
        return ndate? moment(ndate).format('YYYY-MM-DD') : '';
    };
    util.date_l = function(ndate) {
        return ndate? moment(ndate).format('YYYY-MM-DD HH:mm:ss') : '';
    };

    util.queryToJson = function (str, sep, eq) {
        var decode = decodeURIComponent,
            hasOwnProperty = Object.prototype.hasOwnProperty,
            suffix = function (str, suffix) {
                var ind = str.length - suffix.length;
                return ind >= 0 && str.indexOf(suffix, ind) == ind;
            };
        sep = sep || '&';
        eq = eq || '=';
        var ret = {},
            pairs = str.split(sep),
            pair, key, val,
            i = 0, len = pairs.length;

        for (; i < len; ++i) {
            pair = pairs[i].split(eq);
            key = decode(pair[0]);
            try {
                val = decode(pair[1] || '');
            } catch (e) {
                console.log(e + "decodeURIComponent error : " + pair[1], "error");
                val = pair[1] || '';
            }
            val = $.trim(val);
            if (suffix(key, "[]")) {
                key = key.substring(0, key.length - 2);
            }
            if (hasOwnProperty.call(ret, key)) {
                if ($.isArray(ret[key])) {
                    ret[key].push(val);
                } else {
                    ret[key] = [ret[key], val];
                }
            } else {
                ret[key] = val;
            }
        }
        return ret;
    };

    util.urlParams = function() {
        return util.queryToJson( window.location.search.replace(/^\?/, '') );
    };

    util.packForm = function(form, escape) {
        var a = $(form).serializeArray(),
            o = {};

        escape = (escape==undefined) ? true : false;

        $.each(a, function() {
            var value = this.value;
            if (this.name === 'startTime') {
                var startTime = moment(value).valueOf();
                this.value = typeof startTime === 'number'?startTime:'';
            } else if (this.name === 'endTime') {
                var endTime = moment(value).add('days', 1).valueOf() - 1000;
                this.value = typeof endTime === 'number'?endTime:'';
            }

            this.value = value === 'null'?null:this.value;

            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(escape ? util.escape(this.value) : $.trim(this.value));
            } else {
                o[this.name] = (escape) ? util.escape(this.value) : $.trim(this.value);
            }
        });
        return o;
    };

    util.escape = function(str) {
        return $.trim(str)
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    };

    util.substring = function(str, len) {
        if (str) return str.substring(0, len);
        return str;
    };
    util.toQueryPair = function (key, value) {
        if (typeof value == 'undefined'){
            return key;
        }
        return key + '=' + encodeURIComponent(value === null ? '' : String(value));
    };
    util.toQueryString = function (obj) {
        var ret = [];
        for(var key in obj){
            key = encodeURIComponent(key);
            var values = obj[key];
            if(values && values.constructor == Array){// 数组
                var queryValues = [];
                for (var i = 0, len = values.length, value; i < len; i++) {
                    value = values[i];
                    queryValues.push(util.toQueryPair(key, value));
                }
                ret = ret.concat(queryValues);
            }else{ // 字符串
                ret.push(util.toQueryPair(key, values));
            }
        }
        return ret.join('&');
    };
    /**
     * 定义内联样式
     * @param  {String} str 样式
     */
    util.css = function(str) {
        var jsSelf = (function() {
            var files = doc.getElementsByTagName('link');
            return files[files.length - 1];
        })();
        var css = doc.getElementById('do-inline-css');
        if (!css) {
            css = doc.createElement('style');
            css.type = 'text/css';
            css.id = 'do-inline-css';
            jsSelf.parentNode.insertAfter(css, jsSelf);
        }

        if (css.styleSheet) {
            css.styleSheet.cssText = css.styleSheet.cssText + str;
        } else {
            css.appendChild(doc.createTextNode(str));
        }
    };
    util.validateOneYear = function(begin,end){
        if(!!begin && !!end && typeof begin == 'string' && typeof end == 'string') {
            begin = moment(begin).add('years',1);
            end = moment(end);
            if(end.diff(begin, 'days') > -1)
                return false;
        }
        return true;
    };

    return util;
});
define(function(require, exports) {
    var $ =require('$');
    var io = io || {};

    /**
     * 协议处理器
     * @param {Function|Object} callback
     * @param {Function} callback.success 成功回调
     * @param {Function} callback.error 失败回调
     * @param {Object} callback.input 表单错误回调, key值为表单名称
     * @see http://jira.17173.com/confluence/pages/viewpage.action?pageId=1114332
     */
    io.processor = function(json, callback) {

        var msg,
            success,
            error,
            input;

        //全局异常处理(login|error)
        if ( json.result == 'login' ) {
            //登录页跳转
            window.location.href = $cfg('page_login');
        }
        if ( json.result == 'error' ) {
            //异常提示
            console.error(json.messages);
            return;
        }

        /**
         * 业务相关回调,参数中包含业务的成功失败消息
         * 1. success(message)|failure(message)
         *
         * 表单验证
         * 2. input(fieldErrors)
         */
        if ( $.inArray(json.result, ['success', 'failure']) != -1 ) {

            msg = json.messages.shift() || json.messages;

            success = callback['success'] || callback,
                error = callback['error'] ||
                    function(msg){
                        console.warn(msg);
                        $.error(msg).modal();
                    };

            (json.result == 'success')
                ? success.call(json, msg)
                : error.call(json, msg);

        } else if ( json.result == 'input' ) {

            if ( !$.isEmptyObject(json['fieldErrors']) ) {

                $.each(json['fieldErrors'], function(field, v){

                    msg = (v.shift && v.shift()) || v;

                    input = callback['input'];

                    input && input[field] && input[field].call(json, msg);
                });

            } else {

                msg = json.messages.shift() || json.messages;

                callback['input']
                    ? (callback['input'].call(json, msg))
                    : ($.message(msg).modal());
            }
        }
    };

    /*$.ajaxSetup({
        traditional: true,
        cache: false
    });*/

    /**
     * 通讯接口
     * @param url
     * @param data
     * @param callback
     */
    io.post = function(url, data, callback) {

        if ( !url || url === '' ) {
            console.warn('url undefined in func [io.post]');
            return;
        }

        if ( callback == undefined ) {
            callback = data;
            data = {};
        }

        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: data,
            success: function(d) {
                d && io.processor(d, callback);
            },
            error: function() {
                console.warn('server error: ' + url);
            }
        });
    };

    io.sync_post = function(url, data, callback) {

        if ( !url || url === '' ) {
            console.warn('url undefined in func [io.sync_post]');
            return;
        }

        if ( callback == undefined ) {
            callback = data;
            data = {};
        }

        $.ajax({
            async: false,
            url: url,
            dataType: 'json',
            type: 'POST',
            data: data,
            success: function(d) {
                d && io.processor(d, callback);
            },
            error: function() {
                console.warn('server error: ' + url);
            }
        });
    };

    return io;
});
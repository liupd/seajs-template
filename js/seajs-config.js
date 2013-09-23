seajs.config({
    alias : {
        '$' : 'jquery/jquery/1.9.1/jquery',
        'moment': 'gallery/moment/2.0.0/moment',
        'mockjax': 'jquery/mockjax/jquery.mockjax'
    },
    preload : [
        //seajs.production ? 'seajs/seajs-style/1.0.0/seajs-style' : 'seajs/seajs-text/1.0.0/seajs-text-debug'
    ]
});
function currying (fn) {
    var slice = Array.prototype.slice,
        _args = slice.call(arguments, 1);

    return function () {
        var _inargs = slice.call(arguments);
        return fn.apply(this, _args.concat(_inargs));
    }
}

function Ajax() {
    this.xhr = new XMLHttpRequest();
}

Ajax.prototype = {
    open: function(type, url, data, callback, fail) {
        this.xhr.onload = function() {
            callback(this.responseText, this.status, this);
        }

        this.xhr.onerror = function() {
            fail(this.responseText, this.status, this);
        }

        this.xhr.onloadstart = function () {
            console.log('on load start ...');
        }

        this.xhr.open(type, url, !!data.async);
        this.xhr.send(data.paras);
    }

};

'get post'.split(' ').forEach(function(mt) {
    Ajax.prototype[mt] = currying(Ajax.prototype.open, mt);
});

var xhr = new Ajax();
xhr.get('./index.json', {async: false}, function(datas, status) {
    // done(datas)
    console.log(datas, status);
});

var xhr1 = new Ajax();
xhr1.post('./index.json', {async: true}, function(datas, status) {
    // done(datas)
    console.log(datas, status);
}, function fail (msg) {

});

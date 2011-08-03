var $ = {
    getId: function(id){
        return document.getElementById(id);
    },
    getClass: function(theClass){
        var allElment = [];
                    
        //浏览器判断
        if(typeof document.all != "undefined"){
            allElment = document.all;
        }else{
            allElment = document.getElementsByTagName("*");
        }
        var cacheArr = [];
        //遍历所有的dom，返回指定对象
        for(var i = 0; i < allElment.length; i++){
            var pat = new RegExp("(^| )" + theClass + "( |$)");
            //遍历查找className,并保存到cacheArr中
            if(pat.test(allElment[i].className)){
                cacheArr[cacheArr.length] = allElment[i];
            }
        }
                    
        return cacheArr;
    },
    getEvent: function() {//ie/ff
        if (document.all) {
            return window.event;
        }
        func = getEvent.caller;
        while (func != null) {
            var arg0 = func.arguments[0];
            if (arg0) {
                if ((arg0.constructor == Event || arg0.constructor == MouseEvent) || (typeof (arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
                    return arg0;
                }
            }
            func = func.caller;
        }
        return null;
    },
    //获取鼠标的位置，返回{x:0, y:0}这样的形式
    getMousePos: function(ev) {
        if (!ev) {
            ev = this.getEvent();
        }
        if (ev.pageX || ev.pageY) {
            return {
                x: ev.pageX,
                y: ev.pageY
            };
        }
        if (document.documentElement && document.documentElement.scrollTop) {
            return {
                x: ev.clientX + document.documentElement.scrollLeft - document.documentElement.clientLeft,
                y: ev.clientY + document.documentElement.scrollTop - document.documentElement.clientTop
            };
        }
        else if (document.body) {
            return {
                x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
                y: ev.clientY + document.body.scrollTop - document.body.clientTop
            };
        }
    },
    //获取元素位置，返回{x:0, y:0}这样的形式
    getElementPos: function(el) {
        el = this.getItself(el);
        var _x = 0, _y = 0;
        do {
            _x += el.offsetLeft;
            _y += el.offsetTop;
        } while (el = el.offsetParent);
        return {
            x: _x,
            y: _y
        };
    },
    //返回本身
    getItself: function(id) {
        return "string" == typeof id ? $.getId(id) : id;
    },
    //获取视窗大小
    getViewportSize: {
        w: (window.innerWidth) ? window.innerWidth : (document.documentElement && document.documentElement.clientWidth) ? document.documentElement.clientWidth : (document.body?document.body.offsetWidth:0),
        h: (window.innerHeight) ? window.innerHeight : (document.documentElement && document.documentElement.clientHeight) ? document.documentElement.clientHeight : (document.body ? document.body.offsetHeight : 0)
    },
    //判断是否为IE
    isIE: document.all ? true : false,
    //设置外部HTML
    setOuterHtml: function(obj, html) {
        var Objrange = document.createRange();
        obj.innerHTML = html;
        Objrange.selectNodeContents(obj);
        var frag = Objrange.extractContents();
        obj.parentNode.insertBefore(frag, obj);
        obj.parentNode.removeChild(obj);
    },
    //获取第一个子元素
    firstChild: function(parentObj, tagName) {
        if ($.isIE) {
            return parentObj.firstChild;
        }
        else {
            var arr = parentObj.getElementsByTagName(tagName);
            return arr[0];
        }
    },
    //获取最后一个子元素
    lastChild: function(parentObj, tagName) {
        if ($.isIE) {
            return parentObj.lastChild;
        }
        else {
            var arr = parentObj.getElementsByTagName(tagName);
            return arr[arr.length - 1];
        }
    }
}
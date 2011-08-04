var $ = {
    getId: function(id){
        return document.getElementById(id);
    },
    getClass: function(theClass){
        var allElment = [];
                    
        //������ж�
        if(typeof document.all != "undefined"){
            allElment = document.all;
        }else{
            allElment = document.getElementsByTagName("*");
        }
        var cacheArr = [];
        //�������е�dom������ָ������
        for(var i = 0; i < allElment.length; i++){
            var pat = new RegExp("(^| )" + theClass + "( |$)");
            //��������className,�����浽cacheArr��
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
	getCtrl: function(e){
		if (document.all) {
            return window.event.ctrlKey;
        }
		return (typeof e.ctrlKey != 'undefined') ? e.ctrlKey : e.modifiers & Event.CONTROL_MASK > 0;
	},
    //��ȡ����λ�ã�����{x:0, y:0}��������ʽ
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
    //��ȡԪ��λ�ã�����{x:0, y:0}��������ʽ
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
    getItself: function(id) {
        return "string" == typeof id ? $.getId(id) : id;
    },
    //�ж��Ƿ�ΪIE
    isIE: document.all ? true : false,
    
    //��ȡ��һ����Ԫ��
    firstChild: function(parentObj, tagName) {
        if ($.isIE) {
            return parentObj.firstChild;
        }
        else {
            var arr = parentObj.getElementsByTagName(tagName);
            return arr[0];
        }
    },
    //��ȡ���һ����Ԫ��
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
var $ = {
	// ��дdocument.getElementById����
    // @param {String} ����
    // @return {Object}
    getId: function(id){
        return document.getElementById(id);
    },
	// ����className��ȡ����
    // @param {String} ����
    // @return {Object} Array
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
	// �¼�
    // @return {Object}
    getEvent: function() {//ie/ff
        if (document.all) {
            return window.event;
        }
        func = this.getEvent.caller;
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
	// �ж�ctrl�Ƿ񱻰���
	// @param {Object} ����
    // @return {Boolean}
	getCtrl: function(e){
		if (document.all) {
            return window.event.ctrlKey;
        }
		return (typeof e.ctrlKey != 'undefined') ? e.ctrlKey : e.modifiers & Event.CONTROL_MASK > 0;
	},
	// ��ȡ����λ��
	// @param {Object} ����
    // @return {Object} Array
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
	// ��ȡԪ��λ��
	// @param {Object}/{String} ����
    // @return {Object} Array
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
	// ��ȡԪ��
	// @param {Object}/{String} ����
    // @return {Object}
    getItself: function(id) {
        return "string" == typeof id ? $.getId(id) : id;
    },
    // isIE?
    // @return {Boolean}
    isIE: document.all ? true : false,
    
	// ��ȡ��һ����Ԫ��
	// @param {Object} ����
	// @param {String}
    // @return {Object}
    firstChild: function(parentObj, tagName) {
        if ($.isIE) {
            return parentObj.firstChild;
        }
        else {
            var arr = parentObj.getElementsByTagName(tagName);
            return arr[0];
        }
    },
	
    // ��ȡ���һ����Ԫ��
	// @param {Object} ����
	// @param {String}
    // @return {Object}
    lastChild: function(parentObj, tagName) {
        if ($.isIE) {
            return parentObj.lastChild;
        }
        else {
            var arr = parentObj.getElementsByTagName(tagName);
            return arr[arr.length - 1];
        }
    },
	// ����һ�����߿�
	// @param {Object} ����
    // @return {Object}
	createDashedElement: function(dragDiv){
		if(typeof dragDiv == "object"){
			var d = document.createElement("div");
			d.style.cssText = dragDiv.style.cssText;
			d.style.border = "dashed 1px #aaa";
			d.style.display = "inline-block";
			//d.style.marginBottom = "6px";
			d.style.width = dragDiv.offsetWidth - 2 * parseInt(d.style.borderWidth) + "px"; //��ȥboderWidthʹ���߿��С������dragDivһ��
			d.style.height = dragDiv.offsetHeight - 8 * parseInt(d.style.borderWidth) + "px"; //����px ��֤FF��ȷ
			d.style.position = "relative";
			return d;
		}
		return false;
	},
	// �趨͸����
	// @param {Object} ����
	// @param {Number} ����
	setOpacity: function(dragDiv, n) {
        if ($.isIE) {
            dragDiv.filters.alpha.opacity = n;
        }
        else {
            dragDiv.style.opacity = n / 100;
        }
    },
	// ���ؿ���קԪ�ؼ���
	// @param {Object}/{String} ����
	// @param {String} ����
    // @return {Object} Array
	regDragsPos: function(id, CName) {
        var arrDragDivs = new Array();
        var dragObj = $.getItself(id);
        var tmpDiv, tmpPos;
        for (i = 0; i < dragObj.getElementsByTagName("div").length; i++) {
            tmpDiv = dragObj.getElementsByTagName("div")[i];
            if (tmpDiv.className == CName) {
                tmpPos = $.getElementPos(tmpDiv);
                arrDragDivs.push({
                    DragId: tmpDiv.id,
                    PosLeft: tmpPos.x,
                    PosTop: tmpPos.y,
                    PosWidth: tmpDiv.offsetWidth,
                    PosHeight: tmpDiv.offsetHeight
                });
            }
        }
        //alert(arrDragDivs);
        return arrDragDivs;
    },
	// ����һ��z������
    // @return {Number}
	getZindex: function() {
        var maxZindex = 0;
        var divs = document.getElementsByTagName("div");
        for (z = 0; z < divs.length; z++) {
            maxZindex = Math.max(maxZindex, divs[z].style.zIndex);
        }
        return maxZindex;
    }
}
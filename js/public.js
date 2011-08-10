var $ = {
	// 简写document.getElementById函数
    // @param {String} 类型
    // @return {Object}
    getId: function(id){
        return document.getElementById(id);
    },
	// 根据className获取对象
    // @param {String} 类型
    // @return {Object} Array
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
	// 事件
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
	// 判断ctrl是否被按下
	// @param {Object} 类型
    // @return {Boolean}
	getCtrl: function(e){
		if (document.all) {
            return window.event.ctrlKey;
        }
		return (typeof e.ctrlKey != 'undefined') ? e.ctrlKey : e.modifiers & Event.CONTROL_MASK > 0;
	},
	// 获取鼠标的位置
	// @param {Object} 类型
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
	// 获取元素位置
	// @param {Object}/{String} 类型
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
	// 获取元素
	// @param {Object}/{String} 类型
    // @return {Object}
    getItself: function(id) {
        return "string" == typeof id ? $.getId(id) : id;
    },
    // isIE?
    // @return {Boolean}
    isIE: document.all ? true : false,
    
	// 获取第一个子元素
	// @param {Object} 类型
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
	
    // 获取最后一个子元素
	// @param {Object} 类型
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
	// 创建一个虚线框
	// @param {Object} 类型
    // @return {Object}
	createDashedElement: function(dragDiv){
		if(typeof dragDiv == "object"){
			var d = document.createElement("div");
			d.style.cssText = dragDiv.style.cssText;
			d.style.border = "dashed 1px #aaa";
			d.style.display = "inline-block";
			//d.style.marginBottom = "6px";
			d.style.width = dragDiv.offsetWidth - 2 * parseInt(d.style.borderWidth) + "px"; //减去boderWidth使虚线框大小保持与dragDiv一致
			d.style.height = dragDiv.offsetHeight - 8 * parseInt(d.style.borderWidth) + "px"; //加上px 保证FF正确
			d.style.position = "relative";
			return d;
		}
		return false;
	},
	// 设定透明度
	// @param {Object} 类型
	// @param {Number} 类型
	setOpacity: function(dragDiv, n) {
        if ($.isIE) {
            dragDiv.filters.alpha.opacity = n;
        }
        else {
            dragDiv.style.opacity = n / 100;
        }
    },
	// 返回可拖拽元素集合
	// @param {Object}/{String} 类型
	// @param {String} 类型
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
	// 返回一个z轴数字
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
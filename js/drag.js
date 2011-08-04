var Class = {
    create: function() {
        return function() {
            this.init.apply(this, arguments);
        }
    }
}
var Drag = Class.create();
Drag.prototype = {
    init: function(dragDiv, wrapDiv) {
        //���
        wrapDiv = $.getClass(wrapDiv);
        dragDiv = $.getItself(dragDiv);
		ctrlObjArr = [];
        
		//�ж�ctrl���Ƿ񱻰���
		isCtrl = false;
		
		//����ƶ���Χ
        this.dragArea = {
            maxLeft: -9999,
            maxRight: 9999,
            maxTop: -9999,
            maxBottom: 9999
        };
         //���õ��Ĭ��͸��60%
        this.opacity = 60;
					
        this.originDragDiv = null;
        this.tmpX = 0;
        this.tmpY = 0;
        this.moveable = false;
        this.dragArray = [];
        var dragObj = this;
					
        //�޳�Ϊȫ���ƶ� ����������ƶ�
        dragDiv.onmousedown = function(e) {
            var ev = e || window.event || $.getEvent();
            //ֻ����ͨ��������������ק,IE������Ϊ1 FireFoxΪ0
            if ($.isIE && ev.button == 1 || !$.isIE && ev.button == 0) {
				if($.getCtrl(ev)){
					isCtrl = true;
				}
            }
            else {
                return false;
            }
            if(isCtrl){
                //׷�ӵ��Ԫ��
            }else{
                //��ȡ��ǰԪ�صĻ�����Ϣ����dom�еĽڵ�λ�ã�������������x��y����
                var tmpColId;
                for (c = 0; c < wrapDiv.length; c++) {
                    for (k = 0; k < wrapDiv[c].getElementsByTagName("div").length; k++) {
                        if (dragDiv.id == wrapDiv[c].getElementsByTagName("div")[k].id) {
                            tmpColId = c;
                            break;
                        }
                    }
                }
                var tmpPosFirstChild = $.getElementPos($.firstChild(wrapDiv[tmpColId], "div"));
                var tmpPosLastChild = $.getElementPos($.lastChild(wrapDiv[tmpColId], "div"));
                var tmpObj = {
                    colId: tmpColId,
                    firstChildUp: tmpPosFirstChild.y,
                    lastChildDown: tmpPosLastChild.y + $.lastChild(wrapDiv[tmpColId],"div").offsetHeight
                };
                
                //���浱ǰ���п���ק������������λ��
                dragObj.dragArray = dragObj.RegDragsPos();
                            
                //�������߿�������ʽ
                var dashedElement = document.createElement("div");
                dashedElement.style.cssText = dragDiv.style.cssText;
                dashedElement.style.border = "dashed 1px #aaa";
                dashedElement.style.display = "inline-block";
                //dashedElement.style.marginBottom = "6px";
                dashedElement.style.width = dragDiv.offsetWidth - 2 * parseInt(dashedElement.style.borderWidth) + "px"; //��ȥboderWidthʹ���߿��С������dragDivһ��
                dashedElement.style.height = dragDiv.offsetHeight - 8 * parseInt(dashedElement.style.borderWidth) + "px"; //����px ��֤FF��ȷ
                dashedElement.style.position = "relative";
                
                if (dragDiv.nextSibling) {
                    dragDiv.parentNode.insertBefore(dashedElement, dragDiv.nextSibling);
                }
                else {
                    dragDiv.parentNode.appendChild(dashedElement);
                }
                //�϶�ʱ��Ϊabsolute
                dragDiv.style.width = dragDiv.offsetWidth + "px";
                dragDiv.style.position = "absolute";
                dragObj.moveable = true;
                dragDiv.style.zIndex = dragObj.GetZindex() + 1;
                var downPos = $.getMousePos(ev);
                
                dragObj.tmpX = downPos.x - dragDiv.offsetLeft;
                dragObj.tmpY = downPos.y - dragDiv.offsetTop;
                            
                if ($.isIE) {
                    dragDiv.setCapture();
                } else {
                    window.captureEvents(Event.mousemove);
                }
                //�ı䵱ǰ�����͸����
                dragObj.SetOpacity(dragDiv, dragObj.opacity);
                
                //FireFox ȥ����������קͼƬ����
                if (ev.preventDefault) {
                    ev.preventDefault();
                    ev.stopPropagation();
                }
                //�ƶ���ʱ��
                document.onmousemove = function(e) {
                    if (dragObj.moveable) {
                        //�϶��¼�
                        var ev = e || window.event || $.getEvent();
                        //IE ȥ����������קͼƬ����
                        if (document.all) //IE
                        {
                            ev.returnValue = false;
                        }
                        //��ȡ��ǰ�������꣬����Ϊarr{x:0, y:0}
                        var movePos = $.getMousePos(ev);
                        
                        //alert("d-x:" + downPos.x +" d-x:" + downPos.y + " t-x:" + dragObj.tmpX + " t-y" + dragObj.tmpY)
                        var _left = Math.min(movePos.x - dragObj.tmpX, dragObj.dragArea.maxRight),
                            _top = Math.min(movePos.y - dragObj.tmpY, dragObj.dragArea.maxBottom);
                            
                            _left = Math.max(_left, dragObj.dragArea.maxLeft);
                            _top = Math.max(_top, dragObj.dragArea.maxTop);
                            
                        //�ı��϶������λ��
                        dragDiv.style.left = _left + "px";
                        dragDiv.style.top = _top + "px";
                        
                        //Ŀ��div
                        var targetDiv = null;
                        
                        //�����϶����߿�
                        for (var k = 0; k < dragObj.dragArray.length; k++) {
                            //�ж���ǰ�����Ƿ�����ڿ���ק����ļ�������
                            if (dragDiv == dragObj.dragArray[i]) {
                                continue;
                            }
                            
                            var _dragId = dragObj.dragArray[k].DragId,
                                _posLeft = dragObj.dragArray[k].PosLeft,
                                _posWidth = dragObj.dragArray[k].PosWidth,
                                _posTop = dragObj.dragArray[k].PosTop,
                                _posHeight = dragObj.dragArray[k].PosHeight;
                                
                            //�ж��϶��Ķ���ͣ�����ĸ�λ��
                            if (movePos.x > _posLeft && movePos.x < _posLeft + _posWidth && movePos.y > _posTop && movePos.y < _posTop + _posHeight ) {
                                //���в������
                                targetDiv = $.getId(_dragId);
                                if (movePos.y < _posTop + _posHeight / 2) {
                                    //������
                                    dashedElement.style.width = targetDiv.offsetWidth - 2 * parseInt(dashedElement.style.borderWidth) + "px";
                                    targetDiv.parentNode.insertBefore(dashedElement, targetDiv);
                                }
                                else {
                                    //������
                                    dashedElement.style.width = targetDiv.offsetWidth - 2 * parseInt(dashedElement.style.borderWidth) + "px";
                                    if (targetDiv.nextSibling) {
                                        targetDiv.parentNode.insertBefore(dashedElement, targetDiv.nextSibling);
                                    }
                                    else {
                                        targetDiv.parentNode.appendChild(dashedElement);
                                    }
                                }
                            }
                        }
                        
                        
                        for (j = 0; j < wrapDiv.length; j++) {
                            var startLeft = $.getElementPos(wrapDiv[j]).x;
                            if (movePos.x > startLeft && movePos.x < startLeft + wrapDiv[j].offsetWidth) {
                                //����div
                                if (wrapDiv[j].getElementsByTagName("div").length == 0) {
                                    dashedElement.style.width = wrapDiv[j].offsetWidth - 2 * parseInt(dashedElement.style.borderWidth) + "px";
                                    wrapDiv[j].appendChild(dashedElement);
                                }
                                else {
                                    var posFirstChild = $.getElementPos($.firstChild(wrapDiv[j], "div"));
                                    var posLastChild = $.getElementPos($.lastChild(wrapDiv[j], "div"));
                                    //�������������������/����MOVEʱ����������div������£��ֻص���ʼ��ק��������/�·�
                                    var tmpUp, tmpDown;
                                    if (tmpObj.colId == j) {
                                        tmpUp = tmpObj.firstChildUp;
                                        tmpDown = tmpObj.lastChildDown;
                                    }
                                    else {
                                        tmpUp = posFirstChild.y;
                                        tmpDown = posLastChild.y + $.lastChild(wrapDiv[j], "div").offsetHeight;
                                    }
                                    if (movePos.y < tmpUp) {//��������������߿�
                                        dashedElement.style.width = $.firstChild(wrapDiv[j], "div").offsetWidth - 2 * parseInt(dashedElement.style.borderWidth) + "px";
                                        wrapDiv[j].insertBefore(dashedElement, $.firstChild(wrapDiv[j], "div"));
                                    }
                                    else if (movePos.y > tmpDown) {//��������������߿�
                                        dashedElement.style.width = $.lastChild(wrapDiv[j], "div").offsetWidth - 2 * parseInt(dashedElement.style.borderWidth) + "px";
                                        wrapDiv[j].appendChild(dashedElement);
                                    }
                                }
                            }
                        }
                        
                    }
                };
                document.onmouseup = function() {
                    //��һЩ������
                    if (dragObj.moveable) {
                        if ($.isIE) {
                            dragDiv.releaseCapture();
                        }
                        else {
                            window.releaseEvents(dragDiv.mousemove);
                        }
                        dragObj.SetOpacity(dragDiv, 100);
                        dragObj.moveable = false;
                        dragObj.tmpX = 0;
                        dragObj.tmpY = 0;
                        //���д�ڴ�IF��
                        dragDiv.style.left = "";
                        dragDiv.style.top = "";
                        dragDiv.style.width = "";
                        dragDiv.style.position = "";
                        //�������
                        dashedElement.parentNode.insertBefore(dragDiv, dashedElement);
                        dashedElement.parentNode.removeChild(dashedElement);
                    }
                };
                //����
            }
        }
    },
    SetOpacity: function(dragDiv, n) {
        if ($.isIE) {
            dragDiv.filters.alpha.opacity = n;
        }
        else {
            dragDiv.style.opacity = n / 100;
        }
    },
    GetZindex: function() {
        var maxZindex = 0;
        var divs = document.getElementsByTagName("div");
        for (z = 0; z < divs.length; z++) {
            maxZindex = Math.max(maxZindex, divs[z].style.zIndex);
        }
        return maxZindex;
    },
    RegDragsPos: function() {
        var arrDragDivs = new Array();
        var dragTbl = $.getId("container");
        var tmpDiv, tmpPos;
        for (i = 0; i < dragTbl.getElementsByTagName("div").length; i++) {
            tmpDiv = dragTbl.getElementsByTagName("div")[i];
            if (tmpDiv.className == "dragDiv") {
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
    }
}
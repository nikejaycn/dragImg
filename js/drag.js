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
        //外层
        wrapDiv = $.getClass(wrapDiv);
        dragDiv = $.getItself(dragDiv);
		//追加数组
        ctrlObjArr = [];
		//判断ctrl键是否被按下
		isCtrl = false;
		
		//最大移动范围
        this.dragArea = {
            maxLeft: -9999,
            maxRight: 9999,
            maxTop: -9999,
            maxBottom: 9999
        };
         //设置点击默认透明60%
        this.opacity = 60;
					
        this.originDragDiv = null;
        this.tmpX = 0;
        this.tmpY = 0;
        this.moveable = false;
        this.dragArray = [];
        var dragObj = this;
					
        //修成为全体移动 鼠标点击可以移动
        dragDiv.onmousedown = function(e) {
            var ev = e || window.event || $.getEvent();

            //只允许通过鼠标左键进行拖拽,IE鼠标左键为1 FireFox为0
            if ($.isIE && ev.button == 1 || !$.isIE && ev.button == 0) {
				if($.getCtrl(ev)){
					isCtrl = true;
				}
            }
            else {
                return false;
            }
			
			//创建虚线框
            var dashedElement = $.createDashedElement(dragDiv);
			
			//FireFox 去除容器内拖拽图片问题
            if (ev.preventDefault) {
                ev.preventDefault();
                ev.stopPropagation();
            }
			
			//获取当前元素的基本信息，在dom中的节点位置，相对于浏览器的x，y坐标
            var tempCount;
            for (c = 0; c < wrapDiv.length; c++) {
                for (k = 0; k < wrapDiv[c].getElementsByTagName("div").length; k++) {
                    if (dragDiv.id == wrapDiv[c].getElementsByTagName("div")[k].id) {
                        tempCount = c;
                        break;
                    }
                }
            }
            var tmpPosFirstChild = $.getElementPos($.firstChild(wrapDiv[tempCount], "div")),
				tmpPosLastChild = $.getElementPos($.lastChild(wrapDiv[tempCount], "div"));
			
            if(isCtrl){
                //追加点击元素
				var tmpDivPos = $.getElementPos(dragDiv),
					isExists = false;
				
				//判断当前点击元素是否已经存在数组中，如果已经存在，就删除
				if(ctrlObjArr.length != 0){
					for(var l = 0; l < ctrlObjArr.length; l++){
						if(ctrlObjArr[l].objIdName === dragDiv.id){
							//删除元素
							ctrlObjArr.splice(l, 1);
							isExists = true;
						}
					}
				}

				if(!isExists){
					ctrlObjArr.push({
						obj: dragDiv,
						objIdName: dragDiv.id,
						countId: tempCount,
						firstChildUp: tmpPosFirstChild.y,
						lastChildDown: tmpPosLastChild.y + $.lastChild(wrapDiv[tempCount],"div").offsetHeight,
						tmpX: tmpDivPos.x,
						tmpY: tmpDivPos.y
					});
					//恢复默认值
					isExists = false;
				}
				
				//开始循环拖动元素
				/*
				document.onmousemove = function(e){
					alert('none');
				}
				*/
				//test
				/*
				try{
				alert(ctrlObjArr[ctrlObjArr.length - 1].tmpX + " : " + ctrlObjArr[ctrlObjArr.length - 1].tmpY);
				}catch(e){}
				*/
            }else{
                
				var tmpObj = {
					countId: tempCount,
					firstChildUp: tmpPosFirstChild.y,
					lastChildDown: tmpPosLastChild.y + $.lastChild(wrapDiv[tempCount],"div").offsetHeight
				};
                //保存当前所有可拖拽各容器的所在位置
                dragObj.dragArray = $.regDragsPos("container", "dragDiv");
                
				//插入虚线框
                if (dragDiv.nextSibling) {
                    dragDiv.parentNode.insertBefore(dashedElement, dragDiv.nextSibling);
                }
                else {
                    dragDiv.parentNode.appendChild(dashedElement);
                }
                //拖动时变为absolute
                dragDiv.style.width = dragDiv.offsetWidth + "px";
                dragDiv.style.position = "absolute";
                dragObj.moveable = true;
                dragDiv.style.zIndex = $.getZindex() + 1;
                var downPos = $.getMousePos(ev);
                
                dragObj.tmpX = downPos.x - dragDiv.offsetLeft;
                dragObj.tmpY = downPos.y - dragDiv.offsetTop;
                            
                if ($.isIE) {
                    dragDiv.setCapture();
                } else {
                    window.captureEvents(Event.mousemove);
                }
                //改变当前对象的透明度
                $.setOpacity(dragDiv, dragObj.opacity);
                
                //移动的时候
                document.onmousemove = function(e) {
                    if (dragObj.moveable) {
                        //拖动事件
                        var ev = e || window.event || $.getEvent();
                        //IE 去除容器内拖拽图片问题
                        if (document.all) //IE
                        {
                            ev.returnValue = false;
                        }
                        //获取当前鼠标的坐标，返回为arr{x:0, y:0}
                        var movePos = $.getMousePos(ev);
                        
                        //alert("d-x:" + downPos.x +" d-x:" + downPos.y + " t-x:" + dragObj.tmpX + " t-y" + dragObj.tmpY)
						//设定移动位置
                        var _left = Math.min(movePos.x - dragObj.tmpX, dragObj.dragArea.maxRight),
                            _top = Math.min(movePos.y - dragObj.tmpY, dragObj.dragArea.maxBottom);
                            
                            _left = Math.max(_left, dragObj.dragArea.maxLeft);
                            _top = Math.max(_top, dragObj.dragArea.maxTop);
                            
                        //改变拖动对象的位置
                        dragDiv.style.left = _left + "px";
                        dragDiv.style.top = _top + "px";
                        
                        //目标div
                        var targetDiv = null;
                        
                        //插入拖动虚线框
                        for (var k = 0; k < dragObj.dragArray.length; k++) {
                            //判读当前对象是否存在于可拖拽对象的集合里面
                            if (dragDiv == dragObj.dragArray[i]) {
                                continue;
                            }
                            
                            var _dragId = dragObj.dragArray[k].DragId,
                                _posLeft = dragObj.dragArray[k].PosLeft,
                                _posWidth = dragObj.dragArray[k].PosWidth,
                                _posTop = dragObj.dragArray[k].PosTop,
                                _posHeight = dragObj.dragArray[k].PosHeight;
                                
                            //判断拖动的对象停留在哪个位置
                            if (movePos.x > _posLeft && movePos.x < _posLeft + _posWidth && movePos.y > _posTop && movePos.y < _posTop + _posHeight ) {
                                //进行插入操作
                                targetDiv = $.getId(_dragId);
                                if (movePos.y < _posTop + _posHeight / 2) {
                                    //往上移
                                    dashedElement.style.width = targetDiv.offsetWidth - 2 * parseInt(dashedElement.style.borderWidth) + "px";
                                    targetDiv.parentNode.insertBefore(dashedElement, targetDiv);
                                }
                                else {
                                    //往下移
                                    dashedElement.style.width = targetDiv.offsetWidth - 2 * parseInt(dashedElement.style.borderWidth) + "px";
                                    if (targetDiv.nextSibling) {
                                        targetDiv.parentNode.insertBefore(dashedElement, targetDiv.nextSibling);
                                    }
                                    else {
                                        targetDiv.parentNode.appendChild(dashedElement);
                                    }
                                }
                            }
                        } // end the for
                        
                        
                        for (j = 0; j < wrapDiv.length; j++) {
                            var startLeft = $.getElementPos(wrapDiv[j]).x;
                            if (movePos.x > startLeft && movePos.x < startLeft + wrapDiv[j].offsetWidth) {
                                //列无div
                                if (wrapDiv[j].getElementsByTagName("div").length == 0) {
                                    dashedElement.style.width = wrapDiv[j].offsetWidth - 2 * parseInt(dashedElement.style.borderWidth) + "px";
                                    wrapDiv[j].appendChild(dashedElement);
                                }
                                else {
                                    var posFirstChild = $.getElementPos($.firstChild(wrapDiv[j], "div"));
                                    var posLastChild = $.getElementPos($.lastChild(wrapDiv[j], "div"));
                                    //处理特殊情况：在最上/下面MOVE时不碰到现有div的情况下，又回到起始拖拽的列最上/下方
                                    var tmpUp, tmpDown;
                                    if (tmpObj.countId == j) {
                                        tmpUp = tmpObj.firstChildUp;
                                        tmpDown = tmpObj.lastChildDown;
                                    }
                                    else {
                                        tmpUp = posFirstChild.y;
                                        tmpDown = posLastChild.y + $.lastChild(wrapDiv[j], "div").offsetHeight;
                                    }
                                    if (movePos.y < tmpUp) {//从最上面插入虚线框
                                        dashedElement.style.width = $.firstChild(wrapDiv[j], "div").offsetWidth - 2 * parseInt(dashedElement.style.borderWidth) + "px";
                                        wrapDiv[j].insertBefore(dashedElement, $.firstChild(wrapDiv[j], "div"));
                                    }
                                    else if (movePos.y > tmpDown) {//从最下面插入虚线框
                                        dashedElement.style.width = $.lastChild(wrapDiv[j], "div").offsetWidth - 2 * parseInt(dashedElement.style.borderWidth) + "px";
                                        wrapDiv[j].appendChild(dashedElement);
                                    }
                                }
                            }
                        }// end the for
                        
                    }
                };//end the document.onmousemove
				
                document.onmouseup = function() {
					//恢复ctrl键位状态
					isCtrl = false;
                    //做一些清理工作
                    if (dragObj.moveable) {
                        if ($.isIE) {
                            dragDiv.releaseCapture();
                        }
                        else {
                            window.releaseEvents(dragDiv.mousemove);
                        }
                        $.setOpacity(dragDiv, 100);
                        dragObj.moveable = false;
                        dragObj.tmpX = 0;
                        dragObj.tmpY = 0;
                        //务必写在此IF内
                        dragDiv.style.left = "";
                        dragDiv.style.top = "";
                        dragDiv.style.width = "";
                        dragDiv.style.position = "";
						
                        //插入对象
                        dashedElement.parentNode.insertBefore(dragDiv, dashedElement);
                        dashedElement.parentNode.removeChild(dashedElement);
                    }
                }; //end the document.onmouseup
				
            }//end the isCtrl
			
        }// end the dragDiv.onmousedown
    }// end the init
}
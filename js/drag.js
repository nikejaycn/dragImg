function drag(el, ev){
	var startX = ev.clientX, startY = ev.clientY,
		origX = el.offsetLeft, origY = el.offsetTop,
		deltaX = startX - origX, deltaY =  startY - origY;
		
		if(document.addEventListener){	//dom 2.0 event model
			document.addEventListener("mousemove", moveHandler, true);
			document.addEventListener("mouseup", upHandler, true);
		}else if(document.attachEvent){ // ie5+ event model
			el.setCapture();
			el.attachEvent("onmousemove", moveHandler);
			el.attachEvent("onmouseup", upHandler);
			el.attachEvent("onlosecapture", upHandler);
		}
		
		//事件冒泡
		if(ev.stopPropagation){
			ev.stopPropagation();
		}else{
			ev.cancelBubble = true;
		}
		
		if(ev.preventDefault){
			ev.preventDefault();
		}else{
			ev.returnValue = false;
		}
		
		function moveHandler(e){
			if(!e) e = window.event;
			
			el.style.position= "absolute";
			el.style.left = (e.clientX - deltaX) + "px";
			el.style.top = (e.clientY - deltaY) + "px";
			el.style.opacity = 0.5;
			
			if(e.stopPropagation) e.stopPropagation();
			else e.cancelBubble = true;
		}
		
		function upHandler(e){
			if(!e) e = window.event; //IE event model
			if(document.removeEventListener){
				document.removeEventListener("mousemove", moveHandler, true);
				document.removeEventListener("mouseup", upHandler, true);
			}else if(document.detachEvent){
				el.detachEvent("onmousemove", moveHandler);
				el.detachEvent("onmouseup", upHandler);
				el.detachEvent("onlosecapture", upHandler);
				el.releaseCapture();
			}
			
			if(e.stopPropagation) e.stopPropagation();
			else e.cancelBubble = true;
		}
}
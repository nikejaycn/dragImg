/*
* 简易的dom操作
*/
var $ = {
	//根据ID返回dom对象
	"getId" : function(id){
		return document.getElementById(id);
	},
	//根据class以数组形式返回dom对象
	"getClass" : function(theClass){
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
	"getMousePosition" :  function(ev){
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
	}
}
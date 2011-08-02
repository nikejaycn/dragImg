/*
* ���׵�dom����
*/
var $ = {
	//����ID����dom����
	"getId" : function(id){
		return document.getElementById(id);
	},
	//����class��������ʽ����dom����
	"getClass" : function(theClass){
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
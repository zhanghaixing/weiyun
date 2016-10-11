var tools = (function(){

	var toolsObj = {
		$:function(selector,context){
			context = context || document;
			if(selector.indexOf(" ") !== -1){
				return context.querySelectorAll(selector);
			}else if( selector.charAt(0) === "#" ){
				return document.getElementById(selector.slice(1))
			}else if( selector.charAt(0) === "." ){
				return context.getElementsByClassName(selector.slice(1));
			}else{
				return context.getElementsByTagName(selector);
			}
		},
		view:function (){
			return {
				W:document.documentElement.clientWidth,
				H:document.documentElement.clientHeight
			}	
		},
		addEvent:function (obj,evName,fnName){
			obj.addEventListener(evName,fnName,false);	
		},
		removeEvent:function (obj,evName,fnName){
			obj.removeEventListener(evName,fnName,false);	
		},
		addClass:function (element,clsNames){
			if( typeof clsNames === "string" ){
				if(!tools.hasClass(element,clsNames)){
					element.className += " "+clsNames;
				}
			}
		},
		removeClass:function (element,clsNames){
			var classNameArr = element.className.split(" ");
			for( var i = 0; i < classNameArr.length; i++ ){
				if( classNameArr[i] === clsNames ){
					classNameArr.splice(i,1);
					i--;
				}
			}
			element.className = classNameArr.join(" ");
		},
		hasClass:function(ele,classNames){
			
			var classNameArr = ele.className.split(" ");
			for( var i = 0; i < classNameArr.length; i++ ){
				if( classNameArr[i] === classNames ){
					return true;
				}
			}

			return false;
		},
		toggleClass:function (ele,classNames){
			if( tools.hasClass(ele,classNames) ){
				tools.removeClass(ele,classNames);
				return false;
			}else{
				tools.addClass(ele,classNames);
				return true;
			}
		},
		parents:function (element,selector){

			var first = selector.charAt();
			//怎么判断是doucment

			if( first === "#" ){
				selector = selector.slice(1); 
				while(element.nodeType != 9 && element.id != selector){  //当前这个元素的id不为box
					element = element.parentNode;
				}
			}else if(first === "."){
				selector = selector.slice(1); 
				while(element.nodeType != 9 && !tools.hasClass(element,selector)){  //当前这个元素的id不为box
					element = element.parentNode;

					//console.log( element );
				}
			}else {
				while(element.nodeType != 9 && element.nodeName.toLowerCase() != selector){  //当前这个元素的id不为box
					element = element.parentNode;
				}
			}

			return element.nodeType === 9 ? null : element;
		},
		getTreeById:function (classNams,id){
		   var classElement = tools.$("."+classNams);
		   for( var i = 0; i < classElement.length; i++ ){
		     if( classElement[i].dataset.fileId == id ){
		        return  classElement[i];
		     }
		   }
		   return null;
		},
		uuid:function (){
			return new Date().getTime();
		},
		getRect:function (obj){
			return obj.getBoundingClientRect();
		},
		duang: function (obj1,obj2){
			var obj1Info = tools.getRect(obj1);	
			var obj2Info = tools.getRect(obj2);	

			//obj1的上下左右

			var obj1L = obj1Info.left;
			var obj1R = obj1Info.right;
			var obj1T = obj1Info.top;
			var obj1B = obj1Info.bottom;

			//obj2的上下左右
			var obj2L = obj2Info.left;
			var obj2R = obj2Info.right;
			var obj2T = obj2Info.top;
			var obj2B = obj2Info.bottom;

			//排除掉没碰上的区域

			if( obj1R < obj2L || obj1L > obj2R || obj1B < obj2T || obj1T > obj2B){
				return false;
			}else{
				return true;
			}
		}
	}

	return toolsObj;

}())

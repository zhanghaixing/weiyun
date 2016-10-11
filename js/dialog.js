function dialog(options){

	options = options || {};

	var defaults = {
		title:options.title || '这是一个弹框',
		content:options.content || '这是一个弹框,请写内容',
		okFn:options.okFn || function(){}
	}


	var dialogObj = {
		move:function (options){
			options = options || {};
			var defaults = {
				dragObj:options.dragObj,
				moveObj:options.moveObj
			}
			defaults.dragObj.onmousedown  =function (ev){
				var disX = ev.clientX - defaults.moveObj.offsetLeft;
				var disY = ev.clientY - defaults.moveObj.offsetTop;

				document.onmousemove = function (ev){
					defaults.moveObj.style.left = ev.clientX - disX + "px";
					defaults.moveObj.style.top = ev.clientY - disY + "px";	
				};
				document.onmouseup = function (ev){
					document.onmousemove = document.onmouseup = null;	
				};

			};

		},	
		fullDiv:null,
		html:function (){
			var newDiv = document.createElement("div");

			var html  ='<h3>\
				<p class="title">'+defaults.title+'</p>\
				<a href="javascript:void(0);" class="close" title="关闭">×</a>\
			</h3>\
			<div class="content">\
				1111\
			</div>\
			<div class="pop-btns">\
				<span class="error"></span>\
				<a href="javascript:void(0)" class="confirm">确定</a>\
				<a href="javascript:void(0)" class="cancel">取消</a>\
			</div>';
			newDiv.className = 'full-pop';
			newDiv.innerHTML = html;

			return newDiv;
		},
		view:function (){
			return {
				W: document.documentElement.clientWidth,
				H: document.documentElement.clientHeight
			}	
		},
		setPosition:function (){
			dialogObj.fullDiv.style.left = (dialogObj.view().W - dialogObj.fullDiv.offsetWidth)/2 + 'px';	
			dialogObj.fullDiv.style.top = (dialogObj.view().H - dialogObj.fullDiv.offsetHeight)/2 + 'px';
		},
		init:function (){
			var fullDiv = dialogObj.html();
			document.body.appendChild(fullDiv);

			var content = fullDiv.getElementsByClassName("content")[0];
			content.innerHTML = defaults.content;

			dialogObj.fullDiv = fullDiv;


			//定位
			dialogObj.setPosition();
			//添加事件处理
			dialogObj.addEvent();

			var h3 = fullDiv.getElementsByTagName("h3")[0];
			//做拖拽的
			dialogObj.move({
				dragObj:h3,
				moveObj:fullDiv
			})


		},
		addEvent:function (){
			window.addEventListener("resize",dialogObj.setPosition,false);

			//关闭
			var closes = dialogObj.fullDiv.getElementsByClassName("close")[0];

			closes.onclick = function (){
				document.body.removeChild(dialogObj.fullDiv);
				move.onOff = false;	
				mask.style.display  = 'none';
			};
			//确定
			var confirm = dialogObj.fullDiv.getElementsByClassName("confirm")[0];

			confirm.onclick = function (){
				var bl = defaults.okFn();
				/*
					true 不允许删除
					false 允许删除
				*/
				if( !bl ){
					document.body.removeChild(dialogObj.fullDiv);	
				}
			};
			//取消
			var cancel = dialogObj.fullDiv.getElementsByClassName("cancel")[0];

			cancel.onclick = function (){
				document.body.removeChild(dialogObj.fullDiv);
				move.onOff = false;	
				mask.style.display  = 'none';
			};


		}

	}

	//初始化
	dialogObj.init();		
}
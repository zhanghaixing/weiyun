;(function() {

    
///////////////////////////////////////////////////////////设置内容区与的高度自适应///////////////////////////////////////////////////////////

    var content = tools.$('#content');      
    var header = tools.$("#header");        
    var mainBottomLeft  = tools.$('.main_bottom_left')[0];
    var mainBottomRight = tools.$('.main_bottom_right')[0];

    changeSize();
///////////////////////////////////////////////////////////自适应高度函数///////////////////////////////////////////////////////////
    function changeSize(){
        var clinetH = tools.view().H;  //可视区的高
        var clinetW = tools.view().W;  //可视区的高
        mainBottomRight.style.width = clinetW - mainBottomLeft.offsetWidth - nav.offsetWidth + "px";  
        content.style.height = clinetH - header.offsetHeight + "px"; 
        mainBottomLeft.style.height =  clinetH - main_header.offsetHeight - 20 - header.offsetHeight + "px";
    }


///////////////////////////////////////////////////////////resize///////////////////////////////////////////////////////////
    tools.addEvent(window,"resize",changeSize);

///////////////////////////////////////////////////////////数据///////////////////////////////////////////////////////////
var datas = data.files;
//获取文件区域的容器
    var disContent = tools.$('#disContent');

///////////////////////////////////////////////////////////渲染文件区域函数///////////////////////////////////////////////////////////
    function createFilesHtml(datas,id){
        var childs = dataAction.getChildsById(datas,id);
        var str = '';
        for( var i = 0; i < childs.length; i++ ){
          str += view.createFileConstruct(childs[i]);
        }
        return str;
    }

///////////////////////////////////////////////////////////渲染文件和导航和树形区域///////////////////////////////////////////////////////////
    function renderFileNavTree(fileId){
        //渲染文件区域
        disContent.innerHTML = createFilesHtml(datas,fileId);
        //导航区
        pathNav.innerHTML = view.createPathNavConstruct(datas,fileId);

        //定位到属性导航区中某一个菜单上
        var prev = tools.getTreeById("tree-title",prevId);
        var tree = tools.getTreeById("tree-title",fileId);
        tools.removeClass(prev,"tree-nav");
        tools.addClass(tree,"tree-nav");
        prevId = fileId;
        checkboxAddEvent();
    }


///////////////////////////////////////////////////////////找到被选中的元素///////////////////////////////////////////////////////////
    function whoSelect(){
        var arr = [];
        for( var i = 0; i < checkboxs.length; i++ ){
            if( tools.hasClass(checkboxs[i],"conCheckbox") ){
                arr.push(tools.parents(checkboxs[i],".list"));
            }
        }
        return arr;
    }

///////////////////////////////////////////给每一个checkbox添加点击处理程序的函数///////////////////////////////////////////////////////////
    function fn(obj){
        tools.addEvent(obj,"mousedown",function (ev){
            ev.stopPropagation();
        });

        tools.addEvent(obj,"click",function (ev){

            if(rename.onOff){

                var select = whoSelect();

                var fileTitle = tools.$('.file-title',select[0])[0];
                var fileEdtor = tools.$('.file-edtor',select[0])[0];
                var edtor = tools.$('.edtor',fileEdtor)[0];

                if(edtor.value.trim() === fileTitle.innerHTML || edtor.value.trim() === '' ){
                    fileTitle.style.display = 'block';       //隐藏标题
                    fileEdtor.style.display = 'none';      //显示输入框
                }else{
                    var selectId = select[0].dataset.fileId;   //要改名字的文件夹id
                    var thisData = dataAction.getDataById(datas,selectId);  //找到这个数据
                    thisData.title = fileTitle.innerHTML = edtor.value.trim();      //将数据的title改为当前输入框的值
                    
                    fileTitle.style.display = 'block';  //显示文件名
                    fileEdtor.style.display = 'none';   //隐藏输入框
                    /////树形菜单区域
                    var treeMenu = tools.$(".main_bottom_left")[0];
                    treeMenu.innerHTML = view.createTreeHtml(datas,-1);
                    iconClick();

                    tools.addClass(tip,"addtip");        //移除添加时的class
                    tools.removeClass(tip,"tipBg");            //给tip添加class,改变背景图位置
                    tip.innerHTML = "重命名成功";
                    run(tip);    
                }
            }

            var isAddClass = tools.toggleClass(this,"conCheckbox");
            if( isAddClass ){
                if( whoSelect().length === checkboxs.length  ){
                    tools.addClass(checkAll,"checkAct");
                }
            }else{
                tools.removeClass(checkAll,"checkAct");
            }
            ev.stopPropagation();
        })
        
    }

///////////////////////////////////////////////////////////提示框///////////////////////////////////////////////////////////
    var tip = tools.$(".tip")[0];
    function run(obj){
        obj.style.top = -35+'px';
        Movement(obj,{top:-3},500,"linear",function(){
            setTimeout(function(){
                Movement(obj,{top:-35},300,"linear")
            },500)
        });
    }

//////////////////////////////////////////////////////单选///////////////////////////////////////////////////////////
    function checkboxAddEvent(){
        for( var i = 0; i < checkboxs.length; i++ ){
             fn(checkboxs[i]);
        } 
    }

//////////////////////////////////////////////////////可视区宽高//////////////////////////////////////////////////////
    function views(){
        return {
            W:document.documentElement.clientWidth,
            H:document.documentElement.clientHeight
        }
    }

//////////////////////////////////////////////////////确定,取消,关闭//////////////////////////////////////////////////////
    function okCancleClose(){
        var select = whoSelect();
        ok.onmouseup = function(ev){
            var arr = [];           //用来存要删除的文件夹的id
            for(var i = 0; i < select.length; i++ ){

                disContent.removeChild(select[i]);          //移除选中元素
                checkAll.onOff = false;                     //全选按钮的状态为true
                var fileId = select[i].dataset.fileId;      //获取到当前选中文件的id,push到数组中,
                
                var treeFile = tools.getTreeById("tree-title",fileId);
                
                //在属性菜单中把tree的父级移除掉
                treeFile.parentNode.parentNode.removeChild(treeFile.parentNode);
                arr.push(fileId);
            }
            
            
            alertBox.style.display = mask.style.display = 'none';
            tools.removeClass(tip,"tipBg");            //给tip添加class,改变背景图位置
            tip.innerHTML = "删除文件成功";           //改变显示的文字
            
            run(tip);           //运动
            dataAction.batchDelect(datas,arr);            //删除数据
            deleteFile.onOff = false;
            delectBtn.onOff = false;
            if ( checkboxs.length === 0 ) {           //当页面中没有元素存在时，移除全选的勾选框
                fileEmpty.style.display = 'block';
                disContent.style.display = 'none';
                tools.removeClass(checkAll,"checkAct"); 
                var pathNavLast = tools.$("span",pathNav)[0];   //导航中最后一个元素span
                var pid = pathNavLast.dataset.fileId;           //当前创建的元素的pid就是导航区域的最后一个span的id
                tools.removeClass(tools.getTreeById("tree-title",pid),"tree-contro");  //移除新建文件夹的父级的身上的没有小图标的class
                tools.addClass(tools.getTreeById("tree-title",pid),"tree-contro-none");  //移除新建文件夹的父级的身上的没有小图标的class
            }
        }  


        tools.addEvent(cancle,'mousedown',function(ev){
            ev.stopPropagation();
        }) 

        tools.addEvent(cancle,'mouseup',function(){
            deleteFile.onOff = false;
            delectBtn.onOff = false;
            alertBox.style.display = mask.style.display  = 'none';
        }) 
        


        tools.addEvent(close,'mousedown',function(ev){
            ev.stopPropagation();
        })
        tools.addEvent(close,'mouseup',function(){
            deleteFile.onOff = false;
            delectBtn.onOff = false;
            alertBox.style.display = mask.style.display  = 'none';
        }) 
    }

//////////////////////////////////////////////////////清空所有的样式//////////////////////////////////////////////////////
    function empty(){
        for(var i = 0; i < checkboxs.length; i++){
            tools.removeClass(allList[i],"active");
            checkboxs[i].style.opacity = 0;
            tools.removeClass(checkboxs[i],"conCheckbox");
        }
        tools.removeClass(checkAll,"checkAct");     //给当前元素添加class
    }

//////////////////////////////////////////////////////新建成功的函数//////////////////////////////////////////////////////

    function addMkdirFn(){
        var first = disContent.firstElementChild;
        var title = tools.$('.file-title',first)[0];
        var edtor = tools.$('.file-edtor',first)[0];
        var edtorInput = tools.$('.edtor',edtor)[0];
    
    //获取到这个输入框和value
        var edtorInput = tools.$('.edtor',edtor)[0];
        var edtorVal = edtorInput.value.trim();

        var pathNavLast = tools.$("span",pathNav)[0];   //导航中最后一个元素span
        var pid = pathNavLast.dataset.fileId;           //当前创建的元素的pid就是导航区域的最后一个span的id

        if( edtorVal === "" ){      //新建不成功,移除当前元素
            disContent.removeChild(first);          //移除第一个文件夹结构
            checkboxAddEvent();                     //给新建的文件夹添加点击事件处理

        }else if( dataAction.reName(datas,pid,edtorVal) ){  //名字冲突
            disContent.removeChild(first);          //新建不成功
            checkboxAddEvent();                     //给所有文件夹添加点击事件处理
            tools.removeClass(tip,"addtip");        //移除添加时的class
            tools.addClass(tip,"tipBg");            //给tip添加class,改变背景图位置
            tip.innerHTML = "文件夹名称重名了";
            run(tip);                               //提醒
        }else{                  //新建成功
            title.innerHTML = edtorVal;      //将输入框的值给了文件夹的title
            title.style.display = 'block';   //文件夹名称显示
            edtor.style.display = 'none';    //隐藏输入框
            //添加数据
            var newFile = {
                id: first.dataset.fileId,
                pid:pid,
                title:edtorVal,
                type:"file"
            }
            datas.unshift(newFile);         //数据添加到第一个
            var tree = tools.getTreeById("tree-title",pid);     //树形菜单
            var nextUl = tree.nextElementSibling;               //文件夹名称的子级
            nextUl.innerHTML += view.createTreeLi(datas,newFile);
            tools.removeClass(checkAll,"checkAct");              //全选按钮不勾选
            //通过tree-title找到在pid下的所有的树形菜单的元素
            tools.removeClass(tools.getTreeById("tree-title",pid),"tree-contro-none");  //移除新建文件夹的父级的身上的没有小图标的class
            tools.addClass(tools.getTreeById("tree-title",pid),"tree-contro");          //给它的父级添加有小图标的class

            //提示框
            tools.removeClass(tip,"tipBg");            //给tip添加class,改变背景图位置
            tip.innerHTML = "新建文件夹成功";
            run(tip);

            checkboxAddEvent();     //给所有的文件夹添加点击事件处理
        }
        addMkdir.onOff = false;     //更改新建文件夹的开关状态
    }
    var fileEmpty = tools.$('#file_empty');
    var alertBox = tools.$("#alertBox");
    var mask = tools.$("#mask");
    var ok = tools.$("#ok");                  
    var cancle = tools.$("#cancle");          
    var close = tools.$(".close")[0]; 
//////////////////////////////////////////////////////框选时移动的函数//////////////////////////////////////////////////////
    function moveFn(ev){
        //当鼠标移动到20px的距离时，才创建框框
        if( Math.abs(ev.clientX - disX) > 20 ||  Math.abs(ev.clientY - disY) > 20 ){
             if( !newDiv ){     //如果框框不存在

                newDiv = document.createElement("div");
                newDiv.className = "box";
                newDiv.style.left = disX + "px";
                newDiv.style.top = disX + "px";

                document.body.appendChild(newDiv); 
                newDiv.style.zIndex = 20;
            }

            newDiv.style.width = Math.abs(ev.clientX - disX) + "px";
            newDiv.style.height = Math.abs(ev.clientY - disY) + "px";

            newDiv.style.left = Math.min(ev.clientX , disX)+1 + "px";
            newDiv.style.top = Math.min(ev.clientY , disY)+1 + "px";
            //碰撞检测
            for( var i = 0; i < allList.length; i++ ){
                if( tools.duang(newDiv,allList[i]) ){       //碰到了
                   tools.addClass(allList[i],"active");     //添加class
                   allList[i].firstElementChild.style.opacity = 1;  //显示勾选框
                   tools.addClass(checkboxs[i],"conCheckbox");  //添加class
                }else{                      //没碰到
                   tools.removeClass(allList[i],"active");          //移除class
                   allList[i].firstElementChild.style.opacity = 0;  //隐藏勾选框
                   tools.removeClass(checkboxs[i],"conCheckbox");   //移除class
                }
            }
        }
    }

///////////////////////////////////////////////////////////框选时up的函数///////////////////////////////////////////////////////////
    function upFn(ev){
        tools.removeEvent(document,"mousemove",moveFn);    //移除move的函数
        tools.removeEvent(document,"mouseup",upFn);        //移除up的函数

        if( newDiv ) document.body.removeChild(newDiv);     //如果页面中有div，就将其移除掉

        if( checkboxs.length && whoSelect().length === checkboxs.length ){      //判断是否都选上了，
            tools.addClass(checkAll,"checkAct");
        }   
    }

///////////////////////////////////////////////////////////拖拽文件///////////////////////////////////////////////////////////
    function moveFileFn(ev){
        //拖拽到指定的距离的时候,显示剪影
        if( Math.abs(ev.clientX - disX) > 10 ||  Math.abs(ev.clientY - disY) > 10 ){

            if(!shadow){
                shadow = view.moveFileShadow();     //移动的时候的简影
                document.body.appendChild(shadow);  //将元素放到document中
                shadow.style.display = 'block';     //显示出来


                //做碰撞检测的时候的框
                moveTips = document.createElement("div");
                moveTips.style.cssText = 'width:10px;height: 10px;position:absolute;left:0;top:0;'
                document.body.appendChild(moveTips);
            }
            
            isDrag = true;
            moveTips.style.left = ev.clientX + 'px';
            moveTips.style.top = ev.clientY + 'px';

            shadow.style.left = ev.clientX+5 + 'px';
            shadow.style.top = ev.clientY+5 + 'px';

            if( !tools.hasClass(shadowTarget,"active") ){
                //清空所有的
                empty();

                var checkbox = tools.$(".checkbox",shadowTarget)[0];
                tools.addClass(checkbox.parentNode,"active");
                checkbox.style.opacity = 1;
                tools.addClass(checkbox,"conCheckbox");
            }

            var selectArr = whoSelect();            //获取谁是选中状态

            var sum = tools.$(".sum",shadow)[0];    //当前移动的时几个文件夹数字
            var icons = tools.$(".icons",shadow)[0];//当前移动的时几个文件夹背景

            sum.innerHTML = selectArr.length;       //将文件夹数量给了sum
            var str = '';
            var len = selectArr.length > 4 ? 4 : selectArr.length;

            for( var i = 0; i < len; i++ ){
                str += '<i class="icon icon'+i+' filetype icon-folder"></i> '
            }

            icons.innerHTML = str;

            pengObj = null;

            //碰撞检测

            for( var i = 0; i < allList.length; i++ ){
                //fileItems[i]
                //要碰撞的元素是否存在于被选中的数组中
                if(!indexOf(selectArr,allList[i]) && tools.duang(moveTips,allList[i])  ){
                    tools.removeClass(allList[i],"active");         //将碰撞到的元素移除class
                    allList[i].firstElementChild.style.opacity = 0;

                    allList[i].style.background = "skyblue";
                    pengObj = allList[i];               //将碰到的那个元素给了pengObj
                }else{
                    allList[i].style.background = "";
                }

            }
        }
    }

///////////////////////////////////////////////////////////拖拽文件///////////////////////////////////////////////////////////
    function upFileFn(ev){
        //清除移动的时候的函数
        tools.removeEvent(document,"mousemove",moveFileFn);
        tools.removeEvent(document,"mouseup",upFileFn);
        //移除简影和那个框
        if( shadow ){
            document.body.removeChild(shadow);
            document.body.removeChild(moveTips);

            shadow = null;
        }   

        //如果碰撞元素存在的话
        if( pengObj ){      //在移动的函数中碰撞检测里赋值的
            var pengObjId = pengObj.dataset.fileId;     //获取到碰撞元素的id
            var selectArr = whoSelect();        //选中的
            var childsTitle = dataAction.getChildsById(datas,pengObjId);   //获取到碰撞元素的子级


            for( var i = 0; i < selectArr.length; i++ ){    //循环选中设为文件夹
                var getData = dataAction.getDataById(datas,selectArr[i].dataset.fileId);    //移动的那些文件夹
                
                var onOff = true;
                //循环选中的那些文件夹
                for( var j = 0; j < childsTitle.length; j++ ){
                    //如果当前移动的与目标文件夹中的文件名称重复了,就提示,并且不移动这个文件夹
                    if( childsTitle[j].title == getData.title ){
                        tools.removeClass(tip,"addtip");        //移除添加时的class
                        tools.addClass(tip,"tipBg");            //给tip添加class,改变背景图位置
                        tip.innerHTML = "(1051)文件名重复";
                        run(tip); 

                        //显示提示框
                        onOff = false;
                        break;
                    }
                }
                if( onOff ){
                    getData.pid = pengObjId;
                }  
            }

            var cur = tools.$(".current-path")[0].dataset.fileId;
            ////先渲染文件区域的内容
            disContent.innerHTML = createFilesHtml(datas,cur);
            //树形菜单区域
            treeMenu.innerHTML = view.createTreeHtml(datas,-1);

            iconClick();        //小图标点击展开收缩
            tools.addClass(tools.getTreeById("tree-title",cur),"tree-nav");      //找到第一个tree，添加上class
            checkboxAddEvent();
            pengObj = null;
        }
        isDrag  =false; 
    }

    function indexOf(arr,item){
        for( var i = 0; i < arr.length; i++ ){
            if( arr[i] === item ){
            return true;
            }
        }  

        return false;
    }


    function reNameFn(ev){
        ev.stopPropagation();
        if( move.onOff || deleteFile.onOff || ev.button === 2 ) return;

        if( addMkdir.onOff ){
            addMkdirFn();
        }
        var select = whoSelect();

        if( select.length === 0 ){
            tip.innerHTML = "请选择文件";
            tools.removeClass(tip,"addtip");        //移除添加时的class
            tools.addClass(tip,"tipBg");            //给tip添加class,改变背景图位置
            run(tip);
        }else if( select.length > 1 ){
            menu.style.display = 'none';
            tip.innerHTML = "只选一个文件";
            tools.removeClass(tip,"addtip");        //移除添加时的class
            tools.addClass(tip,"tipBg");            //给tip添加class,改变背景图位置
            run(tip);
        }else{
            //获取下面的元素

            rename.onOff = true;
            var fileTitle = tools.$('.file-title',select[0])[0];
            var fileEdtor = tools.$('.file-edtor',select[0])[0];
            var edtor = tools.$('.edtor',select[0])[0];

            fileTitle.style.display = 'none';       //隐藏标题
            fileEdtor.style.display = 'block';      //显示输入框
            edtor.value = fileTitle.innerHTML;      //将标题给到输入框的内容
            edtor.select();     //内容为全选状态
            menu.style.display = 'none';

            ////////点击输入框的时候,阻止冒泡
            tools.addEvent(edtor,"click",function (ev){
                ev.stopPropagation();    
            });
            tools.addEvent(edtor,"mousedown",function (ev){
                ev.stopPropagation();    
            });
        }
        
    }





    ////先渲染文件区域的内容
    disContent.innerHTML = createFilesHtml(datas,0);

    //文件导航区域

    var pathNav = tools.$(".path-nav")[0];
    pathNav.innerHTML = view.createPathNavConstruct(datas,0);

    //树形菜单区域的容器
    var treeMenu = tools.$(".main_bottom_left")[0];
    treeMenu.innerHTML = view.createTreeHtml(datas,-1);


///////////////////////////////////////////////////////////功能区///////////////////////////////////////////////////////////

tools.addEvent(disContent,"mouseover",function (ev){
    if( isDrag ) return;
    var target = ev.target;
    if( target = tools.parents(target,".list") ){       //判断目标文件是不是list所在的元素
        target.firstElementChild.style.opacity = 1;     //将勾选框的透明度设置为显示状态
        tools.addClass(target,"active");                //给当前有list的元素加上class
    }
});
///////////////////////////////////////////////////////////鼠标移出///////////////////////////////////////////////////////////
tools.addEvent(disContent,"mouseout",function (ev){
    var target = ev.target;
    if( target = tools.parents(target,".list") ){ 
    //获取到目标源下面的第一个元素    
        var firstEle = tools.$(".checkbox",target)[0];

        if( !tools.hasClass(firstEle,"conCheckbox") ){            //第一个元素身上没有class,鼠标移出的时候就将移入效果去掉
            target.firstElementChild.style.opacity = 0;     //将勾选框的透明度设置为不显示状态
            tools.removeClass(target,"active");             //移除元素身上的class
        }
        
    }
});

///////////////////////////////////////////////////////////文件点击///////////////////////////////////////////////////////////

tools.addEvent(disContent,"click",function (ev){
    if( move.onOff || deleteFile.onOff ) return;
    var target = ev.target;
    if(target = tools.parents(target,".list")){ //重新给target指定元素
        var fileId = target.dataset.fileId;     //获取到目标元素的id
        renderFileNavTree(fileId);              //重新渲染导航区域的内容
        tools.removeClass(checkAll,"checkAct"); //把全选的勾选去掉
        if(checkboxs.length === 0){
            fileEmpty.style.display = 'block';
            disContent.style.display = 'none';
        }else{
            fileEmpty.style.display = 'none';
            disContent.style.display = 'block';
        }
    }
});


///////////////////////////////////////////////////////////文件导航区域///////////////////////////////////////////////////////////
tools.addEvent(pathNav,"click",function (ev){
    if( move.onOff || deleteFile.onOff ) return;
    var target = ev.target;
    if( target = tools.parents(target,"a") ){   //重新给target指定元素
        var fileId = target.dataset.fileId;     //获取到目标元素的id
        renderFileNavTree(fileId);              //重新渲染导航区域的内容
    }  
    if(checkboxs.length === 0){
        fileEmpty.style.display = 'block';
        disContent.style.display = 'none';
    }else{
        fileEmpty.style.display = 'none';
        disContent.style.display = 'block';
    }
});

///////////////////////////////////////////////////////////树形菜单///////////////////////////////////////////////////////////
var prevId = 0;     //记录操作的树形菜单的id
tools.addClass(tools.getTreeById("tree-title",prevId),"tree-nav");      //找到第一个tree，添加上class

///////////////////树形菜单区域
tools.addEvent(treeMenu,"click",function (ev){      //点击每一个树形菜单区域,
    //if( move.onOff || deleteFile.onOff ) return;
    

    
    tools.removeClass(checkAll,"checkAct");              //全选按钮不勾选

    var target = ev.target;
    if( target = tools.parents(target,".tree-title") ){ //重新给target指定元素
        var fileId = target.dataset.fileId;             //获取到目标元素的id
        renderFileNavTree(fileId);                      //根据点击树形菜单区域的不同地方,;来重新渲染导航区域的内容
    }      

    if(checkboxs.length === 0){
        fileEmpty.style.display = 'block';
        disContent.style.display = 'none';
    }else{
        fileEmpty.style.display = 'none';
        disContent.style.display = 'block';
    }    
});


///////////////////////////////////////////////////////////全选///////////////////////////////////////////////////////////
var checkAll = tools.$('.checkall')[0];             //全选

var allList = tools.$(".list",disContent);          //找到所有的文件夹
var checkboxs = tools.$(".checkbox",disContent);    //找到所有的checkbox

tools.addEvent(checkAll,'mousedown',function(ev){
    ev.stopPropagation();
});


tools.addEvent(checkAll,'click',function(){         //给全选按钮添加click事件处理
    if(checkboxs.length === 0 || move.onOff || deleteFile.onOff ) ;             //页面中没有元素的时候，不可以勾选全选框
    ////判断是不是新建
    if(addMkdir.onOff){
        addMkdirFn();

    }
    if(rename.onOff){
        var select = whoSelect();

        var fileTitle = tools.$('.file-title',select[0])[0];
        var fileEdtor = tools.$('.file-edtor',select[0])[0];
        var edtor = tools.$('.edtor',fileEdtor)[0];

        if(edtor.value.trim() === fileTitle.innerHTML){
            fileTitle.style.display = 'block';       //隐藏标题
            fileEdtor.style.display = 'none';      //显示输入框
        }else{
            var selectId = select[0].dataset.fileId;   //要改名字的文件夹id
            var thisData = dataAction.getDataById(datas,selectId);  //找到这个数据
            thisData.title = fileTitle.innerHTML = edtor.value.trim();      //将数据的title改为当前输入框的值
            
            fileTitle.style.display = 'block';  //显示文件名
            fileEdtor.style.display = 'none';   //隐藏输入框
            /////树形菜单区域
            var treeMenu = tools.$(".main_bottom_left")[0];
            treeMenu.innerHTML = view.createTreeHtml(datas,-1);
            iconClick();

            tools.addClass(tip,"addtip");        //移除添加时的class
            tools.removeClass(tip,"tipBg");            //给tip添加class,改变背景图位置
            tip.innerHTML = "重名名成功";
            run(tip);    
        }
    }

    var status = tools.toggleClass(checkAll,"checkAct");     //给当前加class
    if(status){                 //如果全选按钮添加上class,将所有元素都选中
        for( var i = 0; i < allList.length; i++ ){
            tools.addClass(allList[i],"active");
            checkboxs[i].style.opacity = 1;
            tools.addClass(checkboxs[i],"conCheckbox");
        }
    }else{                      //否则所有的文件为不选的状态
        for( var i = 0; i < allList.length; i++ ){
            tools.removeClass(allList[i],"active");
            checkboxs[i].style.opacity = 0;
            tools.removeClass(checkboxs[i],"conCheckbox");
        }
    }
})

///////////////////////////////////////////////////////////单选///////////////////////////////////////////////////////////
checkboxAddEvent();



///////////////////////////////////////////////////////////新建文件夹///////////////////////////////////////////////////////////
var addMkdir = tools.$('#addMkdir');

tools.addEvent(addMkdir,'click',function(){
    if( addMkdir.onOff || move.onOff || deleteFile.onOff ){
        return;
    }

    disContent.style.display = 'block';
    fileEmpty.style.display = 'none';

    
    addMkdir.onOff = true;      //新建的时候状态为真.

    var  html = view.createFileConstruct({  //生成一个新建文件夹的模板,给当前添加的数据设置id
        id:tools.uuid()
    });       

    disContent.innerHTML = html + disContent.innerHTML;

    //获取到页面中第一个元素的.file-title  .file-edtor
    var first = disContent.firstElementChild;

    var title = tools.$('.file-title',first)[0];    //文件夹标题
    var edtor = tools.$('.file-edtor',first)[0];    //输入框

    title.style.display = 'none';           //文件夹名称不显示
    edtor.style.display = 'block';          //显示输入框

    //获取到这个输入框,给焦点
    var edtorInput = tools.$('.edtor',edtor)[0];
    edtorInput.focus();

    ////////点击输入框的时候,阻止冒泡
    tools.addEvent(edtor,"click",function (ev){
        ev.stopPropagation();    
    });
    tools.addEvent(edtor,"mousedown",function (ev){
        ev.stopPropagation();    
    });
})



/////点击document的时候,看输入框的值决定是否新建文件夹
tools.addEvent(document,"mousedown",function (ev){
    ev.preventDefault();
    menu.style.display = 'none';
    if(move.onOff || deleteFile.onOff || delectBtn.onOff ) return;
    if(ev.button !== 0) return;
    if(addMkdir.onOff){
        addMkdirFn();
    }
//////重命名的时候
    if (rename.onOff) {

        var select = whoSelect()[0];

        var title = tools.$('.file-title',select)[0];
        var edtor = tools.$('.file-edtor',select)[0];
        var edtorInput = tools.$('.edtor',edtor)[0];
    
    //获取到这个输入框和value
        var edtorInput = tools.$('.edtor',edtor)[0];
        var edtorVal = edtorInput.value.trim();

        var pathNavLast = tools.$("span",pathNav)[0];   //导航中最后一个元素span
        var pid = pathNavLast.dataset.fileId;           //当前创建的元素的pid就是导航区域的最后一个span的id
        

        if( edtorVal === "" || edtorVal == title.innerHTML ){      //新建不成功,移除当前元素
            title.style.display = 'block';
            edtor.style.display = 'none';
        }else if( dataAction.reName(datas,pid,edtorVal) ){      //重名
            title.style.display = 'block';
            edtor.style.display = 'none';

            tools.removeClass(tip,"addtip");        //移除添加时的class
            tools.addClass(tip,"tipBg");            //给tip添加class,改变背景图位置
            tip.innerHTML = "文件夹名重复请重新命名";
            run(tip);       
        }else{
            var selectId = select.dataset.fileId;   //要改名字的文件夹id
            var thisData = dataAction.getDataById(datas,selectId);  //找到这个数据
            thisData.title = edtorVal;      //将数据的title改为当前输入框的值
            title.innerHTML = edtorVal;     //将页面中的显示的文件名也改了
            title.style.display = 'block';  //显示文件名
            edtor.style.display = 'none';   //隐藏输入框
            /////树形菜单区域
            var treeMenu = tools.$(".main_bottom_left")[0];
            treeMenu.innerHTML = view.createTreeHtml(datas,-1);
            iconClick();

            tools.addClass(tip,"addtip");        //移除添加时的class
            tools.removeClass(tip,"tipBg");            //给tip添加class,改变背景图位置
            tip.innerHTML = "重命名成功";
            run(tip);    
        }
        rename.onOff = false;
    }
});



///////////////////////////////////////////////////////////删除文件///////////////////////////////////////////////////////////
var deleteFile = tools.$('#delete');

tools.addEvent(deleteFile,'click',function(){
    if(move.onOff || deleteFile.onOff ) return;
    var select = whoSelect();       //获取到被选中的元素

    if( select.length === 0){       //没有选中文件
        tip.innerHTML = "请选择文件";
        tools.removeClass(tip,"addtip");        //移除添加时的class
        tools.addClass(tip,"tipBg");            //给tip添加class,改变背景图位置
        run(tip)
    }else{          
        alertBox.style.display = mask.style.display  = 'block';
        deleteFile.onOff = true;
        alertBox.style.left = (views().W - alertBox.offsetWidth)/2 + "px";
        alertBox.style.top = (views().H - alertBox.offsetHeight)/2 + "px";
        mask.style.height = Math.max(document.body.clientHeight,views().H) + "px";
        okCancleClose();
    }
})

///////////////////////////////////////////////////////////回车确定文件夹///////////////////////////////////////////////////////////
tools.addEvent(document,"keydown",function(ev){
    if( addMkdir.onOff && ev.keyCode === 13){  
        addMkdirFn();    
        empty();    

    }

    if( rename.onOff && ev.keyCode === 13){  
        //获取到选中第一个元素的.file-title  .file-edtor

        var select = whoSelect();

        var title = tools.$('.file-title',select[0])[0];
        var edtor = tools.$('.file-edtor',select[0])[0];

        //获取到这个输入框
        var edtorInput = tools.$('.edtor',edtor)[0];
        var edtorVal = edtorInput.value.trim();

        var pathNavLast = tools.$("span",pathNav)[0];   //导航中最后一个元素span
        var pid = pathNavLast.dataset.fileId;           //当前创建的元素的pid就是导航区域的最后一个span的id

        if( edtorVal === "" || edtorVal == title.innerHTML ){      //新建不成功,移除当前元素
            title.style.display = 'block';
            edtor.style.display = 'none';
        }else if( dataAction.reName(datas,pid,edtorVal) ){
            title.style.display = 'block';
            edtor.style.display = 'none';

            tools.removeClass(tip,"addtip");        //移除添加时的class
            tools.addClass(tip,"tipBg");            //给tip添加class,改变背景图位置
            tip.innerHTML = "文件夹名称重名了,重新命名";
            run(tip);       

        }else{
            var selectId = select[0].dataset.fileId;   //要改名字的文件夹id
            var thisData = dataAction.getDataById(datas,selectId);  //找到这个数据
            thisData.title = edtorVal;      
            title.innerHTML = edtorVal;     
            title.style.display = 'block';  
            edtor.style.display = 'none';   


            /////重新渲染树形菜单区域
            var treeMenu = tools.$(".main_bottom_left")[0];
            treeMenu.innerHTML = view.createTreeHtml(datas,-1);
            iconClick();
        }
        rename.onOff = false;     //改变新建时的开关
        empty();                    //清空所有class

    }
})


///////////////////////////////////////////////////////////框选///////////////////////////////////////////////////////////

var newDiv = null;      //点击document的时候，移动鼠标出现的框
var disX = disY = 0;    
var shadow = null;      //简影
var isDrag = false;     //是否正在拖拽剪影
var moveTips = null;    //配合简影的框
var pengObj = null;     //碰上的那个元素


/////框选和拖拽文件
tools.addEvent(document,'mousedown',function(ev){
    menu.style.display = 'none';
    if(ev.button !== 0) return;
    var target = ev.target;     //获取到点击的目标元素，用来判断
    ev.preventDefault();        //清除浏览器默认行文

    //进行判断，当点击到指定的元素身上的额时候，不能拉框
    if( tools.parents(target,".g-btn") || 
        tools.parents(target,".main_bottom_left")  ||  
        tools.parents(target,".contentLeft") ||  checkboxs.length === 0  || move.onOff || deleteFile.onOff || rename.onOff || delectBtn.onOff ){
        return;
    }
    newDiv = null;
    disX = ev.clientX;
    disY = ev.clientY;

    //拖拽文件夹移动
    if( tools.parents(target,".list") ){
        tools.addEvent(document,"mousemove",moveFileFn);
        tools.addEvent(document,"mouseup",upFileFn);
        shadowTarget = tools.parents(target,".list");
        return;
    }
    tools.addEvent(document,"mousemove",moveFn);
    tools.addEvent(document,"mouseup",upFn);

    empty();    
})


///////////////////////////////////////////////////////////移动到文件///////////////////////////////////////////////////////////
tools.addEvent(move,'click',moveBtnFn);

tools.addEvent(rename,'mousedown',function(ev){
    ev.stopPropagation();
})


///////////////////////////////////////////////////////////重命名///////////////////////////////////////////////////////////
tools.addEvent(rename,'click',reNameFn);


/////////////点击小图标(树形菜单)
iconClick();
var iconOnoff = true;
///////////////////////////////////////////////////////////点击小图标展开收缩///////////////////////////////////////////////////////////
function iconClick(parents){
    parents = parents || mainBottomLeft;
    var icon = tools.$('i',parents);

    for(var i = 0; i < icon.length; i++){
        icon[i].states = true;
        tools.addEvent(icon[i],'click',function(ev){

            ev.stopPropagation();

            if(!this.parentNode.parentNode.nextElementSibling.firstElementChild) return;    //没有兄弟级,就不做任何反应

            if(!this.states){    //点击展开
                iconOnoff = true;
                this.parentNode.parentNode.nextElementSibling.style.display = 'block';
                this.style.backgroundPosition =  '3px -92px';
            }else{              //点击收缩
                iconOnoff = false;
                this.parentNode.parentNode.nextElementSibling.style.display = 'none';
                this.style.backgroundPosition =  '3px -44px';
            }
            this.states = !this.states;
        })
    }
}


function moveBtnFn(ev){

    ev.stopPropagation();
   
    if( move.onOff || deleteFile.onOff || ev.button ) return;
    menu.style.display = 'none';

    var select = whoSelect();
    if( select.length === 0 ){     
        tip.innerHTML = "请选择文件";
        tools.removeClass(tip,"addtip");        
        tools.addClass(tip,"tipBg");            
        run(tip);
    }else{          //选中文件,出现弹框

        move.onOff = true;      
        var moveId = 0;        
        var isMove = true;      

        mask.style.display = 'block';

        dialog({
            title:"选择存储位置",
            content:view.moveDialogHtml(),  

            okFn:function(){        //可以移动
                if(!isMove){
                    var childsTitle = dataAction.getChildsById(datas,moveId);
                    var thisOnoff = true;
                    for (var i = 0; i < select.length; i++) {
                        thisOnoff = true;
                        var getData = dataAction.getDataById(datas,select[i].dataset.fileId);
                        for(var j = 0; j < childsTitle.length; j++){
                            if(childsTitle[j].title == getData.title){
                                //提醒部分文件移动失败
                                tools.removeClass(tip,"addtip");        //移除添加时的class
                                tools.addClass(tip,"tipBg");            //给tip添加class,改变背景图位置
                                tip.innerHTML = "部分文件移动失败";
                                run(tip); 

                                thisOnoff = false;
                                break;
                            }
                        }
                        if(thisOnoff){
                            getData.pid = moveId;
                        }
                    }
                    var cur = tools.$(".current-path")[0].dataset.fileId;
                    disContent.innerHTML = createFilesHtml(datas,cur);
                    //菜单区域渲染
                    treeMenu.innerHTML = view.createTreeHtml(datas,-1);
                    iconClick();
                    //定位到某个菜单上
                    tools.addClass(tools.getTreeById("tree-title",cur),"tree-nav");
                    move.onOff = false;
                    mask.style.display = 'none';
                    checkboxAddEvent();
                }
                return isMove;
            }
        });

        //渲染弹框的内容
        var fullPop = tools.$(".full-pop")[0];
        //渲染弹框中的树形菜单
        var dirTree = tools.$(".dirTree",fullPop)[0];
        tools.addClass(dirTree,"main_bottom_left");
        dirTree.innerHTML = view.createTreeHtml(datas,-1);
        iconClick(dirTree);

        //填写内容
        var fileName = tools.$(".file-name",fullPop)[0];    //存储的位置的文件夹名称
        var fileNum = tools.$(".file-num",fullPop)[0];      //一共移动基哥文件
        var selectFirstId = select[0].dataset.fileId;       //获取选中的文件的id
        var error = tools.$(".error",fullPop)[0];           //错误信息提示

        fileName.innerHTML = dataAction.getDataById(datas,selectFirstId).title;
        if(select.length > 1){
            fileNum.innerHTML = '等' + select.length + '个文件';
        }


        ///给弹框的每一个加上点击事件处理
        tools.addEvent(dirTree,"click",function (ev){
            var target = ev.target;

            if( target = tools.parents(target,".tree-title") ){

                isMove = false;

                //点击菜单的那个id
                var clickFileId = target.dataset.fileId;
                 var curData = dataAction.getDataById(datas,clickFileId);//id对应数据
                        
                tools.$('.fileMovePathTo')[0].innerHTML = curData.title;
                var tree = tools.$('.tree-title',dirTree);
                for(var i = 0; i < tree.length; i++){
                    tools.removeClass(tree[i],'tree-nav');
                }
                tools.addClass(target,"tree-nav");

                error.innerHTML = "";

                //被移动的元素的父id
                var firstSelectId = select[0].dataset.fileId;

                var parent = dataAction.getParent(datas,firstSelectId);

                if( clickFileId == parent.id ){
                    error.innerHTML = "不能移动到本身或其子文件夹下";
                    isMove = true;
                }


                /*不能移到自身和子文件夹下*/
                //selectArr 选中元素的集合
                //clickFileId 点击树形菜单的那个菜单的id
                for( var i = 0; i < select.length; i++ ){
                    //找到选中元素的所有的子孙数据
                    var selectId = select[i].dataset.fileId;
                    var childs = dataAction.getChildsAll(datas,selectId);

                    for( var j = 0; j < childs.length; j++ ){
                        if( childs[j].id == clickFileId ){
                            error.innerHTML = "不能移动到本身或其子文件夹下";
                            isMove = true;
                            break;
                        }
                    }
                }
                moveId = clickFileId;
            } 
        })
    }
}


var menu = tools.$('#menu');
var delectBtn = tools.$('#delectBtn');
var renameBtn = tools.$('#renameBtn');
var moveBtn = tools.$('#moveBtn');
var selectRight = whoSelect();
tools.addEvent(document,'mousedown',function(ev){
    if(rename.onOff){

        var select = whoSelect();
        var fileTitle = tools.$('.file-title',select[0])[0];
        var fileEdtor = tools.$('.file-edtor',select[0])[0];
        var edtor = tools.$(".edtor",select[0])[0];
        tools.removeClass(select[0],"active");
        tools.removeClass(select[0].firstElementChild,"conCheckbox");

        fileTitle.style.display = 'block';
        fileEdtor.style.display = 'none';


    }
    ev.stopPropagation();
    if(delectBtn.onOff ) return;
    selectRight = whoSelect();
    
})
///////////////////////////////////////////////////////////鼠标右键///////////////////////////////////////////////////////////
tools.addEvent(document,'contextmenu',function(ev){

    ev.preventDefault();
    if(mask.style.display === 'block') return;
    var target = ev.target;
    target = tools.parents(target,".list") 
   // target = tools.parents(target,".list");
    if(ev.button !== 2) return;

    if(selectRight.length <= 1){
        if( target ){
            //显示自定义菜单
            menu.style.display = 'block';
            //给自定义菜单定位
            menu.style.left = ev.clientX + 'px';
            menu.style.top = ev.clientY + 'px';

            for(var i = 0; i < allList.length; i++){
                tools.removeClass(allList[i],'active');
                allList[i].firstElementChild.style.opacity = 0;
                tools.removeClass(allList[i].firstElementChild,'conCheckbox');
            }

            tools.addClass(target,"active");
            target.firstElementChild.style.opacity = 1;
            tools.addClass(target.firstElementChild,"conCheckbox");
        }
    }else if(selectRight.length === checkboxs.length){
        menu.style.display = 'block';
        //给自定义菜单定位
        menu.style.left = ev.clientX + 'px';
        menu.style.top = ev.clientY + 'px';
    }else{      

        var targetBox = target.firstElementChild;
        
        if( tools.hasClass(targetBox,"conCheckbox") ){
            //////当前加上class
            tools.addClass(target,"active");
            target.firstElementChild.style.opacity = 1;
            tools.addClass(target.firstElementChild,"conCheckbox");

        }else {     
            
            for(var i = 0; i < allList.length; i++){
                tools.removeClass(allList[i],'active');
                allList[i].firstElementChild.style.opacity = 0;
                tools.removeClass(allList[i].firstElementChild,'conCheckbox');
            }
            
            tools.addClass(target,"active");
            target.firstElementChild.style.opacity = 1;
            tools.addClass(target.firstElementChild,"conCheckbox");
        }   

        menu.style.display = 'block';
        //给自定义菜单定位
        menu.style.left = ev.clientX + 'px';
        menu.style.top = ev.clientY + 'px';     
    }
})


tools.addEvent(delectBtn,'mousedown',function(ev){
    ev.stopPropagation();
})
///////////////////////////////////////////////////////////右键删除 ///////////////////////////////////////////////////////////
tools.addEvent(delectBtn,'mouseup',function(ev){
    delectBtn.onOff = true;
    ev.stopPropagation();

    if(ev.button === 2 ) return;
    alertBox.style.display = mask.style.display ='block';

    alertBox.style.left = (views().W - alertBox.offsetWidth)/2 + "px";
    alertBox.style.top = (views().H - alertBox.offsetHeight)/2 + "px";

    okCancleClose();        //点击确定
    menu.style.display = 'none';
})


tools.addEvent(renameBtn,'mousedown',function(ev){
    ev.stopPropagation();
    if(ev.button === 2 ) return;
});
///////////////////////////////////////////////////////////右键重命名///////////////////////////////////////////////////////////
tools.addEvent(renameBtn,'mousedown',function(ev){
    ev.stopPropagation();
})
tools.addEvent(renameBtn,'mouseup',reNameFn);

///////////////////////////////////////////////////////////右键移动到///////////////////////////////////////////////////////////

tools.addEvent(moveBtn,'mousedown',function(ev){
    ev.stopPropagation();
})
tools.addEvent(moveBtn,'mouseup',moveBtnFn)


}());
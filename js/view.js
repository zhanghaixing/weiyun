var view = (function(){
    return {
         //根据数据，生成一个文件的结构
        createFileConstruct:function (item){
            
            var html = '<div class="list" data-file-id='+item.id+'>'
                            +'<lable class="checkbox"></lable>'
                            +'<div class="img">'
                                +'<i></i>'
                            +'</div>'
                            +'<p class="name">'
                                +'<span class="file-title">'+item.title+'</span>'
                                +'<span class="file-edtor">'
                                    +'<input class="edtor" type="text"/>'
                                +'</span>'
                            +'</p>'
                        +' </div>';

            return html;    
        },
        //文件导航区
        createPathNavConstruct: function (datas,id){
                var parents = dataAction.getParentsById(datas,id).reverse();
                var str = '';
                var zIndex = parents.length+10;

               for( var i = 0; i < parents.length-1; i++ ){
                   str += '<a href="javascript:;"'
                   +' style="z-index:'+(zIndex--)+'" data-file-id="'+parents[i].id+'">'+parents[i].title+'</a>';
                                             
               }
               str += '<span class="current-path" style="z-index:'+zIndex+'" data-file-id="'+parents[parents.length-1].id+'">'+parents[parents.length-1].title+'</span>';   
               return str;
        },
        createTreeLi:function (datas,tree_childs){
            var level = dataAction.getLevel(datas,tree_childs.id);
            var hasChild = dataAction.hasChilds(datas,tree_childs.id);

            var treeContro = hasChild ? "tree-contro" : "tree-contro-none";
            var html = '';
            html += '<li>'
                +'<div data-file-id="'+tree_childs.id+'" class="tree-title '+treeContro+'" style="padding-left:'+level*14+'px;">'
                    +'<span>'
                        +'<strong class="ellipsis">'+tree_childs.title+'</strong>'
                        +'<i class="ico"></i>'
                    +'</span>'
                +'</div>'

            html += view.createTreeHtml(datas,tree_childs.id);

            html += '</li>'
            return html;     
        },
        createTreeHtml : function (datas,id){
            var tree_childs = dataAction.getChildsById(datas,id);

            var html =   '<ul>';

                for( var i = 0; i < tree_childs.length; i++ ){

                  html += view.createTreeLi(datas,tree_childs[i]);

                }


             html += '</ul>';

             return html;
        },
        moveDialogHtml:function (){
            var html = '<p class="dir-file">\
                <span class="file-img"></span>\
                <span class="file-name">老王</span>\
                <span class="file-num"></span>\
            </p>\
            <div class="dir-box">\
                <div class="cur-dir">\
                    <span>移动到：</span><span class="fileMovePathTo"></span>\
                </div>\
                <div class="dirTree"></div>\
            </div> ';
            return html;
        },
        moveFileShadow:function (){
            var newDiv = document.createElement("div");
            newDiv.className = 'drag-helper ui-draggable-dragging';

            var html = '<div class="icons">'
                            +'<i class="icon icon0 filetype icon-folder"></i>'  
                        +'</div>'
                        +'<span class="sum">1</span>';

            newDiv.innerHTML = html;
            return newDiv;
        }

    }
}())
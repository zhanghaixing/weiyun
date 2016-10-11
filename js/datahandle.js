var dataAction = (function(){
	return {
		//通过指定id找到子级数据
		getChildsById:function (data,id){ 		
			var arr = [];
			for( var i = 0; i < data.length; i++ ){
				if( data[i].pid == id){
					arr.push(data[i]);
				}
			}
			return arr;
		},
		//通过指定id找到父级数据
		getParentsById : function (data,id){	
	        var arr = [];
	        for( var i = 0; i < data.length; i++ ){
	            if( data[i].id == id ){
	                arr.push(data[i]);
	                arr = arr.concat(dataAction.getParentsById(data,data[i].pid));
	            }        
	        } 
	        return arr;   
	    },
    //找到这是第几集菜单
	    getLevel:function (datas,id){  		
	    	return dataAction.getParentsById(datas,id).length;
	    },
	//判断是否有子级存在,返回的时布尔值
	    hasChilds:function (datas,id){		
	    	return !!dataAction.getChildsById(datas,id).length;
	    },
    //判断是否重名	
	    reName:function (datas,pid,title){	
	    	//通过指定id获取到同级数据,判断title
	    	var childs = dataAction.getChildsById(datas,pid);

	    	for( var i = 0; i < childs.length; i++ ){
	    		if( childs[i].title === title ){
	    			return true;
	    		}
	    	}
	    	return false;
	    },
	//通过指定id删除指定id的数据项    
	    deleteDataById:function (datas,idArr){		
	    	for( var i = 0; i < datas.length; i++ ){
	    		for( var j = 0; j < idArr.length; j++ ){
	    			if( datas[i].id == idArr[j] ){
	    				datas.splice(i,1);
	    				i--;
	    				break;
	    			}
	    		}
	    	}	
	    },
	//找到指定id的所有的子孙数据    
	    getChildsAll:function (datas,id){		
            //通过循环数据，找到指定id的那条数据
            var arr = [];
            for( var i = 0; i < datas.length; i++ ){
                if( datas[i].id == id ){
                    arr.push(datas[i]);
                    var childs = dataAction.getChildsById(datas,datas[i].id);

                    for( var j = 0; j < childs.length; j++ ){
                       arr = arr.concat(dataAction.getChildsAll(datas,childs[j].id));
                    }
                }
            }

            return arr;    
        },
        //批量删除指定id下面的所有的子级  [1,2,3,4]
        //idArr 是一个数组，指定了要删除的id
        batchDelect:function (datas,idArr){
            for( var i = 0; i < idArr.length; i++ ){
                var childsAll = dataAction.getChildsAll(datas,idArr[i]);
                for( var j = 0; j < childsAll.length; j++ ){
                    for( var k = 0; k < datas.length; k++ ){
                        if( datas[k].id == childsAll[j].id ){
                            datas.splice(k,1);
                            break;
                        }
                    }
                }

            } 
        },
    //通过指定id找到id所在的数据项
        getDataById:function (datas,id){
        	for( var i = 0; i < datas.length; i++ ){
        		if( datas[i].id == id ){
        			return datas[i];
        		}
        	}
        	return null;	//没有找到返回null
        },
        getParent:function (datas,id){
        	var parents = dataAction.getParentsById(datas,id);

        	return parents[1];
        }
	}

}())


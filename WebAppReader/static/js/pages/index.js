$.get('/index',function (d) {
	  	new Vue({
	  		el:'#app',
	  		data:{
	  			recommend:d.items[2].data.data,
	  			rank:d.items[1].data.data,
	  			position:0,
	  			screen_width:658,
	  			double_screen_width:1316
	  		}
	  		,method:{
	  			tabSlide:function(){

	  			}
	  		}
	  	})  
},'json')
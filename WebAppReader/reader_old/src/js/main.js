(function(){
	/*
	 * 创建localStorage工具类
	 */
	var Util = (function(){
		var preFix = 'html5_Reader_';
		//获取localStorage
		var StorageGetter = function(key){
			return localStorage.getItem(preFix + key);
		};
		//设置localStorage
		var StorageSetter = function(key,val){
			return localStorage.setItem(preFix+key,val);
		};
		//处理json
		var getBSJSONP = function(url,callback){
			return $.jsonp({
				url:url,
				cache:true,
				callback:'doukan_fiction_chapter',
				success:function(result){
					var data = $.base64.decode(result)
					var json = decodeURIComponent(escape(data))
					callback(json)
				}
			})
		}
		return{
			getBSJSONP:getBSJSONP,
			StorageGetter:StorageGetter,
			StorageSetter:StorageSetter
		}
	})();
	var DomElem = {
		top_nav:$('#u_nav'),
		bottom_nav:$("#u_nav_bottom"),
		b_nav_bg:$('.u-nav-bottom-menu-bg'),
		b_nav:$('.u-nav-bottom-menu'),
		b_detail:$('#b_detail')
	};
	var Win = $(window);
	var Dom = $(document);
	var Body = $('body')
	var InitFontSize = '17.5';
	if(Util.StorageGetter('b_FontSize')!= null){
		InitFontSize = Util.StorageGetter('b_FontSize');
		DomElem.b_detail.css('font-Size',InitFontSize+'px')
	}
	/**
	 * todo 主入口
	 * @return {[type]} [description]
	 */
	var main = function(){ 
		EventHanlder();//初始化绑定事件
		var readerModel= new ReaderModel();
		readerModel.init();
	}
	/**
	 * todo 实现阅读器相关数据交互工作
	 */
	var ReaderModel = function(){
		var Chapter_id;
		//初始化
		var init = function(){
			getFictionInfo(function(){
				getCurChapterContent(Chapter_id,function(){
					//渲染
				})
			})
		}
		//获取章节信息
		var getFictionInfo = function(callback){
			$.get('data/chapter.json',function(data){
				if(data.result === 0)
				{
					console.log(data.chapters[1].chapter_id)
					Chapter_id = data.chapters[1].chapter_id
					callback && callback(data)
				}
			},'json');
		}
		//获取章节内容
		var getCurChapterContent = function(chapter_id,data){
			$.get('data/data' + chapter_id + '.json',function(data){
				if(data.result == 0){
					var url = data.jsonp;
					console.log(url)
					Util.getBSJSONP(url,function(data){
						callback&&callback(data)
					})
				}
			},'json');
		} 
		return{
			init:init
		}
	}
	/**
	 * 渲染UI
	 */
	var ReaderBaseFrame = function(){

	}
	var EventHanlder = function(){
		//判断显示Nav 
		var checkNavIsShow = function(){
			if(DomElem.top_nav.css('display')==='block'){
				DomElem.top_nav.hide();
				DomElem.bottom_nav.hide();
				DomElem.b_nav.hide();
				DomElem.b_nav_bg.hide();
				$('.fzfz').removeClass('active')
			}else{
				DomElem.top_nav.show();
				DomElem.bottom_nav.show();
			}
		}
		 // 处理字体菜单显示隐藏
		$('.fzfz').click(function(){
			if(DomElem.b_nav_bg.css('display')==='block'){
				DomElem.b_nav_bg.hide();
				DomElem.b_nav.hide();
				$(this).removeClass('active')
			}else{
				DomElem.b_nav_bg.show();
				DomElem.b_nav.show();
				$(this).addClass('active')
			}
		}) 
		//绑定页面菜单显示事件 
		$('.bg-mid').click(function(event) { 
			checkNavIsShow();
		});
		
		//绑定页面滚动事件
		Win.on('scroll',function(){
			DomElem.top_nav.hide();
			DomElem.bottom_nav.hide();
			DomElem.b_nav.hide();
			DomElem.b_nav_bg.hide();
			$('.fzfz').removeClass('active')
		})  
		//夜间模式
		$('.night').click(function(){
			Body.removeAttr('style')
			if(Body.attr('class')==='nightMode'){
				$(this).removeClass('active').text('夜间')
				Body.removeClass('nightMode')
			}else{
				Body.addClass('nightMode')
				$(this).addClass('active').text('白天')
				
			}
		})
		$('.bg').each(function(inx,elem){
				$(elem).click(function(){
					  Body.attr('style','background-Color:'+$(elem).attr('class').replace('bg',''))
				})
		})
		///放大字体
		$('#btn_big_fz').click(function(){ 
			if(DomElem.b_detail.css('font-Size').replace('px','')>=22){
				return;
			}
			InitFontSize++;
			DomElem.b_detail.css('font-Size',InitFontSize+'px');
			Util.StorageSetter('b_FontSize',InitFontSize);
		}) 
		//缩小
		$('#btn_sm_fz').click(function(){
			if(DomElem.b_detail.css('font-Size').replace('px','')<=12){
				return;
			}
			InitFontSize--;
			DomElem.b_detail.css('font-Size',InitFontSize+'px');
			Util.StorageSetter('b_FontSize',InitFontSize);
		}) 
	}
	main();//执行main
})()
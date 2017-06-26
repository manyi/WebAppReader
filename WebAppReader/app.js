var koa = require('koa');//引入koa
var controller = require('koa-route');//引入koa路由
var app = koa();
 
//设置模板
var views = require('co-views');
var render = views('./view',{
	map:{ html:'ejs' }
});
	
var service = require('./service/webAppService.js')
var querystring = require('querystring');

//静态资源访问
var koa_static = require('koa-static-server');
 
app.use(koa_static({
	rootDir: './static/',//目录
	rootPath: '/static/',//文件路径
	maxage: 0
}));

//默认文件路由
app.use(controller.get('/ejs_test',function*(){
	this.set('Cache-Control','no-cache');
	this.body = yield render('test',{title:'leo_test'}); 
	// render内的参数不可缺少，title，内容
}));

app.use(controller.get('/',function*(){
	this.set('Cache-Control','no-cache');
	this.body = yield render('index',{title:'首页'})
}))
//home——data
app.use(controller.get('/index',function*(){
	this.set('Cache-Control','no-cache');
	this.body = service.get_index_data();
}))
app.use(controller.get('/book',function*(){
	this.set('Cache-Control','no-cache');
	var params = querystring.parse(this.req._parsedUrl.query);
	var bookId = params.id;
	this.body = yield render('book',{bookId:bookId});
}))
//rank
app.use(controller.get('/rank',function*(){
	this.set('Cache-Control','no-cache');
	this.body = service.get_rank_data();
}))
//category
app.use(controller.get('/category',function*(){
	this.set('Cache-Control','no-cache');
	this.body = service.get_category_data();
}))
//bookbacket
app.use(controller.get('/bookbacket',function*(){
	this.set('Cache-Control','no-cache');
	this.body = service.get_bookbacket_data();
}))
//channel
app.use(controller.get('/channel/famale',function*(){
	this.set('Cache-Control','no-cache');
	this.body = service.getfamale_data();
}))
app.use(controller.get('/channel/male',function*(){
	this.set('Cache-Control','no-cache');
	this.body = service.getmale_data();
}))
app.use(controller.get('/chapter/',function*(){
	this.set('Cache-Control','no-cache');
	this.body = service.get_chapeter_data();
}))
app.use(controller.get('/chapter/data',function*(){
	this.set('Cache-Control','no-cache');
	this.body = service.get_chapeter_datas();
}))

//book
app.use(controller.get('/ajax/book',function*(){
	this.set('Cache-Control','no-cache');
	var params =querystring.parse(this.req._parsedUrl.query);
	var id = params.id; 
	if(!id){
		id = "18218";
	}
	this.body = service.get_book_data(id);
}))


//search
app.use(controller.get('/ajax/search',function*(){
	this.set('Cache-Control','no-cache');
	var _this = this; 
	var params = querystring.parse(this.req._parsedUrl.query);
	var start = params.start;
	var end = params.end;
	var keyword = params.keyword;
	this.body = yield service.get_search_data(start,end,keyword)
}))
app.listen(3001);
console.log('koa server is started ');
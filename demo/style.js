//提供切换变量
var a2=new Vue({
	el: '#main_1',
	data:{
		pageNum:1,
		dataType:10
}
})

//初始化
$(function(){
	//课程页面初始化
	pageChange(1,20,10);
	//关注初始化
	$("#ufocus").hide();
	if(sessionStorage.getItem("loginSuc")==1&&sessionStorage.getItem("followSuc")==1){
		$("#focus").hide();
		$("#ufocus").show();
	}
	//轮播间隔初始化
	$("#myCarousel").carousel({interval:5000});
	//登录错误信息初始化
	$("#shade p:nth-child(6)").hide();
});

//不再显示信息弹窗
$(".msg #nomore").click(function(){$(".msg").remove();});
//关闭登录界面
$("#login_close").click(function(){
	console.log("got");
	bounceOutById("login",1,function(){
		document.getElementById("shade").style.display="none";
		document.getElementById("login").style.animation="bounceIn 1s";
		});
});


//关注切换
$("#focus").click(function(){
	var loginF=sessionStorage.getItem("loginSuc");
	if(loginF==1) {
		$("#focus").hide();
		$("#ufocus").show();
	}
	if(loginF!=1) {
		$("#shade").attr("style","display:block");
	}
	
});
//取关
$("#ufocus a").click(function(){
	$("#ufocus").hide();$("#focus").show();
	sessionStorage.setItem("followSuc",0);
});
//页码样式
$("#page li:nth-child(4)").nextUntil(".next").attr("class","disabled");

//登录
$("#login button").click(function(){
	var userName;
	var password;
	var inputs=document.getElementById("login").getElementsByTagName("input");
	userName=inputs[0].value;
	password=inputs[1].value;
	//Md5
	userName=md5(userName);
	password=md5(password);
	var xhr=new XMLHttpRequest();
	//get请求
	var url="http://study.163.com/webDev/login.htm";//相对当前文档路径
	xhr.open('get',url+"?userName="+userName+"&password="+password,true);	
	xhr.send(null);

	xhr.onreadystatechange=function(){			
		if (xhr.readyState==4&&xhr.status==200){
			console.log("have sent login proerties");
			var loginF=xhr.responseText;
			if(loginF==1){
				//关注切换
				$("#focus").hide();$("#ufocus").show();
				//关闭登录界面
				$("#shade").attr("style","display:none");
				document.cookie="loginSuc=1; max-age=60";
				sessionStorage.setItem("loginSuc",1);
				document.cookie="followSuc=1; max-age=60";
				sessionStorage.setItem("followSuc",1);
			}else if(loginF==0){
				$("#shade p:nth-child(6)").show();
			}else{
				alert("服务器无响应");
			}
		}
	}
})

//课程重载
var pageChange=function(pageNo,psize,type){
	var listJs;
	var xhr=new XMLHttpRequest();
var url="http://study.163.com/webDev/couresByCategory.htm";
xhr.open('get',url+"?pageNo="+pageNo+"&psize="+psize+"&type="+type+"",true);	
xhr.send(null);

xhr.onreadystatechange=function(){			
	if (xhr.readyState==4&&xhr.status==200){
		listJs=JSON.parse(xhr.responseText);
		console.log(listJs.list[0].name)	

		var rankCont=document.getElementById("rankCont");
		rankCont.innerHTML='';
		for(i=0;i<10;i++){
			rankCont.innerHTML+=
			'<div id="rankItem1">\
			<div class="media">\
			<img src="'+listJs.list[i].smallPhotoUrl+'">\
			<div class="media-body">\
			<span>'+listJs.list[i].name+'</span>\
			</div>\
			<p>&nbsp&nbsp&nbsp&nbsp&nbsp'+listJs.list[i].learnerCount+'</p>\
			</div>\
			</div>\
			'
		}

		var pageInner;
		if(type==20){
			pageInner=document.getElementById("page_2")
		}else{
			pageInner=document.getElementById("page_1");
		}
		//重构列表
		pageInner.innerHTML="";
		for(a=1;a<=5;a++){
			pageInner.innerHTML+="<tr></tr>";
			for(b=1;b<=4;b++){
				var a1;
				if(listJs.list[a*b-1].price==0){a1="免费"}
					else{a1="￥"+listJs.list[a*b-1].price};
				if(a*b-1>listJs.list.length) break;
				pageInner.lastChild.innerHTML+=
				'<td>\
				<div class="thumbnail" data-id="'+(a*b-1)+'">\
				<img src="'+listJs.list[a*b-1].middlePhotoUrl+'">\
				<div class="caption">\
				<p>'+listJs.list[a*b-1].name+'</p>\
				<div>'+listJs.list[a*b-1].provider+'</div>\
				<span>&nbsp&nbsp&nbsp&nbsp&nbsp'+listJs.list[a*b-1].learnerCount+'</span><br>\
				<strong style="font-size:12px">'+a1+'</strong>\
				</div>\
				</div>\
				</td>\
				';
			}
		}


		//触发式构建页面
		$(".thumbnail img").mouseenter(function(event){
			if(!event.target.parentNode.getElementsByClassName("hover")[0]){
				var dataId=event.target.parentNode.dataset.id;
				var str="<div id=\"up\">\
				<img src=\""+listJs.list[dataId].middlePhotoUrl+"\">\
				<div id=\"title\">"+listJs.list[dataId].name+"</div>\
				<div id=\"person\">&nbsp&nbsp&nbsp&nbsp&nbsp</div>"+listJs.list[dataId].learnerCount+"人在学\
				<div>\
				<p id=\"p1\">发布者："+listJs.list[dataId].provider+"</p>\
				<p>分类："+listJs.list[dataId].categoryName+"</p>\
				</div>\
				</div>\
				<div>\
				<p id=\"description\">"+listJs.list[dataId].description+"</p>\
				</div>\
				";
				var hover=document.createElement("div");
				hover.className="hover";
				hover.id="hover";
				hover.innerHTML=str;
				event.target.parentNode.appendChild(hover);
			}
			$(".thumbnail #hover").mouseleave(function(event){
			console.log("leave");
			$("#hover").remove();
		});	

		});
				
	}
}
}

function getCookie (name) {
	var all = document.cookie;
	if (all === '')
		return "";
	var list = all.split('; ');
	for (var i = 0; i < list.length; i++) {
		if (list[i].indexOf(name) > -1 ) {
			return decodeURIComponent(list[i].substring(name.length+1))
		}
	}
}
//淡出函数
function bounceOutById(nodeId,time,callback) {
	document.getElementById(nodeId).style.animation="bounceOut "+time+"s";
	setTimeout(callback,time*800);	
}
//视频页面
function closeVideo(){
	bounceOutById("video",1,function(){document.getElementById("shade1").style.display="none";
							document.getElementById("video").style.animation="bounceIn 1s";
							})	
	document.getElementsByTagName("video")[0].pause();
}
//视频页面
function openVideo() {
	document.getElementById("shade1").style.display="block";
}
			
// var a3=new Vue({
//   el: '#rankCont',
//   data:{
//   	group:1,
//   	hover:true,
//   	pageNum:1,
//   	sequence:0
//   },
//   methods: {
//     pageShow: function (num) {
//       console.log(num);
//     }
//   }
// })








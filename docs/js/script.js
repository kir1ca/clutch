/* YouTube動画ID */
var
	video1 = "0E00Zuayv9Q",
	video2 = "HFlgNoUsr4k",
	video3 = "hcpI9auZmpI",
	video4 = "fjV91oI5cL0",
	video5 = "TVAqNQ8tX4o",
	video6 = "PqJNc9KVIZE",
	video7 = "ayL4pzictu8",
	video8 = "4-Gw0TAM6-Q",
	video9 = "MGt25mv4-2Q",
	video10 = "0E00Zuayv9Q",
	video11 = "HFlgNoUsr4k",
	video12 = "hcpI9auZmpI",
	video13 = "fjV91oI5cL0",
	video14 = "TVAqNQ8tX4o",
	video15 = "PqJNc9KVIZE",
	video16 = "ayL4pzictu8",
	video17 = "4-Gw0TAM6-Q",
	video18 = "MGt25mv4-2Q";

//YouTube埋め込みプレイヤー作成
var	before = '<iframe id="player" class="content" src="https://www.youtube.com/embed/',
	after = '?autoplay=1&playsinline=1&enablejsapi=1&showinfo=0&controls=0&rel=0" frameborder="0"></iframe>';
function player(id) {return before+id+after;}

//クリックした項目を呼び出し
$('.list li').on('click', function() {
	var thisNo = $(".list li").index(this)+1;
	var thisVideo = "video"+thisNo;
	$(".content").html(player(eval(thisVideo)));
});


// ピンチ拡大無効
document.addEventListener('touchstart', event => {
	if (event.touches.length > 1) {
		event.preventDefault();
	}
}, true);

// ダブルタップ拡大無効
let lastTouch = 0;
document.addEventListener('touchend', event => {
	const now = window.performance.now();
	if (now - lastTouch <= 500) {
		event.preventDefault();
	}
	lastTouch = now;
}, true);


//YouTubeプレイヤー制御
$("#play").on("click", function(){
	videoControl("playVideo"); 
	$("#play_box").removeClass("active");
});

$("#pause").on("click", function(){
	videoControl("pauseVideo");
});

function videoControl(action){ 
	var $playerWindow = $('#player')[0].contentWindow;
	$playerWindow.postMessage('{"event":"command","func":"'+action+'","args":""}', '*');
}

//メニューの要素数取得
var list = $('.list li').length;

//要素をアクティブに
function activate(actv){
	$(".list li").removeClass("active");
	var n = "nth-child("+Math.floor(actv*list)+")";//圧力（0〜1）×項目数でアクティブ項目の数字を算出
	var no = Math.floor(actv*list);
	$(".list li:"+n).addClass("active");
	loadPlayer(no);
}

//動画プレイヤー読み込み
var selecting;
function loadPlayer(n) {
	selecting = n;
    setTimeout(function(){
		var videoId = "video"+n;
		if(selecting==n) {
			$(".content").html(player(eval(videoId)));
			selecting =0;
			$("#play_box").addClass("active");
		}
	},1000);

}

// 3D touch
var element = document.getElementById('clutch');
var forceValueOutput = document.getElementById('forceValue');
var touch = null;

function onTouchStart(e) {
	e.preventDefault();
	checkForce(e);
	$("#play_box").removeClass("active");
}

function onTouchMove(e) {
	e.preventDefault();
	checkForce(e);
}

function onTouchEnd(e) {
	e.preventDefault();
	setTimeout(renderElement.bind(null, 0), 10);
	touch = null;
}

// use timeout-based method only on devices not supporting ontouchforcechange
function checkForce(e) {
  if('ontouchforcechange' in document === false) {
    touch = e.touches[0];
    setTimeout(refreshForceValue.bind(touch), 10);
  }
}

// the maximum force value of a touch event is 1
function onTouchForceChange(e) {
  renderElement(e.changedTouches[0].force);
}

// the maximum force value of a click event is 3
function onClickForceChange(e) {
  renderElement(e.webkitForce / 3);
}

// iOS versions lower than iOS 10 do not support the touchforcechange event, so refresh manually
function refreshForceValue() {
  var touchEvent = this;
  var forceValue = 0;
  if(touchEvent) {
    forceValue = touchEvent.force || 0;
    setTimeout(refreshForceValue.bind(touch), 10);
  }else{
    forceValue = 0;
  }

  renderElement(forceValue);
}

// update the element according to the force value (between 0 and 1)
function renderElement(forceValue) {
	window.requestAnimationFrame(function() {
//		forceValueOutput.innerHTML = 'Force: ' + forceValue.toFixed(4);//デバッグ用
		var shadow = 40*forceValue;
		$('body').animate({scrollTop: forceValue.toFixed(4)*48*list-240}, 0);//要素の高さ×要素数-最初保留する高さでスクロール位置算出
		activate(forceValue);
	});
}

// add event listeners
function addForceTouchToElement(elem) {
	elem.addEventListener('touchstart', onTouchStart, false);
	elem.addEventListener('touchmove', onTouchMove, false);
	elem.addEventListener('touchend', onTouchEnd, false);
	elem.addEventListener('webkitmouseforcechanged', onClickForceChange, false);
	elem.addEventListener('touchforcechange', onTouchForceChange, false);
}

addForceTouchToElement(element);

var canvas=document.querySelector('canvas');
var ctx=canvas.getContext('2d');

var sqWH=11;

// 蛇
var snack=[[(sqWH-1)/2,(sqWH-1)/2]] //初始化默认中心位置

// 食物
var food;

// 行走速度
var speed=2 //格/s

// 颜色
var snackColor=[0,0x99,0xff];
var foodColor=[0xff,0,0];

// 用于判断方向是否正确
var lastDir=[0,0];
// 当前行走的方向
var nowDir=[0,0];

// 游戏状态 0:未开始 1：进行中 2：结束
var STATE=0;

var inter;

function _resize(){
  var wh=Math.min(window.innerWidth,window.innerHeight);
  canvas.width=canvas.height=wh;
  draw();
}

window.addEventListener('resize',_resize);

function tip(t){
  var game_tip=document.querySelector('.game_tip');
  if(typeof t=='string'){
    game_tip.innerHTML='<p>'+t+'</p>';
    game_tip.style.display='block';
  }else if(typeof t=='boolean'){
    if(t){
      game_tip.style.display='block'
    }else{
      game_tip.style.display='none';
    }
  }
}

tip('按任意方向键开始游戏');

function draw(){
  // 清空画布
  ctx.clearRect(0,0,canvas.width,canvas.height);

  var sqSize=canvas.width/sqWH;
  // 画蛇
  for(var i=0;i<snack.length;i++){
    ctx.fillStyle='rgba('+snackColor.join(',')+','+(1-i*0.5/snack.length)+')';// 渐变
    ctx.fillRect(sqSize*snack[i][0],sqSize*snack[i][1],sqSize,sqSize);
  }
  // 画食物
  ctx.fillStyle='rgb('+foodColor.join(',')+')';
  ctx.fillRect(sqSize*food[0],sqSize*food[1],sqSize,sqSize)
}

function getNewFood(){
  var af=[];
  for(var i=0;i<sqWH;i++){
    for(var j=0;j<sqWH;j++){
      var a=true;
      for(var k=0;k<snack.length;k++){
        if(snack[k][0]==i&&snack[k][1]==j){
          a=false;
          break;
        }
      }
      if(a) af.push([i,j]);
    }
  }
  return af[parseInt(Math.random()*af.length)];
}

food=getNewFood();
_resize();

document.addEventListener('keydown',function(e){
  if(e.key=='ArrowUp'){
    changeDir([0,-1]);
  }else if(e.key=='ArrowDown'){
    changeDir([0,1]);
  }else if(e.key=='ArrowLeft'){
    changeDir([-1,0])
  }else if(e.key=='ArrowRight'){
    changeDir([1,0]);
  }
})

function changeDir(dir){
  function d(dir){
    if(checkDirCorrect(dir)){
      nowDir=dir;
    }
  }
  d(dir);
  STATE=1;
  tip(false);
  inter=setInterval(function(){
    move(nowDir);
  },1000/speed);
  changeDir=d;
}

function move(dir){
  if(!checkDirCorrect(dir)) return;
  lastDir=dir;

  var newSnack=[snack[0][0]+dir[0],snack[0][1]+dir[1]];

  if(newSnack[0]<0||newSnack[0]>sqWH-1||newSnack[1]<0||newSnack[1]>sqWH-1){
    tip('game over\n得分：'+snack.length);
    clearInterval(inter);
    STATE=2;
    return;
  }

  // 判断是否吃到食物
  if(food[0]==newSnack[0]&&food[1]==newSnack[1]){
    // 因为食物本身不在蛇上，所以在吃到食物的情况下，不可能会撞到自己
    snack.unshift(newSnack);
    food=getNewFood();
    draw();
  }else{
    // 在没有吃到食物的情况下，有可能会撞到自己
    for(var i=0;i<snack.length;i++){
      if(snack[i][0]==newSnack[0]&&snack[i][1]==newSnack[1]){
        // 撞到自己
        tip('game over\n得分：'+snack.length);
        clearInterval(inter);
        STATE=2;
        return;
      }
    }

    snack.unshift(newSnack);
    snack.pop();
    draw();
  }
}

function checkDirCorrect(dir){
  if(snack.length>1){
    // 在蛇的长度大于1时，往原来的相反方向走是不正确的
    if((dir[0]!=0&&dir[0]==-1*lastDir[0])||(dir[1]!=0&&dir[1]==-1*lastDir[1])){
      return false;
    }
  }
  return true;
}
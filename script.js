const canvas = document.getElementById('pongCanvas');
const cc = canvas.getContext('2d');
const paddleWidth = 10;
const paddleHeight = 80;
let leftpaddley = canvas.height / 2 - paddleHeight / 2;
let rightpaddley = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballRadius = 8;
let ballSpeedX = 3;
let ballSpeedY = 2.5;
let keys = {};
let gameOver = false;
document.addEventListener('keydown',function(e){keys[e.key]=true;});
document.addEventListener('keyup',function(e){keys[e.key]=false;});
function draw() {
    cc.fillStyle = '#FFC0CB';
    cc.fillRect(0, 0, canvas.width, canvas.height);
    cc.fillStyle = '#333';
    cc.fillRect(10, leftpaddley, paddleWidth, paddleHeight);
    cc.fillStyle = '#333';
    cc.fillRect(canvas.width - 20, rightpaddley, paddleWidth, paddleHeight);
    cc.beginPath();
    cc.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    cc.fillStyle = '#F0FFFF';
    cc.fill();
    cc.closePath();
    if(gameOver){
        cc.fillStyle = '#e75480';
        cc.font = '48px Luxurious Script, cursive';
        cc.textAlign = 'center';
        cc.fillText('Game Over', canvas.width/2, canvas.height/2);
    }
}
function update() {
    if(gameOver)return;
    if(keys['w']&&leftpaddley>0)leftpaddley-=6;
    if(keys['s']&&leftpaddley<canvas.height-paddleHeight)leftpaddley+=6;
    if(keys['ArrowUp']&&rightpaddley>0)rightpaddley-=6;
    if(keys['ArrowDown']&&rightpaddley<canvas.height-paddleHeight)rightpaddley+=6;
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }
    if (ballX - ballRadius < 20 && ballY > leftpaddley && ballY < leftpaddley + paddleHeight) {
        ballSpeedX = Math.abs(ballSpeedX);
    }
    if (ballX + ballRadius > canvas.width - 20 && ballY > rightpaddley && ballY < rightpaddley + paddleHeight) {
        ballSpeedX = -Math.abs(ballSpeedX);
    }
    if (ballX - ballRadius < 0 || ballX + ballRadius > canvas.width) {
        gameOver = true;
    }
}
function gameLoop() {
    update();
    draw();
    if(!gameOver)requestAnimationFrame(gameLoop);
}
gameLoop();
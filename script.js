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
function draw() {
    cc.fillStyle = '#FFC0CB';
    cc.fillRect(0, 0, canvas.width, canvas.height);
    cc.fillStyle = '#333';
    cc.fillRect(10, leftpaddley, paddleWidth, paddleHeight);
    cc.fillStyle = '#333';
    cc.fillRect(canvas.width - 20, rightpaddley, paddleWidth, paddleHeight);
    cc.beginPath();
    cc.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    cc.fillStyle = '#e75480';
    cc.fill();
    cc.closePath();
}
function update() {
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
        ballSpeedX = -ballSpeedX;
    }
}
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
gameLoop();
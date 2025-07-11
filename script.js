const canvas = document.getElementById('pongCanvas');
const cc = canvas.getContext('2d');

// Set canvas to full screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Scale game elements based on screen size
    const baseWidth = 600;
    const baseHeight = 400;
    scaleX = canvas.width / baseWidth;
    scaleY = canvas.height / baseHeight;
    scale = Math.min(scaleX, scaleY);
}

let scaleX, scaleY, scale;
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const paddleWidth = 10;
const paddleHeight = 80;
let leftpaddley = canvas.height / 2 - (paddleHeight * scaleY) / 2;
let rightpaddley = canvas.height / 2 - (paddleHeight * scaleY) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballRadius = 8;
let ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * 3 * scaleX;
let ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * 2.5 * scaleY;
let keys = {};
let gameOver = false;

// Score variables
let leftScore = 0;
let rightScore = 0;

// Title properties
const titleText = "Pretty Pong";
let titleOpacity = 1.0;

document.addEventListener('keydown',function(e){keys[e.key]=true;});
document.addEventListener('keyup',function(e){keys[e.key]=false;});

// Add click event listener for restart button
canvas.addEventListener('click', function(e) {
    if (gameOver) {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        // Button dimensions and position
        const buttonWidth = 150 * scale;
        const buttonHeight = 45 * scale;
        const buttonX = canvas.width / 2 - buttonWidth / 2;
        const buttonY = canvas.height / 2 + 80 * scale;
        
        // Check if click is within button bounds
        if (clickX >= buttonX && clickX <= buttonX + buttonWidth &&
            clickY >= buttonY && clickY <= buttonY + buttonHeight) {
            restartGame();
        }
    }
});

function restartGame() {
    gameOver = false;
    leftScore = 0;
    rightScore = 0;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * 3 * scaleX;
    ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * 2.5 * scaleY;
    leftpaddley = canvas.height / 2 - (paddleHeight * scaleY) / 2;
    rightpaddley = canvas.height / 2 - (paddleHeight * scaleY) / 2;
}

function draw() {
    cc.fillStyle = '#FFC0CB';
    cc.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw flower first (under everything)
    drawFlower(ballX, ballY, ballRadius * scale);
    
    // Draw paddles
    cc.fillStyle = '#333';
    cc.fillRect(10 * scaleX, leftpaddley, paddleWidth * scaleX, paddleHeight * scaleY);
    cc.fillStyle = '#333';
    cc.fillRect(canvas.width - (20 * scaleX), rightpaddley, paddleWidth * scaleX, paddleHeight * scaleY);
    
    // Draw scores (only if game is not over)
    if (!gameOver) {
        cc.fillStyle = '#333';
        cc.font = `${32 * scale}px Luxurious Script, cursive`;
        cc.textAlign = 'left';
        cc.fillText(leftScore.toString(), 50 * scaleX, 50 * scaleY);
        cc.textAlign = 'right';
        cc.fillText(rightScore.toString(), canvas.width - 50 * scaleX, 50 * scaleY);
    }
    
    // Draw title with dynamic opacity (only if game is not over)
    if (!gameOver) {
        const titleFontSize = 48 * scale;
        const titleY = titleFontSize + 20 * scale;
        const titleWidth = cc.measureText ? cc.measureText(titleText).width : canvas.width * 0.6;
        const titleHeight = titleFontSize;
        const titleX = canvas.width / 2;
        
        // Better collision detection for title area
        const ballInTitleArea = ballY - (ballRadius * scale) <= titleY + titleHeight * 0.3 && 
                               ballY + (ballRadius * scale) >= titleY - titleHeight * 0.7 &&
                               ballX - (ballRadius * scale) <= titleX + titleWidth / 2 && 
                               ballX + (ballRadius * scale) >= titleX - titleWidth / 2;
        
        titleOpacity = ballInTitleArea ? 0.3 : 1.0;
        
        cc.fillStyle = `rgba(231, 84, 128, ${titleOpacity})`;
        cc.font = `${titleFontSize}px Luxurious Script, cursive`;
        cc.textAlign = 'center';
        cc.fillText(titleText, titleX, titleY);
    }
    
    // Draw game over screen
    if(gameOver){
        // Semi-transparent overlay
        cc.fillStyle = 'rgba(255, 192, 203, 0.8)';
        cc.fillRect(0, 0, canvas.width, canvas.height);
        
        // Game over text
        cc.fillStyle = '#e75480';
        cc.font = `${72 * scale}px Luxurious Script, cursive`;
        cc.textAlign = 'center';
        cc.fillText('Game Over', canvas.width/2, canvas.height/2 - 50 * scale);
        
        // Final score
        cc.font = `${48 * scale}px Luxurious Script, cursive`;
        cc.fillText(`${leftScore} - ${rightScore}`, canvas.width/2, canvas.height/2 + 50 * scale);
        
        // Restart button
        const buttonWidth = 150 * scale;
        const buttonHeight = 45 * scale;
        const buttonX = canvas.width / 2 - buttonWidth / 2;
        const buttonY = canvas.height / 2 + 80 * scale;
        const cornerRadius = 10 * scale;
        
        // Draw rounded rectangle
        cc.fillStyle = '#e75480';
        cc.beginPath();
        cc.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, cornerRadius);
        cc.fill();
        cc.strokeStyle = '#C1477C';
        cc.lineWidth = 2;
        cc.stroke();
        cc.closePath();
        
        cc.fillStyle = '#FFC0CB';
        cc.font = `${20 * scale}px Luxurious Script, cursive`;
        cc.fillText('Play Again', canvas.width/2, buttonY + buttonHeight/2 + 6 * scale);
    }
}
function drawFlower(x, y, radius) {
    const petalCount = 5;
    const petalRadius = radius * 0.8;
    
    // Draw petals (fill only)
    cc.fillStyle = '#FF69B4'; // Pink petals
    for (let i = 0; i < petalCount; i++) {
        const angle = (i * Math.PI * 2) / petalCount;
        const petalX = x + Math.cos(angle) * radius * 0.5;
        const petalY = y + Math.sin(angle) * radius * 0.5;
        
        cc.beginPath();
        cc.arc(petalX, petalY, petalRadius, 0, Math.PI * 2);
        cc.fill();
        cc.closePath();
    }
    
    // Draw outline around entire flower
    cc.strokeStyle = '#C1477C'; // Darker pink outline
    cc.lineWidth = 2;
    cc.beginPath();
    for (let i = 0; i < petalCount; i++) {
        const angle = (i * Math.PI * 2) / petalCount;
        const petalX = x + Math.cos(angle) * radius * 0.5;
        const petalY = y + Math.sin(angle) * radius * 0.5;
        
        // Create outer edge of each petal
        const startAngle = angle - Math.PI / petalCount;
        const endAngle = angle + Math.PI / petalCount;
        
        for (let j = 0; j <= 20; j++) {
            const t = j / 20;
            const currentAngle = startAngle + (endAngle - startAngle) * t;
            const edgeX = petalX + Math.cos(currentAngle) * petalRadius;
            const edgeY = petalY + Math.sin(currentAngle) * petalRadius;
            
            if (i === 0 && j === 0) {
                cc.moveTo(edgeX, edgeY);
            } else {
                cc.lineTo(edgeX, edgeY);
            }
        }
    }
    cc.closePath();
    cc.stroke();
    
    // Draw center
    cc.fillStyle = '#FFD700'; // Golden center
    cc.beginPath();
    cc.arc(x, y, radius * 0.4, 0, Math.PI * 2);
    cc.fill();
    cc.closePath();
}
function update() {
    if(gameOver)return;
    const paddleSpeed = 6 * scaleY;
    if(keys['w']&&leftpaddley>0)leftpaddley-=paddleSpeed;
    if(keys['s']&&leftpaddley<canvas.height-(paddleHeight * scaleY))leftpaddley+=paddleSpeed;
    if(keys['ArrowUp']&&rightpaddley>0)rightpaddley-=paddleSpeed;
    if(keys['ArrowDown']&&rightpaddley<canvas.height-(paddleHeight * scaleY))rightpaddley+=paddleSpeed;
    
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    
    if (ballY - (ballRadius * scale) < 0 || ballY + (ballRadius * scale) > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }
    
    // Left paddle collision
    if (ballSpeedX < 0 && 
        ballX - (ballRadius * scale) <= 10 * scaleX + paddleWidth * scaleX && 
        ballX - (ballRadius * scale) >= 10 * scaleX &&
        ballY + (ballRadius * scale) >= leftpaddley && 
        ballY - (ballRadius * scale) <= leftpaddley + (paddleHeight * scaleY)) {
        ballSpeedX = Math.abs(ballSpeedX);
        leftScore++; // Left player gets point for hitting ball
    }
    
    // Right paddle collision
    if (ballSpeedX > 0 && 
        ballX + (ballRadius * scale) >= canvas.width - (20 * scaleX) && 
        ballX + (ballRadius * scale) <= canvas.width - (10 * scaleX) &&
        ballY + (ballRadius * scale) >= rightpaddley && 
        ballY - (ballRadius * scale) <= rightpaddley + (paddleHeight * scaleY)) {
        ballSpeedX = -Math.abs(ballSpeedX);
        rightScore++; // Right player gets point for hitting ball
    }
    
    // Game over when ball hits either side
    if (ballX - (ballRadius * scale) < 0 || ballX + (ballRadius * scale) > canvas.width) {
        gameOver = true;
    }
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * 3 * scaleX;
    ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * 2.5 * scaleY;
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
gameLoop();
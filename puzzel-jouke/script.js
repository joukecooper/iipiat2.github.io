const blockWidth = 30;
const blockHeight = 30;
const goudstaafColor = 'gold';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const rows = Math.floor(canvas.height / blockHeight);
const cols = Math.floor(canvas.width / blockWidth);

const board = Array.from({ length: rows }, () => Array(cols).fill(0));

let currentGoudstaaf = generateGoudstaaf();
let score = 0;

let fallInterval;

let highscore = localStorage.getItem('highscore');
if (!highscore) {
    localStorage.setItem('highscore', 0);
}

const popup = document.getElementById('popup');
const startButton = document.getElementById('startButton');

const hintButton = document.getElementById('hintButton');
const hintPopup = document.getElementById('hintPopup');
const closeHintButton = document.getElementById('closeHintButton');

hintButton.addEventListener('click', () => {
    hintPopup.style.display = 'flex';
});

closeHintButton.addEventListener('click', () => {
    hintPopup.style.display = 'none';
});

let gameStarted = false;
let gameEnded = false;

// Verzameldoel
const collectGoal = 115;

// Pop-ups
const collectGoalPopup = document.getElementById('collectGoalPopup');
const continueButton = document.getElementById('continueButton');

function showCollectGoalPopup() {
    collectGoalPopup.style.display = 'flex';
}

continueButton.addEventListener('click', () => {
    collectGoalPopup.style.display = 'none';
    window.location.href = '../P5-vault-open/index.html';
});

function resetGame() {
    location.reload();
    // board.forEach(row => row.fill(0));
    // // Reset de score
    // score = 0;
    // document.getElementById('score').innerText = `Score: ${score}`;

    // // Start het spel opnieuw
    // gameStarted = true;
    // startFalling();
}

function drawGoudstaaf(x, y) {
    ctx.fillStyle = goudstaafColor;
    ctx.fillRect(x * blockWidth, y * blockHeight, blockWidth, blockHeight);

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(x * blockWidth, y * blockHeight, blockWidth, blockHeight);
}

function drawBoard() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (board[row][col] === 1) {
                drawGoudstaaf(col, row);
            }
        }
    }
}

function drawCurrentGoudstaaf() {
    currentGoudstaaf.shape.forEach((row, rIndex) => {
        row.forEach((value, cIndex) => {
            if (value) {
                drawGoudstaaf(currentGoudstaaf.x + cIndex, currentGoudstaaf.y + rIndex);
            }
        });
    });
}

function generateGoudstaaf() {
    const shapes = [
        [[1, 1, 1], [0, 1, 0], [0, 0, 1]],
        [[1, 1, 1, 1], [0, 0, 1, 0]],
        [[1, 1, 1, 1], [0, 1, 0, 0], [0, 1, 1, 0]],
    ];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const x = Math.floor(cols / 2) - Math.floor(shape[0].length / 2);
    const y = 0;
    return { shape, x, y };
}

function isCollision(x, y, shape) {
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (!shape[r][c]) continue;
            const newX = x + c;
            const newY = y + r;
            if (newX < 0 || newX >= cols || newY >= rows || board[newY][newX]) {
                return true;
            }
        }
    }
    return false;
}

function mergeGoudstaaf() {
    currentGoudstaaf.shape.forEach((row, rIndex) => {
        row.forEach((value, cIndex) => {
            if (value) {
                const x = currentGoudstaaf.x + cIndex;
                const y = currentGoudstaaf.y + rIndex;
                board[y][x] = 1;
            }
        });
    });
    updateScore();
}

function updateHighscore(newHighscore) {
    if (newHighscore > highscore) {
        highscore = newHighscore;
        localStorage.setItem('highscore', highscore);
    }
}

function updateScore() {
    score = 0;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (board[row][col] === 1) {
                score++;
            }
        }
    }

    document.getElementById('score').innerText = `Score: ${score}`;
    
    if (gameEnded) {
        if (score >= collectGoal) {
            showCollectGoalPopup();
        } else if (score > highscore) {
            highscore = score;
            localStorage.setItem('highscore', highscore);
        }
    }
}

window.addEventListener('load', () => {
    popup.style.display = 'flex';
});

startButton.addEventListener('click', () => {
    popup.style.display = 'none';
    gameStarted = true;
    gameLoop();
});

function moveGoudstaaf(dx, dy) {
    if (gameStarted) {
        const newX = currentGoudstaaf.x + dx;
        const newY = currentGoudstaaf.y + dy;

        if (!isCollision(newX, newY, currentGoudstaaf.shape)) {
            currentGoudstaaf.x = newX;
            currentGoudstaaf.y = newY;
        }
    }
}

function startFalling() {
    if (!gameStarted || gameEnded) {
        return;
    }

    fallInterval = setInterval(() => {
        moveGoudstaaf(0, 1);
        if (isCollision(currentGoudstaaf.x, currentGoudstaaf.y + 1, currentGoudstaaf.shape)) {
            clearInterval(fallInterval);
            mergeGoudstaaf();
            currentGoudstaaf = generateGoudstaaf();
            if (isCollision(currentGoudstaaf.x, currentGoudstaaf.y, currentGoudstaaf.shape)) {
                // Speelveld vol = spel voorbij
                gameEnded = true;
                updateScore();
                if (score < collectGoal) {
                    resetGame();
                    startFalling();
                }
            }
        }
    }, 50);
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') {
        moveGoudstaaf(-1, 0);
    } else if (event.key === 'ArrowRight') {
        moveGoudstaaf(1, 0);
    } else if (event.key === 'ArrowDown') {
        moveGoudstaaf(0, 1);
    } else if (event.key === ' ') {
        if (!gameStarted) {
            gameStarted = true;
            startFalling();
        } else {
            clearInterval(fallInterval);
            startFalling();
        }
    }
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawCurrentGoudstaaf();
    updateScore();
    requestAnimationFrame(gameLoop);
}

popup.style.display = 'flex';

window.onload = function () {
    document.getElementById('score').innerText = `Score: ${score}`;
    document.getElementById('highscore').innerText = `Highscore: ${highscore}`;
}
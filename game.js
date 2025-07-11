const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext("2d");
const gameConteiner = document.getElementById('game-container');
const flappyImg = new Image();
flappyImg.src = 'img/flappybird.png';

// Constantes del juego
const FLPA_SPEED = -4;
const BIRD_WIDTH = 60;
const BIRD_HEIGHT = 50;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;

// Valores del personaje
let birdX = 50;
let birdY = 50;
let birdVelocity = 0;
let birdAcceleration = 0.1;

// Pipe variables
let pipeX = 400;
let pipeY = canvas.height - 200;

// Score
let scoreDiv = document.getElementById('score-display');
let score = 0;
let highScore = 0;

let scored = false;

// Audio de colision
const collisionAudio = new Audio('img/flappyExplotando.wav');
// Audio fondo
// const backgroundAudio = new Audio('img/fondoSonido.mp3');

canvas.addEventListener('touchstart', function (e) {
    if (window.innerWidth <= 600) {
        birdVelocity = FLPA_SPEED;
        e.preventDefault(); // Evita scroll táctil
    }
});

document.body.addEventListener('keydown', function (e) {
    if (e.code === 'ArrowUp') {
        birdVelocity = FLPA_SPEED;
        e.preventDefault();  // Bloquea scroll con flecha arriba
    }
});

document.getElementById('restart').addEventListener('click', function () {
    hideEndMenu();
    resetGame();
    loop();
});

function increaseScore() {
    if (birdX > pipeX + PIPE_WIDTH &&
        (birdY < pipeY + PIPE_GAP ||
            birdY + BIRD_HEIGHT > pipeY + PIPE_GAP) &&
        !scored) {
        score++;
        scoreDiv.innerHTML = score;
        scored = true;
    }
    if (birdX < pipeX + PIPE_WIDTH) {
        scored = false;
    }
}

function collisionCheck() {
    // Hitbox del pájaro ajustada
    const birdBox = {
        x: birdX + 7,                 // 5 píxeles desde la izquierda del pájaro
        y: birdY + 7,                 // 5 píxeles desde arriba del pájaro
        width: BIRD_WIDTH - 15,       // ancho un poco menor
        height: BIRD_HEIGHT - 15      // alto un poco menor
    };
    const topPipeBox = {
        x: pipeX,
        y: pipeY - PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: pipeY
    };
    const bottomPipeBox = {
        x: pipeX,
        y: pipeY + PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: canvas.height - pipeY - PIPE_GAP
    };

    if (birdBox.x + birdBox.width > topPipeBox.x &&
        birdBox.x < topPipeBox.x + topPipeBox.width &&
        birdBox.y < topPipeBox.y) {
        return true;
    }

    if (birdBox.x + birdBox.width > bottomPipeBox.x &&
        birdBox.x < bottomPipeBox.x + bottomPipeBox.width &&
        birdBox.y + birdBox.height > bottomPipeBox.y) {
        return true;
    }

    if (birdY < 0 || birdY + BIRD_HEIGHT > canvas.height) {
        return true;
    }

    return false;
}

function hideEndMenu() {
    document.getElementById('end-menu').style.display = 'none';
    gameConteiner.classList.remove('backdrop-blur');
}

function showEndMenu() {
    document.getElementById('end-menu').style.display = 'block';
    gameConteiner.classList.add('backdrop-blur');
    document.getElementById('end-score').innerHTML = score;

    if (highScore < score) {
        highScore = score;
    }
    document.getElementById('best-score').innerHTML = highScore;
}

function resetGame() {
    birdX = 50;
    birdY = 50;
    birdVelocity = 0;
    birdAcceleration = 0.1;

    pipeX = 400;
    pipeY = canvas.height - 200;

    score = 0;
}

function endgame() {
    collisionAudio.play();
    showEndMenu();
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(flappyImg, birdX, birdY, BIRD_WIDTH, BIRD_HEIGHT);

    // Dibujo de tubos
    ctx.fillStyle = '#333';
    ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
    ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);

    // Comprobar colisiones y fin del juego
    if (collisionCheck()) {
        endgame();
        return;
    }

    // Movimiento de los tubos
    pipeX -= 1.5;

    if (pipeX < -50) {
        pipeX = 400;
        pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
    }

    birdVelocity += birdAcceleration;
    birdY += birdVelocity;

    //backgroundAudio.play();

    increaseScore();
    requestAnimationFrame(loop);
}

loop();
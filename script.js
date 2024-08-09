const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 320;
canvas.height = 480;

let bird = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    gravity: 0.6,
    lift: -15,
    velocity: 0
};

let pipes = [];
let frame = 0;
let score = 0;

function drawBird() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.fillStyle = 'green';
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
    });
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y > canvas.height - bird.height) {
        bird.y = canvas.height - bird.height;
        bird.velocity = 0;
    }

    if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
    }
}

function updatePipes() {
    if (frame % 75 === 0) {
        let gap = 100;
        let top = Math.random() * (canvas.height / 2);
        let bottom = canvas.height - top - gap;
        pipes.push({ x: canvas.width, top, bottom, width: 20 });
    }

    pipes.forEach(pipe => {
        pipe.x -= 2;
    });

    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

function checkCollision() {
    pipes.forEach(pipe => {
        if (bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)) {
            resetGame();
        }
    });
}

function updateScore() {
    pipes.forEach(pipe => {
        if (pipe.x + pipe.width === bird.x) {
            score++;
            document.getElementById('score').innerText = score;
        }
    });
}

function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    document.getElementById('score').innerText = score;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBird();
    drawPipes();

    updateBird();
    updatePipes();
    checkCollision();
    updateScore();

    frame++;
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', function (e) {
    if (e.code === 'Space') {
        bird.velocity = bird.lift;
    }
});

gameLoop();

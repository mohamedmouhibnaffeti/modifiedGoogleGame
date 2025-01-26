// Board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

// Dino
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight
};

// Cactus
let cactusArray = [];
let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;
let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

// Physics
let velocityX = -8; // Cactus moving left speed
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

// Background Music
let backgroundMusic;
let musicStarted = false; // Flag to track if music has started

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); // Used for drawing on the board

    // Initialize Dinosaur
    dinoImg = new Image();
    dinoImg.src = "./img/airplane.png";
    dinoImg.onload = function () {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    };

    // Load Cactus Images
    cactus1Img = new Image();
    cactus1Img.src = "./img/skyscraper.png";

    cactus2Img = new Image();
    cactus2Img.src = "./img/skyscraper.png";

    cactus3Img = new Image();
    cactus3Img.src = "./img/skyscraper.png";

    // Start Game Loop
    requestAnimationFrame(update);
    setInterval(placeCactus, 1000); // Place cactus every second

    // Listen for Key Presses
    document.addEventListener("keydown", moveDino);
};

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // Apply Gravity to Dino
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY); // Dino cannot go below the ground
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    // Move and Draw Cactus
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        // Check Collision
        if (detectCollision(dino, cactus)) {
            console.log("Collision detected!");
            backgroundMusic.pause()
            const collisionSound = new Audio('./img/explosion.mp3');
            collisionSound.play().catch((error) => {
                console.error("Sound playback failed:", error);
            });

            gameOver = true;
            dinoImg.src = "./img/starburst.png";
            dinoImg.onload = function () {
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
            };
        }
    }

    // Display Score
    context.fillStyle = "black";
    context.font = "20px courier";
    score++;
    context.fillText(score, 5, 20);
}

function moveDino(e) {
    if (gameOver) {
        return;
    }

    if ((e.code === "Space" || e.code === "ArrowUp") && dino.y === dinoY) {
        // Play Background Music on First Space Key Press
        if (!musicStarted) {
            backgroundMusic = new Audio('./img/nasheed.mp3'); // Replace with your music file path
            backgroundMusic.loop = true; // Loop the music continuously
            backgroundMusic.volume = 0.5; // Adjust volume
            backgroundMusic.play().catch((error) => {
                console.error("Background music playback failed:", error);
            });
            musicStarted = true; // Set flag to true
        }

        // Jump
        velocityY = -10;
    } else if (e.code === "ArrowDown" && dino.y === dinoY) {
        // Duck (Optional)
    }
}

function placeCactus() {
    if (gameOver) {
        return;
    }

    // Place Cactus
    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight
    };

    let placeCactusChance = Math.random(); // 0 - 0.9999...

    if (placeCactusChance > 0.90) { // 10% chance of cactus3
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    } else if (placeCactusChance > 0.70) { // 30% chance of cactus2
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    } else if (placeCactusChance > 0.50) { // 50% chance of cactus1
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }

    // Limit Cactus Array Length
    if (cactusArray.length > 5) {
        cactusArray.shift(); // Remove first element to prevent array from growing infinitely
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width && // A's top left doesn't reach B's top right
        a.x + a.width > b.x && // A's top right passes B's top left
        a.y < b.y + b.height && // A's top left doesn't reach B's bottom left
        a.y + a.height > b.y; // A's bottom left passes B's top left
}

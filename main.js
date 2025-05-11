const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// Load images
const playerImg = new Image();
playerImg.src = "assets/player.png";
const enemyImg = new Image();
enemyImg.src = "assets/enemy.png";
const bulletImg = new Image();
bulletImg.src = "assets/bullet.png";
const bgImg = new Image();
bgImg.src = "assets/background.png";

let player = {
  x: 100,
  y: 300,
  width: 32,
  height: 32,
  speed: 3,
  bullets: [],
  health: 100
};

let enemies = [];
let score = 0;

function spawnEnemy() {
  enemies.push({
    x: 800,
    y: Math.random() * 570,
    width: 32,
    height: 32,
    speed: 2
  });
}

setInterval(spawnEnemy, 1500);

function shoot() {
  player.bullets.push({ x: player.x + 30, y: player.y + 14, speed: 6 });
}

document.addEventListener("keydown", e => {
  if (e.code === "Space") shoot();
});

function update() {
  if (keys["ArrowUp"]) player.y -= player.speed;
  if (keys["ArrowDown"]) player.y += player.speed;

  player.bullets.forEach((b, i) => {
    b.x += b.speed;
    if (b.x > 800) player.bullets.splice(i, 1);
  });

  enemies.forEach((enemy, ei) => {
    enemy.x -= enemy.speed;
    if (enemy.x < -enemy.width) enemies.splice(ei, 1);

    player.bullets.forEach((bullet, bi) => {
      if (bullet.x < enemy.x + enemy.width &&
          bullet.x + 10 > enemy.x &&
          bullet.y < enemy.y + enemy.height &&
          bullet.y + 10 > enemy.y) {
        enemies.splice(ei, 1);
        player.bullets.splice(bi, 1);
        score += 10;
      }
    });

    // Player collision
    if (enemy.x < player.x + player.width &&
        enemy.x + enemy.width > player.x &&
        enemy.y < player.y + player.height &&
        enemy.y + enemy.height > player.y) {
      player.health -= 10;
      enemies.splice(ei, 1);
    }
  });
}

function draw() {
  ctx.drawImage(bgImg, 0, 0, 800, 600);
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  player.bullets.forEach(b => {
    ctx.drawImage(bulletImg, b.x, b.y, 10, 5);
  });

  enemies.forEach(enemy => {
    ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
  });

  // UI
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 20);
  ctx.fillText(`Health: ${player.health}`, 10, 50);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update();
  draw();
  if (player.health > 0) {
    requestAnimationFrame(gameLoop);
  } else {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("GAME OVER", 300, 300);
  }
}

bgImg.onload = () => {
  gameLoop();
};

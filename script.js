const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const levelDisplay = document.getElementById('level');
const startBtn = document.getElementById('start-btn');
const message = document.getElementById('message');
const highScoreDisplay = document.getElementById('high-score');

let updatescore = 0;
let score = 0;
let timeLeft = 30;
let level = 1;
let gameInterval = null;
let spawnInterval = null;
let isPlaying = false;

let highScore = Number(localStorage.getItem('highScore')) || 0;
highScoreDisplay.textContent = highScore;

startBtn.addEventListener('click', startGame);

function startGame() {
  score = 0;
  timeLeft = 30;
  level = 1;
  isPlaying = true;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  levelDisplay.textContent = level;
  message.textContent = '';
  gameArea.innerHTML = '';
  startBtn.disabled = true;

  gameInterval = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;

    if (timeLeft === 20 || timeLeft === 10) {
      level++;
      levelDisplay.textContent = level;
      clearInterval(spawnInterval);
      startSpawning();
    }

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);

  startSpawning();
}

function startSpawning() {
  const interval = Math.max(400, 1200 - (level + 1) * 300); 

  spawnInterval = setInterval(spawnTarget, interval);
}
function spawnTarget() {
  if (!isPlaying) return;

  const target = document.createElement('div');
  target.classList.add('target');

  const img = document.createElement('img');
  img.src = 'mole.png';          
  img.alt = 'ターゲット';
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'contain';
  img.style.pointerEvents = 'none';
  target.appendChild(img);

  const maxX = gameArea.clientWidth - 80;
  const maxY = gameArea.clientHeight - 80;
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  target.style.left = `${x}px`;
  target.style.top = `${y}px`;

  target.addEventListener('click', () => {
    const points = 10 * level;
    score += points;
    scoreDisplay.textContent = score;

    const popup = document.createElement('div');
    popup.classList.add('point-popup');
    popup.textContent = (points);
    popup.style.left = target.style.left;
    popup.style.top = target.style.top;
    gameArea.appendChild(popup);

     setTimeout(() => {
    popup.remove();
  }, 500);
  target.remove();
  });

  gameArea.appendChild(target);

  setTimeout(() => {
    if (target.parentElement) {
      target.remove();
    }
  }, 1500 - (level - 1) * 200);
}
  gameArea.appendChild(target);

  setTimeout(() => {
    if (target.parentElement) {
      target.remove();
    }
  }, 1500 - (level - 1) * 200);

function endGame() {
  isPlaying = false;
  clearInterval(gameInterval);
  clearInterval(spawnInterval);
  gameArea.innerHTML = '';
  startBtn.disabled = false;
  message.textContent = `ゲーム終了！ 最終スコア: ${score}点`;

   if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore); // 
    highScoreDisplay.textContent = highScore;
    message.textContent = `ゲーム終了 ${score}点`;
  } else {
    message.textContent = `ゲーム終了 ${score}点`;
  }
}
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameOver = false;
let gameMode = localStorage.getItem('mode') || 'pvp';

const boardEl = document.getElementById("board");
const turnIndicator = document.getElementById("turnIndicator");

function drawBoard() {
  boardEl.innerHTML = "";
  board.forEach((cell, i) => {
    const div = document.createElement("div");
    div.className = "cell";
    div.textContent = cell;
    div.onclick = () => handleClick(i);
    boardEl.appendChild(div);
  });
}

function handleClick(index) {
  if (board[index] || isGameOver) return;
  playSound("click");
  board[index] = currentPlayer;
  drawBoard();

  if (checkWinner()) {
    showPopup(`${currentPlayer} wins!`);
    playSound("win");
    isGameOver = true;
    return;
  } else if (board.every(c => c)) {
    showPopup("It's a draw!");
    playSound("draw");
    isGameOver = true;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  turnIndicator.textContent = `Turn: ${currentPlayer}`;

  if (gameMode === "ai" && currentPlayer === "O") {
    setTimeout(aiMove, 400);
  }
}

function aiMove() {
  const empty = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
  for (let i of empty) {
    board[i] = "O";
    if (checkWinner()) return finishAIMove(i);
    board[i] = "";
  }
  for (let i of empty) {
    board[i] = "X";
    if (checkWinner()) {
      board[i] = "O";
      return finishAIMove(i);
    }
    board[i] = "";
  }
  const random = empty[Math.floor(Math.random() * empty.length)];
  board[random] = "O";
  finishAIMove(random);
}

function finishAIMove(i) {
  drawBoard();
  if (checkWinner()) {
    showPopup("O wins!");
    playSound("win");
    isGameOver = true;
  } else if (board.every(c => c)) {
    showPopup("It's a draw!");
    playSound("draw");
    isGameOver = true;
  } else {
    currentPlayer = "X";
    turnIndicator.textContent = "Turn: X";
  }
}

function checkWinner() {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(([a,b,c]) =>
    board[a] && board[a] === board[b] && board[a] === board[c]
  );
}

function showPopup(message) {
  document.getElementById("winnerText").textContent = message;
  document.getElementById("popup").style.display = "flex";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  isGameOver = false;
  turnIndicator.textContent = "Turn: X";
  drawBoard();
  closePopup();
}

function goToMenu() {
  window.location.href = "index.html";
}

function playSound(type) {
  const sounds = {
    click: document.getElementById("clickSound"),
    win: document.getElementById("winSound"),
    draw: document.getElementById("drawSound")
  };
  sounds[type]?.play();
}

drawBoard();

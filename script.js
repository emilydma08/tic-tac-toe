/* Variable Creation */
const gameboard = (function () {
    let board = [
        null,null,null,
        null,null,null,
        null,null,null
    ];

    const makeMove = (box, symbol) => board[box] = symbol;
    const getBoard = () => board;
    const resetBoard = () => board = [null,null,null,null,null,null,null,null,null];
    return {makeMove, getBoard, resetBoard};
})();

function createPlayer (sym) {
    const symbol = sym;
    let score = 0;

    const getSymbol = () => symbol;
    const getScore = () => score;
    const updateScore = () => score++;
    return {getSymbol, getScore, updateScore};
}

const player1 = createPlayer("x");
const player2 = createPlayer("o");
let gameOver = false;

/* Getting DOM Elements */
const boxes = document.querySelectorAll(".box");
const playerTurn = document.querySelector("#playerNum");
const player1Score = document.querySelector("#player-1-score");
const player2Score = document.querySelector("#player-2-score");


boxes.forEach((box) => {box.addEventListener('click', () => {
    let boxChoice = parseInt(box.getAttribute('id'), 10);
    if (gameboard.getBoard()[boxChoice] != player1.getSymbol() && gameboard.getBoard()[boxChoice] != player2.getSymbol()){
        runMove(boxChoice);
    }
}
)});


let turn = 0;
let players = [player1, player2];
function runMove(boxChoice){
    if (gameOver) return;

    gameboard.makeMove(boxChoice, players[turn].getSymbol());

    if (evalGame(gameboard.getBoard()) != -1){
        displayResult();
        gameOver = true;
        return;
    }

    if (turn == 0){
        turn = 1;
    } else if (turn == 1){
        turn = 0;
    }
    updateDOM();
}

function updateDOM(){
    /* Updates DOM gameboard, turn, and scores */
    let index = 0;
    boxes.forEach((box) => {
        box.textContent = gameboard.getBoard()[index];
        index++;
    })
    
    
    playerTurn.textContent = turn + 1;

    player1Score.textContent = player1.getScore();
    player2Score.textContent = player2.getScore();
}

function evalGame(board) {
    const winCombos = [
        [0,1,2],[3,4,5],[6,7,8], // rows
        [0,3,6],[1,4,7],[2,5,8], // columns
        [0,4,8],[2,4,6]          // diagonals
    ];

    for (const [a, b, c] of winCombos) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    if (board.includes(null)) return -1; // game ongoing
    return 0; // tie

}

function displayResult(){
    updateDOM();

    const result = evalGame(gameboard.getBoard());

    setTimeout(() => {
        if (result == 0){
            alert("Tie!");
        } else if (result == player1.getSymbol()){
            alert("Player 1 wins!");
            player1.updateScore();
        } else if (result == player2.getSymbol()){
            alert("Player 2 wins!");
            player2.updateScore();
        }

        gameboard.resetBoard();
        updateDOM();
        gameOver = false;
    }, 50); 
}

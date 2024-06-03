//Board legend
// 0: empty square
// 1: piece
// 2: moves


const board = document.querySelector('.board');
const boardArray = [];
const blackPieces = [];
const whitePieces = [];
let blackMoves = 0;
let moveFrom, moveTo;
whoseTurn = 'white';

// Function to create a piece element
const createPieceElement = (piece, color, row, col) => {
    const pieceElement = document.createElement('div');
    pieceElement.innerHTML = piece;
    pieceElement.firstChild.dataset.color = color;
    pieceElement.firstChild.dataset.row = row;
    pieceElement.firstChild.dataset.column = col; 
    pieceElement.firstChild.classList.add(color);
    return pieceElement.firstChild;
};

// Fill the board with pieces
const fillBoard = () => {
    for (let i = 0; i < 8; i++) {
        boardArray[i] = [];
        blackPieces[i] = [];
        whitePieces[i] = [];
        for (let j = 0; j < 8; j++) {
            const square = document.createElement('div');
            square.classList.add('square');
            (i + j) % 2 === 0? square.classList.add('board__square--white'): square.classList.add('board__square--black');
            square.dataset.row = i;
            square.dataset.column = j;
            board.appendChild(square);
            boardArray[i][j] = 0;
            blackPieces[i][j] = 0;
            whitePieces[i][j] = 0;

            // Place pawns
            if (i === 1) {
                const pieceElement = createPieceElement(pawn, 'black', i, j);
                square.appendChild(pieceElement);
                blackPieces[i][j] = 1;
            } else if (i === 6) {
                const pieceElement = createPieceElement(pawn, 'white', i, j);
                square.appendChild(pieceElement);
                whitePieces[i][j] = 1;
            }

            // Place rooks, knights, bishops, queens, and kings
            if (i === 0 || i === 7) {
                const color = i === 0 ? 'black' : 'white';
                let piece;
                switch (j) {
                    case 0:
                    case 7:
                        piece = rook;
                        break;
                    case 1:
                    case 6:
                        piece = knight;
                        break;
                    case 2:
                    case 5:
                        piece = bishop;
                        break;
                    case 3:
                        piece = color === 'white' ? queen : king;
                        break;
                    case 4:
                        piece = color === 'white' ? king : queen;
                        break;
                }
                const pieceElement = createPieceElement(piece, color);
                square.appendChild(pieceElement);
                boardArray[i][j] = pieceElement;
                i === 0 ? blackPieces[i][j] = 1 : whitePieces[i][j] = 1;
            }
        }
    }
    showPrompt();
    console.table(boardArray);
    console.table(blackPieces);
    console.table(whitePieces);
};

// Show prompt when user turn
const showPrompt = () => {
    const promptDiv = document.querySelector('.board__prompt');
    promptDiv.classList.remove('board__prompt__fade');
    void promptDiv.offsetWidth;
    promptDiv.textContent = whoseTurn === 'white' ? 'White\'s turn' : 'Black\'s turn';
    promptDiv.style.visibility = 'visible';
    promptDiv.classList.add('board__prompt__fade');
    promptDiv.addEventListener('animationend', () => {
        promptDiv.classList.remove('board__prompt__fade');
        promptDiv.style.visibility = 'hidden';
    }, { once: true });
};

const getPosition = (pos) => {
    let x = Number(pos.dataset.column);
    let y = Number(pos.dataset.row);
    return [y, x];
};

const fillMoves = (square) => {
    let piece = square.firstChild;
    let pieceType = piece.dataset.type;
    let pieceColor = piece.dataset.color;
    let [y, x] = getPosition(square);
    let moves = [];
    switch (pieceType) {
        case 'pawn':
            let direction = pieceColor === 'white' ? -1 : 1;
            if (y === 6 && pieceColor === 'white' || y === 1 && pieceColor === 'black') {
                moves.push([y + 2 * direction, x]);
            }
            moves.push([y - 1, x]);
            if (document.querySelector(`[data-row="${y + direction}"][data-column="${x - 1}"]`).firstChild 
            && document.querySelector(`[data-row="${y + direction}"][data-column="${x - 1}"]`).firstChild.dataset.color !== pieceColor) {
                moves.push([y + direction, x - 1]);
            }
            if (document.querySelector(`[data-row="${y + direction}"][data-column="${x + 1}"]`).firstChild 
            && document.querySelector(`[data-row="${y + direction}"][data-column="${x + 1}"]`).firstChild.dataset.color !== pieceColor) {
                moves.push([y + direction, x + 1]);
            }
            break;
        case 'rook':
            break;
        case 'knight':
            break;
        case 'bishop':
            break;
        case 'queen':
            break;
        case 'king':
            break;
    }
    return JSON.stringify(moves);
};

const movePiece = (from, to) => {
    let pieceElement = from.firstChild;
    if (pieceElement) {
        to.appendChild(pieceElement);
    }
    whoseTurn = whoseTurn === 'white' ? 'black' : 'white';
};

const handleUserTurn = (event) => {
    if (whoseTurn === 'black') return;
    let square = event.target.closest('.square');
    if (!square) return;

    // If the square has a piece and it's the user's turn
    if (!moveFrom && square.firstChild && square.firstChild.dataset.color === whoseTurn) {
        square.firstChild.dataset.moves = fillMoves(square);
        moveFrom = square;
        highlight(square);
    } else {
        moveTo = square;
        const moves = JSON.parse(moveFrom.firstChild.dataset.moves);
        const position = [Number(moveTo.dataset.row), Number(moveTo.dataset.column)];
        if (moves.some(array => array[0] === position[0] && array[1] === position[1])) {
            movePiece(moveFrom, moveTo);
            setTimeout(ai, 300);
        }
        moveFrom = null;
        moveTo = null;
        clearHighlights();
        showPrompt();
    }
};
const highlight = (square) => {
    square.classList.add('board__square--highlight');
};

const clearHighlights = () => {
    document.querySelectorAll('.board__square--highlight').forEach(square => {
        square.classList.remove('board__square--highlight');
    });
}

board.addEventListener('click', handleUserTurn);

// Initialize the board
fillBoard();

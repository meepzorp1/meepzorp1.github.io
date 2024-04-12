const boardDiv = document.getElementById('chess');
const board = [];
board[0] = [rook, knight, bishop, queen, king, bishop, knight, rook];
board[1] = [pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn];
board[2] = ['', '', '', '', '', '', '', ''];
board[3] = ['', '', '', '', '', '', '', ''];
board[4] = ['', '', '', '', '', '', '', ''];
board[5] = ['', '', '', '', '', '', '', ''];
board[6] = [pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn];
board[7] = [rook, knight, bishop, queen, king, bishop, knight, rook];

class Move {
    constructor({from, to}) {
        this.piece = 0;
        this.from = from;
        this.to = to;
        this.color = 0;
    }
}
const move = new Move({from: { row: 0, col: 0, div: 0 }, to: { row: 0, col:0, div: 0 }});
//                                                                                  turn ai off/on
//const ai = new AI();
const ai = 0;

let turn = 'black';
let blackKing, whiteKing;

//           when pieces are dragged from their space back to own they dissappear
//           pieces same color dissappear
//
//           check for check
//           check for mate
//                              white player ai!?!?
//           end game

// finished
const dragStart = (e) => { 
    move.from.row = parseInt(e.target.parentNode.getAttribute('row'));
    move.from.col = parseInt(e.target.parentNode.getAttribute('col'));
    move.from.div = e.target;
    move.piece = e.target.id;
    move.color = e.target.classList.contains('pBlack')?'black':'white';

    console.log(move);
}
// finished
const dragOver = (e) => e.preventDefault();
// refactor
const dragDrop = (e) => {
    e.stopPropagation();

    let occupied = e.target.parentElement.id == 'chess'?false:true;

    move.to.div = occupied?e.target.parentElement:e.target;
    move.to.row = move.to.div.getAttribute('row');
    move.to.col = move.to.div.getAttribute('col');

    console.log(move.color, turn)
    if (move.color == turn) {
        
        let moveValid = false;

        //create function pieceMove?
        //have pieceMove call routeClear?
        switch (move.piece) {
            case 'pawn': 
                if (pieceMove(occupied)) moveValid = true;          
                break;
            case 'rook':
                if (pieceMove(occupied) && clearRoute()) moveValid = true;
                break;
            case 'knight':
                if (pieceMove(occupied)) moveValid = true;
                break;
            case 'bishop':
                if (clearRoute() && pieceMove(occupied)) moveValid = true;
                break;
            case 'king':
                if (pieceMove(occupied)) moveValid = true;
                break;
            case 'queen':
                if (clearRoute() && pieceMove(occupied)) moveValid = true;
                break;
        }

        if (moveValid) {
            checkCheck(turn=='black'?blackKing:whiteKing, turn=='black'?whiteKing:blackKing);
            if (e.target.classList.contains('piece')) {
                e.target.parentNode.append(move.from.div);
                e.target.remove();
            } else {
                e.target.append(move.from.div);
            }
            turn = turn=='black'?'white':'black';
            if (turn == 'white') {
                reverseSquares();
                if (ai) {
                    turn = ai.turn();
                    revertSquares();
                }
            }
            else revertSquares();
        }
    }
}
// finished
const drawBoard = () => {
    board.forEach((row, i) => {
        turn = turn == 'black'? 'white': 'black';
        row.forEach((col, j) => {
            turn = turn == 'black'? 'white': 'black';
            let space = document.createElement('div');
            space.setAttribute('row', i);
            space.setAttribute('col', j);
            space.classList.add('square');
            space.classList.add(turn);
            space.innerHTML = board[i][j];
            space.addEventListener('dragstart', dragStart);
            space.addEventListener('dragover', dragOver);
            space.addEventListener('drop', dragDrop);
            boardDiv.appendChild(space);
            if (i == 0 && j == 4) {
                blackKing = space;
            } else if (i == 7 && j == 4) {
                whiteKing = space;
            }

            
            space.firstChild?.setAttribute('draggable', 'true');
            if (i == 0 || i == 1) {
                space.firstChild.firstChild.classList.add('pBlack');
                space.firstChild.classList.add('pBlack');
            }
            if (i == 6 || i == 7) { 
                space.firstChild.firstChild.classList.add('pWhite');
                space.firstChild.classList.add('pWhite');
            }
        })
    })
}
// finished
const pieceMove = (occupied) => {
    switch (move.piece) {
        case 'pawn':
            if (move.to.col == move.from.col) {
                if (move.to.row - move.from.row == 1) return true
                else if (move.from.row == 1 && move.to.row - move.from.row == 2 && clearRoute()) return true;
            } else if ((move.to.col - 1 == move.from.col || move.to.col + 1 == move.from.col) && occupied) return true;
            break;
        case 'rook':
            if (move.from.col == move.to.col || move.from.row == move.to.row) return true;          
            break;
        case 'knight':
            if (Math.abs(move.from.col - move.to.col) == 2 && Math.abs(move.from.row - move.to.row) == 1) return true;
            else if (Math.abs(move.from.col - move.to.col) == 1 && Math.abs(move.from.row - move.to.row) == 2) return true;
            break;
        case 'bishop':
            if (Math.abs(move.from.col - move.to.col) == Math.abs(move.from.row - move.to.row)) return true;
            break;
        case 'king':
            if (Math.abs(move.from.col - move.to.col) == 1 || Math.abs(move.from.row - move.to.row) == 1) return true;
            break;
        case 'queen':
            if (move.from.row == move.to.row || move.from.col == move.to.col) return true;
            else if (Math.abs(move.from.row - move.to.row) == Math.abs(move.from.col - move.to.col)) return true;
            break;
    }
}
// finished
const reverseSquares = () => {
    let i = boardDiv.childNodes.length;
    let z = Math.sqrt(i);
    i--;

    boardDiv.childNodes.forEach(square => {
        square.setAttribute('row', (Math.floor(i / z)));
        square.setAttribute('col', (i % z));
        i--;
    });
}
// finsished
const revertSquares = () => {
    let i = boardDiv.childNodes.length;
    let z = Math.sqrt(i);

    while (i) {
        i--;
        boardDiv.childNodes[i].setAttribute('row', (Math.floor(i/z)));
        boardDiv.childNodes[i].setAttribute('col', (i%z));
    }
}
// refactor... hmm
const clearRoute = () => {
    switch (move.piece) {
        case 'pawn':
            if (document.querySelector(`[col="${move.from.col}"][row="${move.from.row + 1}"]`).childNodes.length) return false;
            else return true;
            break;
        case 'rook':
            if (move.from.row == move.to.row) {
                if (move.from.col < move.to.col) {
                    for (let i = 1 + move.from.col; i < move.to.col; i++) {
                        if (document.querySelector(`[col="${i}"][row="${move.from.row}"]`).childNodes.length) return false;
                    }
                } else if (move.from.col > move.to.col) {
                    for (let i = 1 + move.to.col; i < move.from.col; i++) {
                        if (document.querySelector(`[col="${i}"][row="${move.from.row}"]`).childNodes.length) return false;
                    }
                }
            }
            else if (move.from.col == move.to.col) {
                if (move.from.row < move.to.row) {
                    for (let i = 1 + move.from.row; i < move.to.row; i++) {
                        if (document.querySelector(`[col="${move.from.col}"][row="${i}"]`).childNodes.length) return false;
                    }
                } else if (move.from.row > move.to.row) {
                    for (let i = 1 + move.to.row; i < move.from.row; i++) {
                        if (document.querySelector(`[col="${move.from.col}"][row="${i}"]`).childNodes.length) return false;
                    }
                }
            }
            return true;
            break;
        case 'bishop':
            if (move.from.row < move.to.row && move.from.col < move.to.col) {
                for(let i = 1; move.from.row + i < move.to.row; i++) {
                    if (document.querySelector(`[col="${move.from.col + i}"][row="${move.from.row + i}"]`).childNodes.length) return false;
                }
            } else if (move.from.row < move.to.row && move.from.col > move.to.col) {
                for (let i = 1; move.from.row + i < move.to.row; i++) {
                    if (document.querySelector(`[col="${move.from.col - 1}"][row="${move.from.row + i}"]`).childNodes.length) return false;
                }
            } else if (move.from.row > move.to.row && move.from.col < move.to.col) {
                for (let i = 1; move.to.row + i < move.from.row; i++) {
                    if (document.querySelector(`[col="${move.from.col + i}"][row="${move.from.row - i}"]`).childNodes.length) return false;
                }
            } else if (move.from.row > move.to.row && move.from.col > move.to.col) {
                for (let i = 1; move.to.row + i < move.from.row; i++) {
                    if (document.querySelector(`[col="${move.from.col - i}"][row="${move.from.row - i}"]`).childNodes.length) return false;
                }
            }
            return true;
            break;
        case 'queen':

            if (move.from.col < move.to.col && move.from.row < move.to.row) {
                console.log('1');
                for (let i = 1; move.from.col + i < move.to.col; i++) {
                    if (document.querySelector(`[col="${move.from.col + i}"][row="${move.from.row + i}"]`).childNodes.length) return false;
                }
            } else if (move.from.col < move.to.col && move.from.row == move.to.row) {
                console.log('2');
                for (let i = 1; move.from.col + i < move.to.col; i++) {
                    if (document.querySelector(`[col="${move.from.col + i}"][row="${move.from.row}"]`).childNodes.length) return false;
                }
            } else if (move.from.col < move.to.col && move.from.row > move.to.row) {
                console.log('3');
                for (let i = 1; move.from.col + i < move.to.col; i++) {
                    if (document.querySelector(`[col="${move.from.col + i}"][row="${move.from.row - i}"]`).childNodes.length) return false;
                }
            } else if (move.from.col > move.to.col && move.from.row < move.to.row) {
                console.log('4');
                for (let i = 1; move.from.col - i > move.to.col; i++) {
                    if (document.querySelector(`[col="${move.from.col - i}"][row="${move.from.row + i}"]`).childNodes.length) return false;
                }
            } else if (move.from.col > move.to.col && move.from.row > move.to.row) {
                console.log('5');
                for (let i = 1; move.from.col - i > move.to.col; i++) {
                    if (document.querySelector(`[col="${move.from.col - i}"][row="${move.from.row - i}"]`).childNodes.length) return false;
                }
            } else if (move.from.col > move.to.col && move.from.row == move.to.row) {
                console.log('6');
                for (let i = 1; move.from.col - i > move.to.col; i++) {
                    if (document.querySelector(`[col="${move.from.col - i}"][row="${move.from.row}"]`).childNodes.length) return false;
                }
            } else if (move.from.col == move.to.col && move.from.row < move.to.row) {
                console.log('7');
                for (let i = 1; move.from.row + i < move.to.row; i++) {
                    if (document.querySelector(`[col="${move.from.col}"][row="${move.from.row + i}"]`).childNodes.length) return false;
                }
            } else if (move.from.col == move.to.col && move.from.row > move.to.row) {
                console.log('8');
                for (let i = 1; move.from.row - i > move.to.row; i++) {
                    if (document.querySelector(`[col="${move.from.col}"][row="${move.from.row - i}"]`).childNodes.length) return false;
                }
            }
            return true;
            break;
    }
    return;
}
// working
const checkCheck = (movingKing, defendKing) => {
    console.log('checking check')


    // it is possible to put yourself in check... check both sides
    // it is also possible that the piece moved isn't neccessarily the new piece that puts in check
    // therefore this needs to check piece moved to and from for moving side and king for both sides
    //
    // if you put yourself in check prevent move completely
    //
    // should make variable to always track both kings
    //
    // limits
    // moving side king check depends on moveFrom
    // defending side king check depends on from and to

    // if (diaginal) if row and col ==
    // else if (straight) if row or col ==

    if (movingKing.getAttribute('row') == move.from.row || 
    movingKing.getAttribute('col') == move.from.col) {

        console.log('rook');

    } else if (Math.abs(movingKing.getAttribute('row') - move.from.row) ==
    Math.abs(movingKing.getAttribute('col') - move.from.col)) {
        if (move.from.row < movingKing.getAttribute('row') && move.from.col < movingKing.getAttribute('col')) {
            for (let i = movingKing.getAttribute('row') - 1; i >= 0; i--) {
                if (document.querySelector(`[col="${i}"][row="${i}"]`).childNodes.length) console.log(document.querySelector(`[col="${i}"][row="${i}"]`).childNodes)
            }
        } else if (move.from.row < movingKing.getAttribute('row') && move.from.col > movingKing.getAttribute('col')) {

        } else if (move.from.row > movingKing.getAttribute('row') && move.from.col < movingKing.getAttribute('col')) {
            for (let i = parseInt(movingKing.getAttribute('row')) + 1; i <= 8; i++) {
                console.log(i, i * -1)
                // ^ doesn't work
                //if (document.querySelector(`[col="${i * -1}"][row="${i}"]`).childNodes.length) console.log(document.querySelector(`[col="${i * -1}"][row="${i}"]`).firstChild)
            }
        } else if (move.from.row > movingKing.getAttribute('row') && move.from.col > movingKing.getAttribute('col')) {

        }
        console.log('bishop');
    }


}
const mateCheck = () => {

}

drawBoard();
// Simulate computer turn (black)
const ai = () => {
    blackMoves++;
    fillAIBoard();
    fillAIMoves();
    console.table(boardArray);
};

const fillAIBoard = () => {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (document.querySelector(`[data-row="${i}"][data-column="${j}"]`).firstChild) {
                if (document.querySelector(`[data-row="${i}"][data-column="${j}"]`).firstChild.dataset.color === 'black') {
                    boardArray[i][j] = 1;
                } else boardArray[i][j] = 2;
            } 
        }
    }
};

const fillAIMoves = () => {


};

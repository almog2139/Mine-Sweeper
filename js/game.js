'use srict'
var gBoard;
var gSizeMine = 2;
const MINE = '💣';
const FLAG = '🚩';
const SMILE_STARS = '🙂';
const SMILE_WIN = '🥳';
const SMILE_LOSE = '😡';
var gCountLive = 0;
var gTimer = null;
var gHins = null;
var gElBtnSmile = document.querySelector('.smile');
var gMineLocations = [];
var gRow;
var gCol;
var HI;
var gCountSafe = 0;
var gArrUndos = [];

var gLevel = {
    size: 4,
    mines: 2
}
var gGame = {
    isOn: false,
    showCount: 0,
    markedCount: 0,
    secsPassed: 0
}
function initGame() {
    var elSec = document.querySelector('h2 span')
    elSec.innerText = 0;
    gBoard = buildBoard();
    console.log(gBoard);
    renderBoard(gBoard)
    gGame.isOn = true;
    gElBtnSmile.innerText = SMILE_STARS;
    gGame.showCount = 0;
    gGame.secsPassed = 0;
    gGame.markedCount = 0;
    secsPassed = 0;
    clearTimeout(gTimer);


}
function setMinesNegCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            cell.minesAroundCount = countNeighbors(i, j, board);
        }
    }
}
function countNeighbors(cellI, cellJ, board) {
    var countMine = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            if (board[i][j].isMine === true) countMine++;
        }
    }
    return countMine;
}
function getRandomMine(board) {
    var emptyLocations = getRandomEmpty(board);
    if (emptyLocations.length === 0) return
    var randomIdx = getRandomIntInclusive(0, emptyLocations.length - 1);//5
    gMineLocations.push(emptyLocations[randomIdx]);
    console.log(gMineLocations);
    //model
    board[emptyLocations[randomIdx].i][emptyLocations[randomIdx].j].isMine = true;


}
function hins(elBtn) {
    i = gRow;
    j = gCol;
    if (!gBoard[i][j].isShow)return
    if (gBoard[i][j].minesAroundCount !== 0 || gBoard[i][j].isMine) {
        expandShown2(i, j);
        elBtn.innerText='❓'
        gHins = setTimeout(expandHide, 2000, i, j)
        


    }
}

function cellClicked(elCell, i, j, ev) {
    console.log('cell:', elCell);
    gRow = i;
    gCol = j;
    if (gBoard[i][j].isShow === false) {
        gGame.showCount++;
        gArrUndos.push({ i: gRow, j: gCol })
    }
    console.log(('count:', gGame.showCount));
    window.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    }, false);
    // if (checkGameOver()) {
    //     gElBtnSmile.innerText = SMILE_WIN;
    //     clearInterval(gTimer);
    // }
    if (gGame.isOn === false || gBoard[i][j].isShow === true && !gBoard[i][j].isMarked) return;
    else {
        if (gGame.showCount === 1) {
            if (gBoard[i][j].isMine) {
                renderBoard(gBoard);
                gGame.showCount = 0;
            }
            else {


                gTimer = setInterval(function () {
                    gGame.secsPassed++;
                    elSpeed = document.querySelector('h2 span');
                    elSpeed.innerText = gGame.secsPassed;
                }, 1000);
            }
        }
        if (ev.button === 0) leftClick(elCell, i, j)
        else if (ev.button === 2) cellMarked(elCell, i, j);
    }
}
function cellMarked(elCell, i, j) {
    window.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    }, false);
    // elCell.classList.toggle('selected');
    if (gBoard[i][j].isMarked === true && gBoard[i][j].isShow === true) {
        gBoard[i][j].isMarked = false;
        gBoard[i][j].isShow = false;
        gGame.showCount--;
        gGame.markedCount--;
        console.log(gBoard);
        showInBoard(i, j, ' ')

    } else {
        gBoard[i][j].isMarked = true;
        gBoard[i][j].isShow = true;
        gGame.markedCount++;
        showInBoard(i, j, FLAG)
    }

}
function leftClick(elcell, i, j) {
    gBoard[i][j].isShow = true;
    if (gBoard[i][j].isMarked === true) return
    if (gBoard[i][j].isMine === true) {
        gCountLive++;
        checkLive();
        showInBoard(i, j, MINE)
        // showAllMine();
        // gameOver();
    }
    else {
        if (gBoard[i][j].minesAroundCount === 0) expandShown(i, j);
        else showInBoard(i, j, gBoard[i][j].minesAroundCount)


    }
}
function showAllMine() {
    for (var i = 0; i < gMineLocations.length; i++) {
        var row = gMineLocations[i].i;
        var col = gMineLocations[i].j;
        if (gMineLocations.i === row && gMineLocations.j === col) continue;
        gBoard[row][col].isShow = true;
        // gGame.showCount++;
        showInBoard(row, col, MINE);


    }
}
function undo(elBtn) {
    if (gArrUndos.length === 0) return;
    i = gArrUndos.length - 1;
    gBoard[gArrUndos[i].i][gArrUndos[i].j].isShow = false;
    showInBoard(gArrUndos[i].i, gArrUndos[i].j, ' ');
    gArrUndos.pop();


}
function expandShown(cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            if (i === cellI && j === cellJ) {
                showInBoard(i, j, gBoard[i][j].minesAroundCount)
                continue;
            }
            if (gBoard[i][j].isMarked === true) continue;
            if (gBoard[i][j].isShow) continue;
            // update the model:
            gBoard[i][j].isShow = true;
            // if (gBoard[i][j].isShow) 
            gArrUndos.push({ i, j })
            // gGame.showCount++;

            // update the dom:
            showInBoard(i, j, gBoard[i][j].minesAroundCount)


        }

        console.log('count1:', gGame.showCount);
    }
    // expandShown(cellI-1,cellJ-1)
}
function expandShown2(cellI, cellJ) {
    //  if(gBoard[cellI][cellJ].isMine===true)return
    //if (cellI < 0 || cellI >= gBoard.length||cellJ < 0 || cellJ>= gBoard[i].length)break;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            if (gBoard[i][j].isMarked === true) continue;
            if (gBoard[i][j].isShow) continue;
            // update the model:

            // if (gBoard[i][j].isShow) 
            // gArrUndos.push({ i, j })
            // gGame.showCount++;
            // update the dom:
            showInBoard(i, j, gBoard[i][j].minesAroundCount)


        }

        console.log('count1:', gGame.showCount);
    }
    // expandShown(cellI-1,cellJ-1)
}
function expandHide(cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            if (gBoard[i][j].isMarked === true || gBoard[i][j].isShow === true) continue;
            if (i === cellI && j === cellJ) continue;
            //if (gBoard[i][j].isShow)gArrUndos.pop();

            // update the model:
            //gBoard[i][j].isShow = false;
            // update the dom:
            showInBoard(i, j, ' ')

        }
    }
    // expandShown(cellI-1,cellJ-1)
}
function gameOver() {
    gElBtnSmile.innerText = SMILE_LOSE;
    gGame.isOn = false;
    clearTimeout(gTimer);
}
function mediumLevel() {
    gLevel.size = 8;
    gLevel.mines = 12;
    initGame();
}
function beginLevel() {
    gLevel.size = 4;
    gLevel.mines = 2;
    initGame();
}
function expertLevel() {
    gLevel.size = 12;
    gLevel.mines = 30;
    initGame();
}
function restersGame() {
    var elH3Live = document.querySelector('.live')
    elH3Live.innerText = '❤️ ❤️ ❤️'
    // var elHins = document.querySelector('button.hins')
    // elHins.style.display = 'block'
    var elSafe = document.querySelector('.safe-click');
    elSafe .style.backgroundColor= 'lightblue';
    gMineLocations = [];
    gArrUndos = [];
    gCountSafe = 0;
    gCountLive = 0;
    initGame();


}
//console.log(checkGameOver());
function checkGameOver() {
    if (gGame.showCount !== gLevel.size ** 2) return false;
    for (var i = 0; i < gMineLocations.length; i++) {
        var mine = gMineLocations[i];
        console.log('mine', mine);
        if (!(gBoard[mine[i].i][mine[i].j].isMarked === true)) return false;

    }
    return true;
}
function emptyCell() {
    var emptyCells = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (!gBoard[i][j].isShow) {
                emptyCells.push({ i: i, j: j });
            }
        }

    }
    console.log('empty cells', emptyCells);
    return emptyCells

}
function safeClick(elBtn) {
    var emptyCells = emptyCell();
    gCountSafe++;
    if (gCountSafe <= 3) {
        var randomIdx = getRandomIntInclusive(0, emptyCells.length - 1)
        console.log('idx', randomIdx);
        showInBoard(emptyCells[randomIdx].i, emptyCells[randomIdx].j, gBoard[emptyCells[randomIdx].i][emptyCells[randomIdx].j].minesAroundCount)
        setTimeout(function () {
            showInBoard(emptyCells[randomIdx].i, emptyCells[randomIdx].j, ' ');
        }, 2000);


    }
    else elBtn.style.backgroundColor= 'grey';

}
function checkLive() {
    var elH3Live = document.querySelector('.live')
    switch (gCountLive) {
        case 1:
            elH3Live.innerText = '❤️❤️💔'
            break;
        case 2:
            elH3Live.innerText = '❤️💔💔'
            break;
        case 3:
            elH3Live.innerText = '💔💔💔'
            // showInBoard(i, j, MINE)
            showAllMine();
            gameOver();
            break;

        default:
            return null;
    }

}


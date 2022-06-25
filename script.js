const arr = new Array(8);
const mines = new Set();
const emptyCell = new Array();
let id = 1;
let flags = 11;

for (var i = 0; i < arr.length; i++) {
    arr[i] = [];
}

createTable();
setPositionOfMines();

function createTable() {
    updateFlags();
    document.getElementById('start').remove();
    for (let i = 0; i < 8; ++i) {
        let container = document.createElement('div');
        container.className = "input-group";
        document.getElementById('parent').appendChild(container);
        for (let j = 0; j < 8; ++j) {
            arr[i][j] = id;
            let cell = document.createElement('input');
            cell.type = "text";
            cell.className = "form-control";
            cell.id = id;
            cell.readOnly = true;
            cell.setAttribute("checked", false);
            cell.onclick = () => {checkMinesAround(i, j)}
            cell.addEventListener('contextmenu', e  => {
                e.preventDefault();
                addRemoveFlags(cell.id);
            });
            container.appendChild(cell);
            ++id;
        }
    }
}

function checkMinesAround(i, j) {
    if (mines.has(arr[i][j])) {
        revealMines();
        document.getElementById('message').innerText = 'You lost!';
        document.getElementById('flags').remove();
    } else {
        findEmptyCell(i, j);
    }
}

function findEmptyCell(i, j) {
    if (checkMines(i, j) > 0) {
        document.getElementById(arr[i][j]).style.background = "#BFBFBF";
        document.getElementById(arr[i][j]).value = checkMines(i, j);
        document.getElementById(arr[i][j]).setAttribute("checked", true);
    } else {
        add(i, j);
        checkForEmptyCell();
    }
    checkWinning();
}

function checkMines(i, j) {
    let numberOfMines = 0;
    for (let l = i - 1; l <= i + 1; ++l) {
        if (l >= 0 && l < 8) {
            for (let c = j - 1; c <= j + 1; ++c) {
                if (c >= 0 && c < 8) {
                    if (mines.has(arr[l][c])) {
                        ++numberOfMines;
                    }
                }
            }
        }
    }
    return numberOfMines;
}

function add(i, j) {
    for (let l = i - 1; l <= i + 1; ++l) {
        if (l >= 0 && l < 8) {
            for (let c = j - 1; c <= j + 1; ++c) {
                if (c >= 0 && c < 8) {
                    if (document.getElementById(arr[l][c]).getAttribute("checked") ==  "false") {
                        emptyCell.push(l, c);
                        document.getElementById(arr[l][c]).setAttribute("checked", true);
                    }
                }
            }
        }
    }
}

function checkForEmptyCell() {
    for (let m = 0; m < emptyCell.length; m += 2) {
        if (checkMines(emptyCell[m], emptyCell[m + 1]) > 0) {
            document.getElementById(arr[emptyCell[m]][emptyCell[m + 1]]).value = checkMines(emptyCell[m], emptyCell[m + 1]);
            document.getElementById(arr[emptyCell[m]][emptyCell[m + 1]]).style.background = "#BFBFBF";
        } else {
            add(emptyCell[m], emptyCell[m + 1]);
            document.getElementById(arr[emptyCell[m]][emptyCell[m + 1]]).style.background = "#BFBFBF";
        }
        checkWinning();
    }
}

function addRemoveFlags(id) {
    if (document.getElementById(id).value != '🚩') {
        document.getElementById(id).value = '🚩';
        document.getElementById(id).style.background = "#BFBFBF";
        document.getElementById(id).setAttribute("checked", true);
    } else {
        document.getElementById(id).value = '';
        document.getElementById(id).style.background = "#EEEEEE";
        document.getElementById(id).setAttribute("checked", false);
        flags += 2;
    }
    checkWinning();
    updateFlags();
}

function revealMines() {
    for (let i = 0; i < 8; ++i) {
        for (let j = 0; j < 8; ++j) {
            if (mines.has(arr[i][j])) {
                document.getElementById(arr[i][j]).value = "💣";
                document.getElementById(arr[i][j]).style.background = "red";
            }
        }
    }
}

function setPositionOfMines() {
    while (mines.size < 10) {
        let randomNumber = Math.floor(Math.random() * 64) + 1;
        mines.add(randomNumber);
    }
}

function updateFlags() {
    --flags;
    document.getElementById('flags').innerText = flags + '🚩';
}

function checkWinning() {
    let c = 0;
    for (let i = 1; i < id; ++i) {
        if (document.getElementById(i).getAttribute("checked") ==  "false") {
            c = 1;
        }
    }
    if (c == 0) {
        document.getElementById('flags').remove();
        document.getElementById('message').innerText = 'You win!';
    }
}
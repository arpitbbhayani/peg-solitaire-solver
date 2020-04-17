var canvasWidth = 450;
var canvasHeight = 450;

var sudokuOrigin = [0, 0]
var sudokuDim = [canvasHeight, canvasHeight]

var grid = [];
var solverGen = null;
var total_peg = 0

function possible(x, y, v) {
    for (var i = 0; i < 9; i++) {
        if (grid[x][i] === v) {
            return false;
        }
        if (grid[i][y] === v) {
            return false;
        }
    }
    var x0 = int(x/3)*3;
    var y0 = int(y/3)*3;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (grid[x0 + i][y0 + j] === v) {
                return false
            }
        }
    }
    return true
}

function* solver() {
    if (total_peg === 1) {
        return true
    }
    for (var i = 0; i < 7; i++) {
        for (var j = 0; j < 7; j++) {
            if (grid[i][j] === '•') {  // if current position can be taken
                const neighs = [[-1, 0], [1, 0], [0, -1], [0, 1]]
                const opp_neighs = [[1, 0], [-1, 0], [0, 1], [0, -1]]
                for (let k = 0; k < neighs.length; k++) {
                    const ni = i + neighs[k][0];
                    const nj = j + neighs[k][1];
                    const ti = i + opp_neighs[k][0];
                    const tj = j + opp_neighs[k][1];
                    if (
                        ni >= 0 && ni < 7 && nj >= 0 && nj < 7 &&
                        ti >= 0 && ti < 7 && tj >= 0 && tj < 7 &&
                        grid[ni][nj] === '-' && grid[ti][tj] === '•') {
                            grid[i][j] = '-'
                            grid[ti][tj] = '-'
                            grid[ni][nj] = '•'
                            total_peg -= 1
                            // console.log('taking', i, j, total_peg)
                            yield
                            if (yield* solver()) {
                                return true
                            } else {
                                // console.log('restoring', i, j, total_peg)
                                grid[i][j] = '•'
                                grid[ti][tj] = '•'
                                grid[ni][nj] = '-'
                                total_peg += 1
                                yield
                            }
                    }
                }
            }
        }
    }
    return total_peg === 1
}

function setup() {
    solverGen = null
    grid = [
        [' ', ' ', '•', '•', '•', ' ', ' '],
        [' ', ' ', '•', '•', '•', ' ', ' '],
        ['•', '•', '•', '•', '•', '•', '•'],
        ['•', '•', '•', '-', '•', '•', '•'],
        ['•', '•', '•', '•', '•', '•', '•'],
        [' ', ' ', '•', '•', '•', ' ', ' '],
        [' ', ' ', '•', '•', '•', ' ', ' '],
    ]
    createCanvas(canvasWidth, canvasHeight);
    background(255);
    for (var i = 0; i < grid.length ; i ++) {
        for(var j = 0 ; j < grid[i].length; j++) {
            total_peg += grid[i][j] === '•'
        }
    }
    solverGen = solver()
    // frameRate(2)
}

function _drawLines() {
}

function _drawValues() {
    textFont("monospace")
    textSize(canvasHeight/15);
    for (var i = 0; i < 7; i ++) {
        for (var j = 0 ; j < 7; j++) {
            if (grid[i][j] !== 0) {
                fill('#000');
                stroke('#000');
                text(grid[i][j], sudokuOrigin[0] + j * sudokuDim[0]/9 + (sudokuDim[0]/9)/2 - 32/4, sudokuOrigin[1] + i * sudokuDim[0]/9 + (sudokuDim[0]/9)/2 + 32/4);
            }
        }
    }
}

function _drawBoard() {
    background('#fff')
    _drawLines()
    _drawValues()
}

function draw() {
    _drawBoard()
    x = solverGen.next()
    if (x.done) {
        noLoop()
    }
}

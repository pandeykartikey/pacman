var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

function draw_pacman(){
scale_pacman = 1;
ctx.beginPath();
ctx.arc(pacman.x, pacman.y, 50*scale_pacman, 0.25 * Math.PI, 1.25 * Math.PI, false);
ctx.fillStyle = "rgb(255, 255, 0)";
ctx.fill();
ctx.beginPath();
ctx.arc(pacman.x, pacman.y, 50*scale_pacman, 0.75 * Math.PI, 1.75 * Math.PI, false);
ctx.fill();
ctx.beginPath();
ctx.arc(pacman.x, pacman.y - 50*0.5*scale_pacman , 10*scale_pacman, 0, 2 * Math.PI, false);
ctx.fillStyle = "rgb(0, 0, 0)";
ctx.fill();
}
x=0,y=0
var pacman = {
	speed: 256, // movement in pixels per second
	x: 0,
	y: 0
};
var monster = {
	x: 0,
	y: 0
};
var monstersCaught = 0;

var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;	
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		pacman.y -= 30;			
	}
	if (40 in keysDown) { // Player holding down
		pacman.y += 30;			
	}
	if (37 in keysDown) { // Player holding left
		pacman.x -= 30;			
	}
	if (39 in keysDown) { // Player holding right
		pacman.x += 30;			
	}

	// Are they touching?
	if (
		pacman.x <= (monster.x + 32)
		&& monster.x <= (pacman.x + 32)
		&& pacman.y <= (monster.y + 32)
		&& monster.y <= (pacman.y + 32)
	) {
		++monstersCaught;
		//reset();
	}
};
var render = function () {

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = 'green';
	ctx.fillRect(0,0,600,480);
	draw_pacman();
};
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	requestAnimationFrame(main);
};
var then = Date.now();
main();



//Copied


// ----------------
// Canvas variables
// ----------------

// --------------
// Maze variables
// --------------

var maze, m, n;
var start, end;

// ----------------------
// Maze drawing variables
// ----------------------

var cellWidth;
var cellHeight;

var playerWidth;
var playerHeight;

// --------------
// Menu variables
// --------------

// Main menu box dimensions and positions
var diffBoxWidth, diffBoxHeight;
var easyTopLeftX, easyTopLeftY;
var mediumTopLeftX, mediumTopLeftY;
var hardTopLeftX, hardTopLeftY;

// In-game menu box dimensions and positions
var menuBoxWidth, menuBoxHeight;
var menuContTopLeftX, menuContTopLeftY;
var menuRestartTopLeftX, menuRestartTopLeftY;
var menuQuitTopLeftX, menuQuitTopLeftY;

// --------------
// Game variables
// --------------

var playerPosX, playerPosY;

var timeLeft;
var timerInterval;
var hasStarted, hasWon, hasLost;

var INITIAL_TIME = 20;
var TIME_BOOST = 5;

// -------------
// Collectible variables
// -------------

var solutionCounter, solutionTotal;
var randomCounter, randomTotal;

// Radius of circles representing collectibles
var circleRad;

function initialiseMaze() {
    // Initialise the m by n maze with all walls up

    // Set all cells to zero
    for (var i = 0; i < m; i++) {
        for (var j = 0; j < n; j++) {
            maze[i][j] = 0;
        }
    }

    // Inside maze cells
    for (var i = 1; i < m - 1; i++) {
        for (var j = 1; j < n - 1; j++) {
            maze[i][j] |= 15;
        }
    }

    // The top and bottom border cells
    for (var i = 1; i < m - 1; i++) {
        maze[i][0] |= 7;
        maze[i][n - 1] |= 13;
    }

    // The left and right border cells
    for (var i = 1; i < n - 1; i++) {
        maze[0][i] |= 14;
        maze[m - 1][i] |= 11;
    }

    // The corner cells
    maze[0][0] |= 6;  // Top-left corner

    maze[m - 1][0] |= 3;  // Top right corner

    maze[0][n - 1] |= 12;  // Bottom left corner

    maze[m - 1][n - 1] |= 9;  // Bottom right corner

    return maze;
}

function getRandomInt(min, max) {
    // Return a random integer between `min` and `max`, as per MDN docs

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomCell() {
    // Get a random cell in the maze

    return [getRandomInt(0, m - 1), getRandomInt(0, n - 1)];
}
function getNeighbours(visitedArray, cell) {
    // Get all unvisited neighbours of `cell` in `maze` as byte

    var validNeighbours = 0;

    // Check left
    if ((cell[0] != 0) && (!visitedArray[cell[0] - 1][cell[1]])) {
        validNeighbours |= 1;
    }

    // Check below
    if ((cell[1] != n - 1) && (!visitedArray[cell[0]][cell[1] + 1])) {
        validNeighbours |= 2;
    }

    // Check right
    if ((cell[0] != m - 1) && (!visitedArray[cell[0] + 1][cell[1]])) {
        validNeighbours |= 4;
    }

    // Check above
    if ((cell[1] != 0) && (!visitedArray[cell[0]][cell[1] - 1])) {
        validNeighbours |= 8;
    }

    return validNeighbours;
}
function getRandomFlag(num) {
    // Choose a random set flag from a 4-bit number

    // Prevent infinite loop from incorrect argument
    if (num === 0) {
        console.log("Error: Cannot choose random set flag.");
        return false;
    }

    var rand, res;

    do {
        rand = Math.pow(2, getRandomInt(0, 4));
        res = num & rand;
    } while (res === 0);

    return res;
}

function knockDownWall(cell, wall) {
    // Knock down the wall between cellOne and cellTwo

    var wallmask;

    switch (wall) {
        case "top":
            wallmask = 8;
            break;
        case "right":
            wallmask = 4;
            break;
        case "bottom":
            wallmask = 2;
            break;
        case "left":
            wallmask = 1;
            break;
        default:
            console.log("Error: Invalid wall to destroy.");
            return false;
    }

    maze[cell[0]][cell[1]] &= ~wallmask;
}

function buildMaze() {
    // Construct a perfect maze in `maze` that is m by n

    var cellStack, totalCells, currentCell, visitedCells, newCell;
    var visitedArray, validNeighbours, neighbour;

    // Stack to hold the cell locations
    cellStack = new Array();

    totalCells = m * n;

    // Array containing whether each cell has been visited
    visitedArray = createArray(m, n);

    currentCell = getRandomCell();

    visitedCells = 1;

    while (visitedCells < totalCells) {
        // Set this cell as visited
        visitedArray[currentCell[0]][currentCell[1]] = 1;

        // Get byte describing which neighbours haven't been visited
        validNeighbours = getNeighbours(visitedArray, currentCell);

        if (validNeighbours === 0) {
            currentCell = cellStack.pop();
        }
        else {
            // Choose one valid neighbour at random
            neighbour = getRandomFlag(validNeighbours);
            switch (neighbour) {
                case 1:  // Left of original cell
                    newCell = [currentCell[0] - 1, currentCell[1]];
                    knockDownWall(currentCell, "left");
                    knockDownWall(newCell, "right");
                    break;
                case 2:  // Below original cell
                    newCell = [currentCell[0], currentCell[1] + 1];
                    knockDownWall(currentCell, "bottom");
                    knockDownWall(newCell, "top");
                    break;
                case 4:  // Right of original cell
                    newCell = [currentCell[0] + 1, currentCell[1]];
                    knockDownWall(currentCell, "right");
                    knockDownWall(newCell, "left");
                    break;
                case 8:  // Above original cell
                    newCell = [currentCell[0], currentCell[1] - 1];
                    knockDownWall(currentCell, "top");
                    knockDownWall(newCell, "bottom");
                    break;
                default:
                    console.log("Error: Invalid choice of neighbour.");
                    return false;
            }

            cellStack.push(currentCell);
            currentCell = newCell;
            visitedCells++;
        }

    }
}
function unsetWalledNeighbours(neighbours, cell) {
    // Unset all flags in byte `neighbours` where there's a wall between `cell`
    // and that neighbour

    var cellval = maze[cell[0]][cell[1]];

    // Bits representing left, bottom, right and top walls respectively
    var wallmasks = [1, 2, 4, 8];

    // Check if cell has walls and unset corresponding neighbour bit
    wallmasks.forEach(function(mask) {
        if (cellval & mask) {
            neighbours &= ~mask;
        }
    });

    return neighbours;
}
function placeSolutionCounters() {
    // Marks the solution to the maze using similar method to construction

    var cellStack, currentCell, visitedCells, newCell;
    var visitedArray, unvisitedNeighbours, validNeighbours, neighbour;

    // Stack to hold the cell locations
    cellStack = new Array();

    // Array containing whether each cell has been visited
    visitedArray = createArray(m, n);

    currentCell = start;

    while (!(currentCell[0] === end[0] && currentCell[1] === end[1])) {
        // Set this cell as visited
        visitedArray[currentCell[0]][currentCell[1]] = 1;

        // Get byte describing which neighbours haven't been visited
        unvisitedNeighbours = getNeighbours(visitedArray, currentCell);

        // Here we also require no intervening wall
        validNeighbours = unsetWalledNeighbours(unvisitedNeighbours,
                                                currentCell);

        if (validNeighbours === 0) {
            currentCell = cellStack.pop();
        }
        else {
            // Choose one valid neighbour at random
            neighbour = getRandomFlag(validNeighbours);
            switch (neighbour) {
                case 1:  // Left of original cell
                    newCell = [currentCell[0] - 1, currentCell[1]];
                    break;
                case 2:  // Below original cell
                    newCell = [currentCell[0], currentCell[1] + 1];
                    break;
                case 4:  // Right of original cell
                    newCell = [currentCell[0] + 1, currentCell[1]];
                    break;
                case 8:  // Above original cell
                    newCell = [currentCell[0], currentCell[1] - 1];
                    break;
                default:
                    console.log("Error: Invalid choice of neighbour.");
                    return false;
            }

            cellStack.push(currentCell);
            currentCell = newCell;
        }
    }

    // Remove the first element, starting point, which is special
    cellStack.splice(0, 1);

    // Reset solution total in case of game restart
    solutionTotal = 0;

    // Mark all cells in the stack as solution
    for (var i = 0; i < cellStack.length; i += 2) {
        solutionTotal++;
        maze[cellStack[i][0]][cellStack[i][1]] |= 16;
    }
}

function placeRandomCounters() {
    // Place random counters that the players needs to pick up throughout the
    // maze

    // One fifth as many random counters to pick up as solution counters
    randomTotal = Math.ceil(solutionTotal / 5);

    var i = 0, cell;
    while (i < randomTotal) {
        cell = getRandomCell();

        if (validRandomCounterCell(cell)) {
            maze[cell[0]][cell[1]] |= 32;
            i++;
        }
    }
}
function unblurMaze() {
    // Remove the blur on the maze

    mazeCanvas.style.filter = mazeCanvas.style.webkitFilter = "blur(0px)";
}

function drawAll(x, y) {
    // Redraws the whole maze, the controls and the player at position `x`, `y`

    clearCanvas();

    drawMaze();
    drawPlayer(x, y);
    drawPauseButton();

    if (touchCapable) {
        drawTouchControls();
    }

    if (!hasStarted) {
        drawStartMessage();
    }

    if (hasWon) {
        drawWinMessage();
    }

    if (hasLost) {
        drawLostMessage();
    }
}
function initialiseGame(difficulty) {
    // Reset, build and solve maze, then draw all elements and set listeners

    m=10;
    n=10;
 maze = createArray(m, n);
    start= [0, 0];
    end = [m - 1, n - 1];
    cellWidth = canvas.width / m;
    cellHeight = canvas.height / n;
    playerWidth = 0.85 * cellWidth;
    playerHeight = 0.85 * cellHeight;
    circleRad = cellWidth >= cellHeight ? 0.2 * cellHeight : 0.2 * cellWidth;

    // Reset game variables
    playerPosX = playerPosY = 0;
    hasStarted = hasWon = hasLost = false;
    solutionCounter = solutionTotal = 0;
    randomCounter = randomTotal = 0;
    timeLeft = INITIAL_TIME;

    initialiseMaze();
    buildMaze();
    placeSolutionCounters();
    placeRandomCounters();

    // Make sure the maze is unblurred
    unblurMaze();

    drawAll(start[0], start[1]);

    // Movement event listeners
    window.addEventListener("keydown", movePlayerKeyboard, false);
    window.addEventListener("touchstart", movePlayerTouch, false);

    // In-game menu event listeners
    window.addEventListener("keydown", checkEscape, false);
    window.addEventListener("click", checkPauseClick, false);
    window.addEventListener("touchstart", checkPauseTouch, false);

    // Canvas resize event listener
window.addEventListener("resize", resizeMaze, false);
}
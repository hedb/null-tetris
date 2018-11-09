var COLS = 10, ROWS = 20;
var board = [];
var lose;
var interval;
var tickDuration = 400;
var tickCounter = 1;
var intervalRender;
var current; // current moving letter
var currentX, currentY; // position of current shape
var freezed; // is current shape settled on the board?
var colors = [
    'cyan', 'orange', 'blue', 'blue'
];
var letters = [
    'N', 'U', 'L', 'L'
];

WordLength = letters.length 

function newShape() {
    var id = Math.floor( Math.random() * letters.length );
    
    current = letters[id];
    
    // new shape starts to move
    freezed = false;
    // position where the shape will evolve
    currentX = Math.floor( Math.random() * COLS );;
    currentY = 0;
}

// clears the board
function init() {
    for ( var y = 0; y < ROWS; ++y ) {
        board[ y ] = [];
        for ( var x = 0; x < COLS; ++x ) {
            board[ y ][ x ] = 0;
        }
    }
}

var isExploding = false

function explodeBoardStart(currentX,currentY,nullCoordinates) {
    isExploding = true
    clearInterval( interval );
    renderStartExplosion(nullCoordinates)
    setTimeout(explodeBoardEnd,2000)
}

function explodeBoardEnd(currentX,currentY) {
    isExploding = false
    renderEndExplosion()
    newGame()
}

// keep the element moving down, creating new shapes and clearing lines
function tick(triggerNewTick) {
    
    if ( valid( 0, 1 ) ) {
        ++currentY;
    }
    // if the element settled
    else {
        freeze();
        valid(0, 1);
        nullCoordinates = []
        if (checkForNulls(currentX,currentY,nullCoordinates)) {
            explodeBoardStart(currentX,currentY,nullCoordinates)
        }
        if (lose) {
            clearAllIntervals();
            return false;
        }
        newShape();
    }

    if (typeof triggerNewTick == 'undefined' || triggerNewTick) {
        
        // debug
        // tickDuration = 1000 
        // prod
        tickDuration = Math.cos(tickCounter/20)*100+ Math.max(0,200-tickCounter) + 100 
        
        interval = setTimeout(tick, tickDuration );
        tickCounter ++;
    }

}

// stop shape at its position and fix it to board
function freeze() {
    if ( current ) {
        board[ currentY ][ currentX ] = current;
    }
    freezed = true;
}

function up( current ) {
    return current;
}



function checkForNulls(changedX,changedY,nullCoordinates) {
    var isNullOnTheBoard = false;
    //LTR
    for (var offset = -1*WordLength + 1; offset <= 0 && !isNullOnTheBoard ;offset ++) {
        if (
            ( typeof board[changedY][changedX + offset] != 'undefined' ) && 
            ( typeof board[changedY][changedX + offset + WordLength - 1 ] != 'undefined' )
         ) {
            isNullOnTheBoard = true
            for (var i = 0;i<letters.length && isNullOnTheBoard ;i++) {
                nullCoordinates.push([changedY,changedX + offset + i])
                if (letters[i] != board[changedY][changedX + offset + i]) {
                    nullCoordinates.length = 0
                    isNullOnTheBoard = false
                }
            }
         }
    }
    //RTL
    for (var offset = -1*WordLength + 1; offset <= 0 && !isNullOnTheBoard ;offset ++) {
        if (
            ( typeof board[changedY][changedX - offset] != 'undefined' ) && 
            ( typeof board[changedY][changedX - (offset + WordLength - 1) ] != 'undefined' )
         ) {
            isNullOnTheBoard = true
            for (var i = 0;i<letters.length && isNullOnTheBoard ;i++) {
                nullCoordinates.push([changedY,changedX - (offset + i)])
                if (letters[i] != board[changedY][changedX - (offset + i)]) {
                    nullCoordinates.length = 0
                    isNullOnTheBoard = false
                }
            }
         }
    }
    //UTD
    for (var offset = -1*WordLength + 1; offset <= 0 && !isNullOnTheBoard ;offset ++) {
        if (
            ( typeof board[changedY + offset] != 'undefined' ) && 
            ( typeof board[changedY + offset][changedX] != 'undefined' ) && 
            ( typeof board[changedY + offset + WordLength - 1 ] != 'undefined' ) &&
            ( typeof board[changedY + offset + WordLength - 1 ][changedX] != 'undefined' )
         ) {
            isNullOnTheBoard = true
            for (var i = 0;i<letters.length && isNullOnTheBoard ;i++) {
                nullCoordinates.push([changedY + offset + i,changedX])
                if (letters[i] != board[changedY + offset + i][changedX]) {
                    nullCoordinates.length = 0
                    isNullOnTheBoard = false
                }
            }
         }
    }
    //DTU
    for (var offset = -1*WordLength + 1; offset <= 0 && !isNullOnTheBoard ;offset ++) {
        if (
            ( typeof board[changedY - offset] != 'undefined' ) && 
            ( typeof board[changedY - offset][changedX] != 'undefined' ) && 
            ( typeof board[changedY - (offset + WordLength - 1) ] != 'undefined' ) &&
            ( typeof board[changedY - (offset + WordLength - 1) ][changedX] != 'undefined' )
         ) {
            isNullOnTheBoard = true
            for (var i = 0;i<letters.length && isNullOnTheBoard ;i++) {
                nullCoordinates.push([changedY - (offset + i),changedX])
                if (letters[i] != board[changedY - (offset + i)][changedX]) {
                    nullCoordinates.length = 0
                    isNullOnTheBoard = false
                }
            }
         }
    }
    return isNullOnTheBoard
}


function keyPress( key ) {
    if (isExploding) return 

    switch ( key ) {
        case 'left':
            if ( valid( -1 ) ) {
                --currentX;
            }
            break;
        case 'right':
            if ( valid( 1 ) ) {
                ++currentX;
            }
            break;
        case 'down':
            if ( valid( 0, 1 ) ) {
                ++currentY;
            }
            break;
        case 'up':
            break;
        case 'drop':
            while( valid(0, 1) ) {
                ++currentY;
            }
            tick(false);
            break;
    }
}

// checks if the resulting position of current shape will be feasible
function valid( offsetX, offsetY, newCurrent ) {
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    offsetX = currentX + offsetX;
    offsetY = currentY + offsetY;
    newCurrent = newCurrent || current;

    var x = 0
    var y = 0
    if ( newCurrent ) {
        if ( typeof board[ y + offsetY ] == 'undefined'
            || typeof board[ y + offsetY ][ x + offsetX ] == 'undefined'
            || board[ y + offsetY ][ x + offsetX ]
            || x + offsetX < 0
            || y + offsetY >= ROWS
            || x + offsetX >= COLS ) {
            if (offsetY == 1 && freezed) {
                lose = true; // lose if the current shape is settled at the top most row
                document.getElementById('playbutton').disabled = false;
            } 
            return false;
        }
    }
    return true;
}

function playButtonClicked() {
    newGame();
    document.getElementById("playbutton").disabled = true;
}

function newGame() {
    clearAllIntervals();
    intervalRender = setInterval( render, 30 );
    init();
    newShape();
    lose = false;
    interval = setTimeout(tick, tickDuration );
}

function clearAllIntervals(){
    clearInterval( interval );
    clearInterval( intervalRender );
}
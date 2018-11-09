var canvas = document.getElementsByTagName( 'canvas' )[ 0 ];
var ctx = canvas.getContext( '2d' );
ctx.font = "30px Arial";
var W = 300, H = 600;
var BLOCK_W = W / COLS, BLOCK_H = H / ROWS;

exploding_letters = null
explosionPixelSize = 0

// draw a single square at (x, y)
function drawLetter( x, y , letter) {
    ctx.fillText(letter,x,y);
}

// draws the board and the moving shape
function render() {
    ctx.clearRect( 0, 0, W, H );

    ctx.strokeStyle = 'black';
    for ( var x = 0; x < COLS; ++x ) {
        for ( var y = 0; y < ROWS; ++y ) {
            if ( board[ y ][ x ] ) {
                ctx.fillStyle = colors[ board[ y ][ x ] - 1 ];
                drawLetter( x*BLOCK_W, y*BLOCK_H ,board[ y ][ x ]);
            }
        }
    }

    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'black';
    ctx.fillStyle = colors[ current - 1 ];
    drawLetter( currentX*BLOCK_W, currentY*BLOCK_H , current);
    
    if (exploding_letters) {
        render_exploding_letters()
    }
}

function renderStartExplosion(exploding_letters1) {
    exploding_letters = exploding_letters1
}

function renderEndExplosion() {
    exploding_letters = null
    explosionPixelSize = 0
}

function render_exploding_letters() {
    defaultFont = ctx.font
    ctx.font =  (30 + explosionPixelSize ) +"px Arial";
    explosionPixelSize += 2

    // middleWord = [ 
    //     (exploding_letters[0][1] + exploding_letters[3][1] )  / 2 ,  
    //     (exploding_letters[0][0] + exploding_letters[3][0] )  / 2 ,  
    // ]

    tmp_BLOCK_W = BLOCK_W //+ explosionPixelSize; 
    tmp_BLOCK_H = BLOCK_H //+ explosionPixelSize; 

    for (var i=0; i<exploding_letters.length ;i++) {
        drawLetter(exploding_letters[i][1] *tmp_BLOCK_W , exploding_letters[i][0] *tmp_BLOCK_H ,  
            board[ exploding_letters[i][0] ][ exploding_letters[i][1] ]  )
    }
    ctx.font = defaultFont 
}
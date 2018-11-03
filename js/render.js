var canvas = document.getElementsByTagName( 'canvas' )[ 0 ];
var ctx = canvas.getContext( '2d' );
ctx.font = "30px Arial";
var W = 300, H = 600;
var BLOCK_W = W / COLS, BLOCK_H = H / ROWS;

// draw a single square at (x, y)
function drawLetter( x, y , letter) {
    ctx.fillText(letter,x*BLOCK_W,y*BLOCK_H);

}

// draws the board and the moving shape
function render() {
    ctx.clearRect( 0, 0, W, H );

    ctx.strokeStyle = 'black';
    for ( var x = 0; x < COLS; ++x ) {
        for ( var y = 0; y < ROWS; ++y ) {
            if ( board[ y ][ x ] ) {
                ctx.fillStyle = colors[ board[ y ][ x ] - 1 ];
                drawLetter( x, y ,board[ y ][ x ]);
            }
        }
    }

    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'black';
    ctx.fillStyle = colors[ current - 1 ];
    drawLetter( currentX, currentY , current);   
}
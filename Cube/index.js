"use strict";

var canvas;
var gl;

// DEKLARACIJA POTREBNIH VARIJABLI

var NumVertices = 36;

var points = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;


var axis = 0; 

// ODREDITI KUTOVE 
var theta = [ 0, 10, -100 ]; 

var thetaLoc;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorCube();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );


    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta");

    document.getElementById("xButton").onclick = function(){
        axis = xAxis;
    };
    document.getElementById("yButton").onclick = function(){
        axis = yAxis;
    };
    document.getElementById("zButton").onclick = function(){
        axis = zAxis;
    };

    render();
}

function colorCube()
{
	// DEFINIRATI STRANE
    quad( 1, 0, 3, 2 ); // prednja
    quad( 2, 3, 7, 6 ); //desna
    quad( 3, 7, 4, 0 ); // donja
    quad( 6, 5, 1, 2 ); // gornja
    quad( 4, 7, 6, 5 ); // straznja
    quad( 5, 1, 0, 4 ) //lijeva
}

// PARAMETRI FUNKCIJE quad()
function quad( a, b, c, d )
{
	// DEFINIRATI VRHOVE 
    var vertices = [
        vec4( -0.5, -0.5, 0.5, 1.0 ),
        vec4(  -0.5, 0.5, 0.5, 1.0 ),
        vec4(  0.5, 0.5, 0.5, 1.0 ),
        vec4( 0.5, -0.5, 0.5, 1.0 ), // do tud 4 plohe
        /* -------------------------- */
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4(  -0.5, 0.5, -0.5, 1.0 ),
        vec4(  0.5, 0.5, -0.5, 1.0 ),
        vec4( 0.5, -0.5, -0.5, 1.0 ) // translacija oko osi
    ];
	
	// DEFINIRATI BOJE 
    var vertexColors = [	
        vec4( 0.0, 0.0, 0.0, 1.0 ), // crna
        vec4( 0.0, 1.0, 0.0, 1.0 ), // zelena
        vec4( 0.0, 0.0, 1.0, 1.0 ), // plava
        vec4( 1.0, 0.0, 1.0, 1.0 ), // magenta
        vec4( 0.0, 1.0, 0.0, 1.0 ), // zelena
        vec4( 0.0, 0.0, 1.0, 1.0 ), // plava
        vec4( 1.0, 0.0, 1.0, 1.0 ), // magenta
        vec4( 1.0, 1.0, 1.0, 1.0 ) // bijela
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex

    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );


        // for solid colored faces use
        colors.push(vertexColors[a]);

    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta[axis] += 0.5; 
    gl.uniform3fv(thetaLoc, theta);

    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    requestAnimFrame( render );
}

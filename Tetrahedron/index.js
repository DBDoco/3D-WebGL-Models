"use strict";

var canvas;
var gl;

// DEKLARACIJA POTREBNIH VARIJABLI

var NumVertices = 12;

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

    colorTetraedar();

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

function colorTetraedar()
{
	// DEFINIRATI STRANE
    triangle( 0, 1, 2 ); // donja
    triangle( 0, 2, 3 ); // lijeva
    triangle( 1, 3, 2 ); // desno
    triangle( 0, 1, 3 ); // ispred
}

// PARAMETRI FUNKCIJE quad()
function triangle( a, b, c )
{
	// pravilni tetraedar 
    var vertices = [
        vec4( 0.94, 0.0, -0.33, 1.0 ),
        vec4( -0.47, 0.81, -0.33, 1.0 ),
        vec4( -0.47, -0.81, -0.33, 1.0 ),
        vec4( 0.0, 0.0, 1.0, 1.0 )
    ];

    // iglasti tetraedar
    var vertices = [
        vec4( 0.54, 0.0, -0.33, 1.0 ),
        vec4( -0.07, 0.41, -0.33, 1.0 ),
        vec4( -0.07, -0.41, -0.33, 1.0 ),
        vec4( 0.0, 0.0, 1.0, 1.0 )
    ];
	
	// DEFINIRATI BOJE 
    var vertexColors = [
        vec4( 0.0, 0.0, 0.0, 0.6 ), // siva	
        vec4( 1.0, 0.0, 1.0, 1.0 ), // magenta
        vec4( 0.0, 1.0, 1.0, 1.0 ), // cijanoplava
        vec4( 1.0, 1.0, 0.0, 1.0 ) // zuta
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex

    var indices = [ a, b, c ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        // za boje dobivene interpolacijom
        colors.push( vertexColors[indices[i]] );

        // za soline boje
        //colors.push(vertexColors[a+b+c-3]);
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

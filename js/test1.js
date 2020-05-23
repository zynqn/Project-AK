
var images = ["sea", "avo", "land"]
var imNum = 0;
onclick = ()=>{
    imNum ++;
    imNum = imNum%images.length;
    document.body.innerHTML = "";
    init()
}

ini():
async function init() {
    var img = new Image();
    img.src = images[imNum] + ".jpg";
    await new Promise( r=> img.onload = r);

    var depth = new Image();
    depth.src = images[imNum] + "depth.jpg";
    await new Promise( r=> depth.onload = r);

    var canvas = document.createElement("canvas");

    var gl = canvas.getContext("webgl");

    document.body.appendChild(canvas);

    var vertices = [-1, -1, -1, 1, 1, -1, 1, 1]

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.vertexAttribPointer(0,2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    var vshader = `
    attribute vec2 pos;
    varying vec2 vpos;
    void main(){
        vpos = pos*-0.5 + vec2(0.5);
        gl_Position = vec4(pos, 0.0, 1.0);
    }
    `
    var vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vshader);
    gl.compileShader(vs);

    var fshader = `
    precision highp float;
    varying vec2 vpos;
    void main (){
        gl_FragColor = vec4(vpos, 1.0, 1.0);
    }`

var fs = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fs, fshader);
gl.compileShader(fs);

var program = gl.createProgram();
gl.attachShader(program, fs);
gl.attachShader(program, vs);
gl.linkProgram(program);
gl.useProgram(program);


function setTexture(im,name, num) {
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + num);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);

}
    loop();

    function loop() {
        gl.clearColor(0.25, 0.65, 1, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
        
        requestAnimationFrame(loop);

    }
}
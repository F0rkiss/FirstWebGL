let gl, shaderProgram, currentColor;

window.onload = function() {
    const canvas = document.getElementById('glCanvas');
    resizeCanvas(canvas);

    gl = canvas.getContext('webgl');
    if (!gl) {
        alert('Unable to initialize WebGL. Your browser may not support it.');
        return;
    }

    // Set default color to white
    currentColor = [1.0, 1.0, 1.0, 1.0];  // Default is white

    // Initialize shaders and buffers
    initShaders();
    initBuffers();
    drawScene();

    // Listen for window resize
    window.addEventListener('resize', () => resizeCanvas(canvas));

    // Attach button event listeners for color changes
    document.getElementById('Maroon').addEventListener('click', () => setColor(0.5, 0.0, 0.0));   // Maroon
    document.getElementById('Tosca').addEventListener('click', () => setColor(0.29, 0.69, 0.61)); // Tosca
    document.getElementById('Pastel').addEventListener('click', () => setColor(1.0, 0.87, 0.82));   // Pastel
    document.getElementById('reset').addEventListener('click', resetColor);  // Reset to white
};

// Resize canvas
function resizeCanvas(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (gl) {
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
}

function initShaders() {
    const vsSource = `
        attribute vec4 aVertexPosition;
        void main() {
            gl_Position = aVertexPosition;
        }
    `;

    const fsSource = `
        precision mediump float;
        uniform vec4 uColor;
        void main() {
            gl_FragColor = uColor;
        }
    `;

    shaderProgram = initShaderProgram(vsSource, fsSource);

    gl.useProgram(shaderProgram);

    // Get the uniform location for color
    shaderProgram.uColor = gl.getUniformLocation(shaderProgram, 'uColor');
}

function initBuffers() {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
        -0.7,  0.5,
        0.7,  0.5,
        -0.7, -0.5,
        0.7, -0.5,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosition);
}

function drawScene() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform4fv(shaderProgram.uColor, currentColor);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function setColor(r, g, b) {
    currentColor = [r, g, b, 1.0];
    drawScene();
}

function resetColor() {
    currentColor = [1.0, 1.0, 1.0, 1.0];  // Default to white
    drawScene();
}

function initShaderProgram(vsSource, fsSource) {
    const vertexShader = loadShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fsSource);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
        return null;
    }

    return program;
}

function loadShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

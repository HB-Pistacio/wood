const canvas = document.getElementById('wood-root') as HTMLCanvasElement | null;
if (canvas === null) throw Error('No wood root!');

const gl = canvas.getContext('webgl');
if (gl === null) throw Error('No WebGL!');

function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio;
  const { width, height } = canvas.getBoundingClientRect();
  const displayWidth = Math.round(width * dpr);
  const displayHeight = Math.round(height * dpr);

  const needResize =
    canvas.width !== displayWidth || canvas.height !== displayHeight;
  if (needResize) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }

  return needResize;
}

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (shader === null) throw Error('Failed to create shader!');

  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) === true) return shader;

  // Throw error when compile status wasn't ok
  const info = gl.getShaderInfoLog(shader);
  gl.deleteShader(shader);
  throw new Error(info ?? 'Shader failed to compile!');
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
) {
  const program = gl.createProgram();
  if (program === null) throw Error('Failed to create shader program!');
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (gl.getProgramParameter(program, gl.LINK_STATUS) === true) return program;

  // Throw error when compile status wasn't ok
  const info = gl.getProgramInfoLog(program);
  gl.deleteProgram(program);
  throw info;
}

const vertexShaderSource = `
  attribute vec4 a_position;

  void main() {
    gl_Position = a_position;
  }
`;

const fragmentShaderSource = `
  precision mediump float;
 
  void main() {
    gl_FragColor = vec4(1, 0, 0.5, 1);
  }
`;

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(
  gl,
  gl.FRAGMENT_SHADER,
  fragmentShaderSource,
);

const program = createProgram(gl, vertexShader, fragmentShader);
const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');

const positionBuffer = gl.createBuffer();
if (positionBuffer === null) throw new Error('Failed to create buffer!');

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

const positions = [0, 0, 0, 0.5, 0.7, 0];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// RENDERING CODE
resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// clear canvas
gl.clearColor(1, 1, 1, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.useProgram(program);
gl.enableVertexAttribArray(positionAttributeLocation);

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
gl.drawArrays(gl.TRIANGLES, 0, 3);

export {};

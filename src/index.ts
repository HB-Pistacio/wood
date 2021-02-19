const canvas = document.getElementById("wood-root") as HTMLCanvasElement | null;
if (canvas === null) throw Error("No wood root!");

const gl = canvas.getContext("webgl2");
if (gl === null) throw Error("No WebGL!");

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
  if (shader === null) throw Error("Failed to create shader!");

  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) === true) return shader;

  // Throw error when compile status wasn't ok
  const info = gl.getShaderInfoLog(shader);
  gl.deleteShader(shader);
  throw new Error(info ?? "Shader failed to compile!");
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) {
  const program = gl.createProgram();
  if (program === null) throw Error("Failed to create shader program!");
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (gl.getProgramParameter(program, gl.LINK_STATUS) === true) return program;

  // Throw error when compile status wasn't ok
  const info = gl.getProgramInfoLog(program);
  gl.deleteProgram(program);
  throw info;
}

function setGeometry(gl: WebGLRenderingContext) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      // left column
      0,
      0,
      30,
      0,
      0,
      150,
      0,
      150,
      30,
      0,
      30,
      150,

      // top rung
      30,
      0,
      100,
      0,
      30,
      30,
      30,
      30,
      100,
      0,
      100,
      30,

      // middle rung
      30,
      60,
      67,
      60,
      30,
      90,
      30,
      90,
      67,
      60,
      67,
      90,
    ]),
    gl.STATIC_DRAW
  );
}

const vertexShaderSource = `#version 300 es
  in vec2 a_position;

  uniform vec2 u_resolution;
  uniform vec2 u_translation;

  void main() {
    vec2 position = a_position + u_translation;

    vec2 zeroToOne = position / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  }
`;

const fragmentShaderSource = `#version 300 es
  precision highp float;
  uniform vec4 u_color;
  out vec4 outColor;

  void main() {
    outColor = u_color;
  }
`;

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(
  gl,
  gl.FRAGMENT_SHADER,
  fragmentShaderSource
);

const program = createProgram(gl, vertexShader, fragmentShader);

const resolutionUniformLocation = gl.getUniformLocation(
  program,
  "u_resolution"
);
const translationUniformLocation = gl.getUniformLocation(
  program,
  "u_translation"
);
const colorUniformLocation = gl.getUniformLocation(program, "u_color");
const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

const positionBuffer = gl.createBuffer();
if (positionBuffer === null) throw new Error("Failed to create buffer!");
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
setGeometry(gl);

let translation = [0, 0];

function drawScene(gl: WebGLRenderingContext) {
  resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(1, 1, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
  gl.uniform2f(translationUniformLocation, translation[0], translation[1]);

  gl.uniform4f(colorUniformLocation, 1, 0, 0, 1);

  gl.drawArrays(gl.TRIANGLES, 0, 18);
}

drawScene(gl);

const xSlider = document.querySelector("#x") as HTMLInputElement;
const ySlider = document.querySelector("#y") as HTMLInputElement;

xSlider.value = translation[0].toString();
ySlider.value = translation[1].toString();

xSlider.addEventListener("input", (e: Event) => {
  translation[0] = parseInt((<HTMLInputElement>e.target).value);
  drawScene(gl);
});

ySlider.addEventListener("input", (e: Event) => {
  translation[1] = parseInt((<HTMLInputElement>e.target).value);
  drawScene(gl);
});

export {};

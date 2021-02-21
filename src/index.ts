import { createShaderProgram } from "./core/shader";
import { Mat3 } from "./core/math/mat3";

const canvas = document.getElementById("wood-root") as HTMLCanvasElement | null;
if (canvas === null) throw Error("No wood root!");

const gl = canvas.getContext("webgl2");
if (gl === null) throw Error("No WebGL2!");

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

function setGeometry(gl: WebGL2RenderingContext) {
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

  uniform mat3 u_matrix;

  void main() {
    gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
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

const program = createShaderProgram(
  gl,
  vertexShaderSource,
  fragmentShaderSource
);

const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
const matrixLocation = gl.getUniformLocation(program, "u_matrix");
const colorLocation = gl.getUniformLocation(program, "u_color");

const positionBuffer = gl.createBuffer();
if (positionBuffer === null) throw new Error("Failed to create buffer!");

const vao = gl.createVertexArray();
if (vao === null) throw new Error("Failed to vertex array!");
gl.bindVertexArray(vao);

gl.enableVertexAttribArray(positionAttributeLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
setGeometry(gl);

gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

let translation = [0, 0];
let rotationInRadians = 0;
let scale = [1, 1];

function drawScene(gl: WebGL2RenderingContext) {
  resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(1, 1, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(program);
  gl.bindVertexArray(vao);

  const matrix = Mat3.projection(gl.canvas.width, gl.canvas.height);
  matrix.translate(translation[0], translation[1]);
  matrix.rotate(rotationInRadians);
  matrix.scale(scale[0], scale[1]);

  gl.uniformMatrix3fv(matrixLocation, false, matrix.values);
  gl.uniform4fv(colorLocation, [1, 0, 0, 1]);

  gl.drawArrays(gl.TRIANGLES, 0, 18);
}

drawScene(gl);

const xSlider = document.querySelector("#x") as HTMLInputElement;
const ySlider = document.querySelector("#y") as HTMLInputElement;
const angleSlider = document.querySelector("#angle") as HTMLInputElement;
const scaleSlider = document.querySelector("#scale") as HTMLInputElement;

xSlider.value = translation[0].toString();
ySlider.value = translation[1].toString();
angleSlider.value = "0";
scaleSlider.value = "100";

xSlider.addEventListener("input", (e: Event) => {
  translation[0] = parseInt((<HTMLInputElement>e.target).value);
  drawScene(gl);
});

ySlider.addEventListener("input", (e: Event) => {
  translation[1] = parseInt((<HTMLInputElement>e.target).value);
  drawScene(gl);
});

angleSlider.addEventListener("input", (e: Event) => {
  const angleInDegrees = 360 - parseInt((<HTMLInputElement>e.target).value);
  const angleInRadians = (angleInDegrees * Math.PI) / 180;
  rotationInRadians = angleInRadians;
  drawScene(gl);
});

scaleSlider.addEventListener("input", (e: Event) => {
  const newScale = parseInt((<HTMLInputElement>e.target).value) / 100;
  scale = [newScale, newScale];
  drawScene(gl);
});

export {};

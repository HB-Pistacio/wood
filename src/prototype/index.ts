import { createShaderProgram } from "./shader";
import { Mat3 } from "../core/math/mat3";

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
  in vec2 a_texcoord;

  uniform mat3 u_matrix;
  out vec2 v_texcoord;

  void main() {
    gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);

    v_texcoord = a_texcoord;
  }
`;

const fragmentShaderSource = `#version 300 es
  precision highp float;
  
  in vec2 v_texcoord;
  uniform sampler2D u_texture;
  
  out vec4 outColor;

  void main() {
    if (v_texcoord.x < 0.0 || v_texcoord.y < 0.0 || v_texcoord.x > 1.0 || v_texcoord.y > 1.0) { 
      discard; 
    }

    outColor = texture(u_texture, v_texcoord);
  }
`;

const program = createShaderProgram(
  gl,
  vertexShaderSource,
  fragmentShaderSource
);

const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
const texCoordLocation = gl.getAttribLocation(program, "a_texcoord");
const matrixLocation = gl.getUniformLocation(program, "u_matrix");
const textureLocation = gl.getUniformLocation(program, "u_texture");

const vao = gl.createVertexArray();
if (vao === null) throw new Error("Failed to vertex array!");
gl.bindVertexArray(vao);

const positionBuffer = gl.createBuffer();
if (positionBuffer === null) throw new Error("Failed to create buffer!");
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
var positions = [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

const texCoordBuffer = gl.createBuffer();
if (texCoordBuffer === null) throw new Error("Failed to create buffer!");
gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
var texcoords = [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
gl.enableVertexAttribArray(texCoordLocation);
gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, true, 0, 0);

function loadImageAndCreateTextureInfo(
  gl: WebGL2RenderingContext,
  url: string
) {
  const tex = gl.createTexture();
  if (tex === null) throw new Error("Unable to create texture");
  gl.bindTexture(gl.TEXTURE_2D, tex);
  // Fill the texture with a 1x1 blue pixel.
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 255, 255])
  );

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const textureInfo = {
    width: 1, // we don't know the size until it loads
    height: 1,
    texture: tex,
  };

  const img = new Image();
  img.addEventListener("load", function () {
    textureInfo.width = img.width;
    textureInfo.height = img.height;

    gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.generateMipmap(gl.TEXTURE_2D);
  });

  img.src = url;

  return textureInfo;
}

const textureInfo = loadImageAndCreateTextureInfo(
  gl,
  "./assets/textures/myFace.png"
);

let translation = [0, 0];
let rotationInRadians = 0;
let scale = [1, 1];

function drawScene(gl: WebGL2RenderingContext) {
  resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(1, 1, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);
  gl.bindVertexArray(vao);

  gl.uniform1i(textureLocation, 0);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);

  const matrix = Mat3.projection(gl.canvas.width, gl.canvas.height);
  matrix.translate(translation[0], translation[1]);
  matrix.rotate(rotationInRadians);
  matrix.scale(textureInfo.width, textureInfo.height);

  gl.uniformMatrix3fv(matrixLocation, false, matrix.values);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
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

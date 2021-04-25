import {
  fragmentShaderSource,
  vertexShaderSource,
} from "../../assets/shaders/default";
import type { Mat4 } from "../math/Mat4";
import { degToRad } from "../math/trig";
import { Shader } from "../Shader";
import { Component } from "./index";

export class F extends Component {
  gl: WebGL2RenderingContext;
  shader: Shader;
  vao: WebGLVertexArrayObject;

  constructor(gl: WebGL2RenderingContext) {
    super();

    this.gl = gl;
    this.shader = new Shader(gl, vertexShaderSource, fragmentShaderSource);
    // look up where the vertex data needs to go.
    const positionAttributeLocation = gl.getAttribLocation(
      this.shader.program,
      "a_position"
    );
    const colorAttributeLocation = gl.getAttribLocation(
      this.shader.program,
      "a_color"
    );

    // Create a buffer
    const positionBuffer = gl.createBuffer();
    // Create a vertex array object (attribute state)
    const vao = gl.createVertexArray();
    this.vao = vao!;
    // and make it the one we're currently working with
    gl.bindVertexArray(vao);
    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Set Geometry.
    setGeometry(gl);
    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    // create the color buffer, make it the current ARRAY_BUFFER
    // and copy in the color values
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setColors(gl);
    // Turn on the attribute
    gl.enableVertexAttribArray(colorAttributeLocation);
    // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
    gl.vertexAttribPointer(
      colorAttributeLocation,
      3,
      gl.UNSIGNED_BYTE,
      true,
      0,
      0
    );
  }

  start = () => {
    this.gameObject;
  };

  update = (deltaTime: number, projection: Mat4, view: Mat4) => {
    // Use shader and upload uniforms
    this.shader.use();

    const yRotation = this.gameObject!.transform.rotation.y + deltaTime * 0.15;
    this.gameObject!.transform.rotation.y = yRotation;

    // Upload transformation matricies
    this.shader.uploadUniformMat4("uProjection", projection);
    let viewMatrix = view.translate(this.gameObject!.transform.position);
    viewMatrix = viewMatrix.yRotate(
      degToRad(this.gameObject!.transform.rotation.y)
    );
    this.shader.uploadUniformMat4("uView", viewMatrix);

    // Bind everything
    this.gl.bindVertexArray(this.vao);

    // Draw the geometry.
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 16 * 6);

    // Unbind everything
    this.gl.bindVertexArray(null);
    this.shader.detach();
  };
}

// Fill the current ARRAY_BUFFER buffer
// with the values that define a letter 'F'.
function setGeometry(gl: WebGL2RenderingContext) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      // left column front
      0,
      0,
      0,
      0,
      150,
      0,
      30,
      0,
      0,
      0,
      150,
      0,
      30,
      150,
      0,
      30,
      0,
      0,

      // top rung front
      30,
      0,
      0,
      30,
      30,
      0,
      100,
      0,
      0,
      30,
      30,
      0,
      100,
      30,
      0,
      100,
      0,
      0,

      // middle rung front
      30,
      60,
      0,
      30,
      90,
      0,
      67,
      60,
      0,
      30,
      90,
      0,
      67,
      90,
      0,
      67,
      60,
      0,

      // left column back
      0,
      0,
      30,
      30,
      0,
      30,
      0,
      150,
      30,
      0,
      150,
      30,
      30,
      0,
      30,
      30,
      150,
      30,

      // top rung back
      30,
      0,
      30,
      100,
      0,
      30,
      30,
      30,
      30,
      30,
      30,
      30,
      100,
      0,
      30,
      100,
      30,
      30,

      // middle rung back
      30,
      60,
      30,
      67,
      60,
      30,
      30,
      90,
      30,
      30,
      90,
      30,
      67,
      60,
      30,
      67,
      90,
      30,

      // top
      0,
      0,
      0,
      100,
      0,
      0,
      100,
      0,
      30,
      0,
      0,
      0,
      100,
      0,
      30,
      0,
      0,
      30,

      // top rung right
      100,
      0,
      0,
      100,
      30,
      0,
      100,
      30,
      30,
      100,
      0,
      0,
      100,
      30,
      30,
      100,
      0,
      30,

      // under top rung
      30,
      30,
      0,
      30,
      30,
      30,
      100,
      30,
      30,
      30,
      30,
      0,
      100,
      30,
      30,
      100,
      30,
      0,

      // between top rung and middle
      30,
      30,
      0,
      30,
      60,
      30,
      30,
      30,
      30,
      30,
      30,
      0,
      30,
      60,
      0,
      30,
      60,
      30,

      // top of middle rung
      30,
      60,
      0,
      67,
      60,
      30,
      30,
      60,
      30,
      30,
      60,
      0,
      67,
      60,
      0,
      67,
      60,
      30,

      // right of middle rung
      67,
      60,
      0,
      67,
      90,
      30,
      67,
      60,
      30,
      67,
      60,
      0,
      67,
      90,
      0,
      67,
      90,
      30,

      // bottom of middle rung.
      30,
      90,
      0,
      30,
      90,
      30,
      67,
      90,
      30,
      30,
      90,
      0,
      67,
      90,
      30,
      67,
      90,
      0,

      // right of bottom
      30,
      90,
      0,
      30,
      150,
      30,
      30,
      90,
      30,
      30,
      90,
      0,
      30,
      150,
      0,
      30,
      150,
      30,

      // bottom
      0,
      150,
      0,
      0,
      150,
      30,
      30,
      150,
      30,
      0,
      150,
      0,
      30,
      150,
      30,
      30,
      150,
      0,

      // left side
      0,
      0,
      0,
      0,
      0,
      30,
      0,
      150,
      30,
      0,
      0,
      0,
      0,
      150,
      30,
      0,
      150,
      0,
    ]),
    gl.STATIC_DRAW
  );
}

// Fill the current ARRAY_BUFFER buffer with colors for the 'F'.
function setColors(gl: WebGL2RenderingContext) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Uint8Array([
      // left column front
      200,
      70,
      120,
      200,
      70,
      120,
      200,
      70,
      120,
      200,
      70,
      120,
      200,
      70,
      120,
      200,
      70,
      120,

      // top rung front
      200,
      70,
      120,
      200,
      70,
      120,
      200,
      70,
      120,
      200,
      70,
      120,
      200,
      70,
      120,
      200,
      70,
      120,

      // middle rung front
      200,
      70,
      120,
      200,
      70,
      120,
      200,
      70,
      120,
      200,
      70,
      120,
      200,
      70,
      120,
      200,
      70,
      120,

      // left column back
      80,
      70,
      200,
      80,
      70,
      200,
      80,
      70,
      200,
      80,
      70,
      200,
      80,
      70,
      200,
      80,
      70,
      200,

      // top rung back
      80,
      70,
      200,
      80,
      70,
      200,
      80,
      70,
      200,
      80,
      70,
      200,
      80,
      70,
      200,
      80,
      70,
      200,

      // middle rung back
      80,
      70,
      200,
      80,
      70,
      200,
      80,
      70,
      200,
      80,
      70,
      200,
      80,
      70,
      200,
      80,
      70,
      200,

      // top
      70,
      200,
      210,
      70,
      200,
      210,
      70,
      200,
      210,
      70,
      200,
      210,
      70,
      200,
      210,
      70,
      200,
      210,

      // top rung right
      200,
      200,
      70,
      200,
      200,
      70,
      200,
      200,
      70,
      200,
      200,
      70,
      200,
      200,
      70,
      200,
      200,
      70,

      // under top rung
      210,
      100,
      70,
      210,
      100,
      70,
      210,
      100,
      70,
      210,
      100,
      70,
      210,
      100,
      70,
      210,
      100,
      70,

      // between top rung and middle
      210,
      160,
      70,
      210,
      160,
      70,
      210,
      160,
      70,
      210,
      160,
      70,
      210,
      160,
      70,
      210,
      160,
      70,

      // top of middle rung
      70,
      180,
      210,
      70,
      180,
      210,
      70,
      180,
      210,
      70,
      180,
      210,
      70,
      180,
      210,
      70,
      180,
      210,

      // right of middle rung
      100,
      70,
      210,
      100,
      70,
      210,
      100,
      70,
      210,
      100,
      70,
      210,
      100,
      70,
      210,
      100,
      70,
      210,

      // bottom of middle rung.
      76,
      210,
      100,
      76,
      210,
      100,
      76,
      210,
      100,
      76,
      210,
      100,
      76,
      210,
      100,
      76,
      210,
      100,

      // right of bottom
      140,
      210,
      80,
      140,
      210,
      80,
      140,
      210,
      80,
      140,
      210,
      80,
      140,
      210,
      80,
      140,
      210,
      80,

      // bottom
      90,
      130,
      110,
      90,
      130,
      110,
      90,
      130,
      110,
      90,
      130,
      110,
      90,
      130,
      110,
      90,
      130,
      110,

      // left side
      160,
      160,
      220,
      160,
      160,
      220,
      160,
      160,
      220,
      160,
      160,
      220,
      160,
      160,
      220,
      160,
      160,
      220,
    ]),
    gl.STATIC_DRAW
  );
}

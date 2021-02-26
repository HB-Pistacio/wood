import { Shader } from "./Shader";
import { Camera } from "./Camera";
import {
  vertexShaderSource,
  fragmentShaderSource,
} from "../assets/shaders/default";
import { Vec2 } from "./math/Vec2";

export class Scene {
  camera: Camera;
  defaultShader: Shader;
  gl: WebGL2RenderingContext;

  vao: WebGLVertexArrayObject;
  vbo: WebGLBuffer;
  ebo: WebGLBuffer;

  // prettier-ignore
  vertexArray = new Float32Array([
    // position            // color
    100.5, 0.5, 0.0,       1.0, 0.0, 0.0, 1.0, // Bottom right 0
    0.5, 100.5, 0.0,       0.0, 1.0, 0.0, 1.0, // Top left     1
    100.5, 100.5, 0.0 ,      1.0, 0.0, 1.0, 1.0, // Top right    2
    0.5, 0.5, 0.0,       1.0, 1.0, 0.0, 1.0, // Bottom left  3
  ])

  // prettier-ignore
  elementArray = new Int32Array([
    2, 1, 0, // Top right triangle
    0, 1, 3 // bottom left triangle
  ]);

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.defaultShader = new Shader(
      gl,
      vertexShaderSource,
      fragmentShaderSource
    );

    this.camera = new Camera(new Vec2(-200, -300));

    // ============================================================
    // Generate VAO, VBO, and EBO buffer objects, and send to GPU
    // ============================================================
    const vao = gl.createVertexArray();
    if (vao === null) throw new Error("Failed to create vba!");
    gl.bindVertexArray(vao);
    this.vao = vao;

    const vbo = gl.createBuffer();
    if (vbo === null) throw new Error("Failed to create vbo!");
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertexArray, gl.STATIC_DRAW);
    this.vbo = vbo;

    const ebo = gl.createBuffer();
    if (ebo === null) throw new Error("Failed to create ebo!");
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.elementArray, gl.STATIC_DRAW);
    this.ebo = ebo;

    const [positionsSize, colorSize] = [3, 4];
    const stride = (positionsSize + colorSize) * 4;
    gl.vertexAttribPointer(0, positionsSize, gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(0);

    gl.vertexAttribPointer(
      1,
      colorSize,
      gl.FLOAT,
      false,
      stride,
      positionsSize * 4
    );
    gl.enableVertexAttribArray(1);
  }

  update = (dt: number) => {
    this.camera.position = this.camera.position.subtract(
      new Vec2(50 * dt, 20 * dt)
    );

    // console.log(this.camera.getViewMatrix().values);

    // Use shader and upload uniforms
    this.defaultShader.use();
    this.defaultShader.uploadUniformMat4(
      "uProjection",
      this.camera.projectionMatrix
    );
    this.defaultShader.uploadUniformMat4("uView", this.camera.getViewMatrix());

    // Bind everything
    this.gl.bindVertexArray(this.vao);
    this.gl.enableVertexAttribArray(0);
    this.gl.enableVertexAttribArray(1);

    // Draw the stuff
    this.gl.drawElements(
      this.gl.TRIANGLES,
      this.elementArray.length,
      this.gl.UNSIGNED_INT,
      0
    );

    // Unbind everything
    this.gl.disableVertexAttribArray(0);
    this.gl.disableVertexAttribArray(1);
    this.gl.bindVertexArray(null);

    this.defaultShader.detach();
  };
}

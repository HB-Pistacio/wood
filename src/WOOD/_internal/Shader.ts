import { WOOD } from "../index";
import type { Mat4 } from "../math/Mat4";

function compile(gl: WebGLRenderingContext, type: number, source: string) {
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

export class Shader {
  program: WebGLProgram;

  private vao: WebGLVertexArrayObject;
  private attributeLocations: Map<string, number> = new Map();
  private uniformLocations: Map<string, WebGLUniformLocation> = new Map();

  constructor(params: {
    vertexShaderSource: string;
    fragmentShaderSource: string;
    attributes: ReadonlyArray<string>;
    uniforms: ReadonlyArray<string>;
  }) {
    const vertexShader = compile(
      WOOD.gl,
      WOOD.gl.VERTEX_SHADER,
      params.vertexShaderSource
    );
    const fragmentShader = compile(
      WOOD.gl,
      WOOD.gl.FRAGMENT_SHADER,
      params.fragmentShaderSource
    );

    const program = WOOD.gl.createProgram();
    if (program === null) throw Error("Failed to create shader program!");
    WOOD.gl.attachShader(program, vertexShader);
    WOOD.gl.attachShader(program, fragmentShader);
    WOOD.gl.linkProgram(program);

    if (WOOD.gl.getProgramParameter(program, WOOD.gl.LINK_STATUS) !== true) {
      // Throw error when compile status wasn't ok
      const info = WOOD.gl.getProgramInfoLog(program);
      WOOD.gl.deleteProgram(program);
      throw new Error(info ?? `Could not create program`);
    }

    WOOD.gl.useProgram(program);

    const vao = WOOD.gl.createVertexArray();
    if (vao === null) {
      throw new Error(`Could not create VAO`);
    }
    this.vao = vao;

    // Look up attributes
    params.attributes.forEach((attribute) => {
      const location = WOOD.gl.getAttribLocation(program, attribute);
      if (location === null) {
        throw new Error(`Could not look up attribute location '${attribute}'`);
      }
      this.attributeLocations.set(attribute, location);
    });

    // Look up uniforms
    params.uniforms.forEach((uniform) => {
      const location = WOOD.gl.getUniformLocation(program, uniform);
      if (location === null) {
        throw new Error(`Could not look up uniform location '${uniform}'`);
      }
      this.uniformLocations.set(uniform, location);
    });

    this.program = program;
    WOOD.gl.useProgram(null);
  }

  attribute = (attribute: string) => {
    const location = this.attributeLocations.get(attribute);
    if (location === undefined)
      throw new Error(`Unknown attribute '${attribute}'`);
    return location;
  };

  uniform = (uniform: string) => {
    const location = this.uniformLocations.get(uniform);
    if (location === undefined) throw new Error(`Unknown uniform '${uniform}'`);
    return location;
  };

  bufferAttributeData = (params: {
    attribute: string;
    data: Float32Array | Uint8Array;
    size: number;
    stride?: number;
    offset?: number;
    glUsage?: number;
    type?: number;
    normalize?: boolean;
  }) => {
    const buffer = WOOD.gl.createBuffer();
    if (buffer === null) {
      throw new Error("Unable to create buffer");
    }
    WOOD.gl.bindVertexArray(this.vao);
    WOOD.gl.bindBuffer(WOOD.gl.ARRAY_BUFFER, buffer);
    WOOD.gl.bufferData(
      WOOD.gl.ARRAY_BUFFER,
      params.data,
      params.glUsage ?? WOOD.gl.STATIC_DRAW
    );

    const location = this.attribute(params.attribute);
    WOOD.gl.enableVertexAttribArray(location);
    WOOD.gl.vertexAttribPointer(
      location,
      params.size,
      params.type ?? WOOD.gl.FLOAT,
      params.normalize === true,
      params.stride ?? 0,
      params.offset ?? 0
    );
  };

  use = () => {
    WOOD.gl.useProgram(this.program);
    WOOD.gl.bindVertexArray(this.vao);
  };

  detach = () => {
    WOOD.gl.useProgram(null);
  };

  // TODO: probably remove this
  uploadUniformMat4 = (uniform: string, mat4: Mat4) => {
    const location = this.uniformLocations.get(uniform);
    if (location === undefined) throw new Error(`Unknown uniform '${uniform}'`);
    WOOD.gl.uniformMatrix4fv(location, false, mat4.values);
  };
}

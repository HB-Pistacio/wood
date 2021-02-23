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
  gl: WebGL2RenderingContext;
  vertexShaderSource: string;
  fragmentShaderSource: string;
  program: WebGLProgram;

  constructor(
    gl: WebGL2RenderingContext,
    vertexShaderSource: string,
    fragmentShaderSource: string
  ) {
    const vertexShader = compile(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compile(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    const program = gl.createProgram();
    if (program === null) throw Error("Failed to create shader program!");
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (gl.getProgramParameter(program, gl.LINK_STATUS) !== true) {
      // Throw error when compile status wasn't ok
      const info = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw info;
    }

    this.gl = gl;
    this.vertexShaderSource = vertexShaderSource;
    this.fragmentShaderSource = fragmentShaderSource;
    this.program = program;
  }

  use = () => {
    this.gl.useProgram(this.program);
  };

  detach = () => {
    this.gl.useProgram(null);
  };
}

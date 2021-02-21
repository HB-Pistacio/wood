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

export function createShaderProgram(
  gl: WebGLRenderingContext,
  vertexShaderSrc: string,
  fragmentShaderSrc: string
) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSrc
  );

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

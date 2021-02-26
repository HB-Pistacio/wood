export const vertexShaderSource = `#version 300 es
  in vec3 a_position;
  in vec4 a_color;

  uniform mat4 uProjection;
  uniform mat4 uView;

  out vec4 f_color;

  void main() {
    f_color = a_color;
    gl_Position = uProjection * uView * vec4(a_position, 1.0);
  }
`;

export const fragmentShaderSource = `#version 300 es
  precision highp float;
  
  in vec4 f_color;
  out vec4 outColor;

  void main() {
    outColor = f_color;
  }
`;
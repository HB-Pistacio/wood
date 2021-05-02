export const attributes = ["a_position", "a_texcoord"] as const;
export const uniforms = ["u_view", "u_textureMatrix", "u_texture"] as const;

export const vertexShaderSource = `#version 300 es
  in vec4 a_position;
  in vec2 a_texcoord;

  uniform mat4 u_view;
  uniform mat4 u_textureMatrix;

  out vec2 v_texcoord;

  void main() {
    v_texcoord = (u_textureMatrix * vec4(a_texcoord, 0, 1)).xy;
    gl_Position = u_view * a_position;
  }
`;

export const fragmentShaderSource = `#version 300 es
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

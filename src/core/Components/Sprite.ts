import { Component } from "./index";

export class Sprite extends Component {
  constructor(url: string) {
    super();
  }

  update = () => console.log("HEJ");
}

const vertexShaderSource = `#version 300 es
  in vec4 a_position;
  in vec2 a_texcoord;

  uniform mat4 u_projection;
  uniform mat4 u_view;

  out vec2 v_texcoord;

  void main() {
    v_texcoord = v_texcoord;
    gl_Position = u_projection * u_view * a_position;
  }
`;

const fragmentShaderSource = `#version 300 es
  precision highp float;
  
  in vec2 v_texcoord;
  uniform sampler2D texture;

  out vec4 outColor;

  void main() {
    outColor = texture(texture, v_texcoord);
  }
`;

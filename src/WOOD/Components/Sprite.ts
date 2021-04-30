import { WOOD } from "../index";
import { Vec2 } from "../math/Vec2";
import { Component } from "../_internal/Component";
import { Shader } from "../_internal/Shader";

const unitRectangle = new Float32Array([0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1]);

export class Sprite extends Component {
  shader: Shader;

  // Internal
  private vao: WebGLVertexArrayObject;
  private loaded: boolean = false;
  private texture: WebGLTexture;
  private textureSize: Vec2 = new Vec2(1, 1);

  constructor(url: string) {
    super();
    const texture = WOOD.gl.createTexture();
    if (texture === null) {
      throw new Error(`Sprite: Could not instantiate WebGLTexture`);
    }
    this.texture = texture;

    // Create a vertex array object (attribute state)
    const vao = WOOD.gl.createVertexArray();
    if (vao === null) {
      throw new Error(`Could not create VAO`);
    }
    this.vao = vao;

    this.shader = new Shader({
      vertexShaderSource,
      fragmentShaderSource,
      attributes: ["a_position", "a_texcoord"],
      uniforms: ["u_projection", "u_view"],
    });

    this.shader.bufferAttributeData({
      attribute: "a_position",
      data: unitRectangle,
      size: 2,
    });

    this.shader.bufferAttributeData({
      attribute: "a_texcoord",
      data: unitRectangle,
      size: 2,
    });

    // Bind texture and set wrapping
    WOOD.gl.bindTexture(WOOD.gl.TEXTURE_2D, texture);
    WOOD.gl.texParameteri(
      WOOD.gl.TEXTURE_2D,
      WOOD.gl.TEXTURE_WRAP_S,
      WOOD.gl.CLAMP_TO_EDGE
    );
    WOOD.gl.texParameteri(
      WOOD.gl.TEXTURE_2D,
      WOOD.gl.TEXTURE_WRAP_T,
      WOOD.gl.CLAMP_TO_EDGE
    );

    // Bind texture to image after it has been loaded
    const image = new Image();
    image.addEventListener("load", () => {
      this.textureSize = new Vec2(image.width, image.height);
      WOOD.gl.bindTexture(WOOD.gl.TEXTURE_2D, texture);
      WOOD.gl.texImage2D(
        WOOD.gl.TEXTURE_2D,
        0,
        WOOD.gl.RGBA,
        WOOD.gl.RGBA,
        WOOD.gl.UNSIGNED_BYTE,
        image
      );
      WOOD.gl.generateMipmap(WOOD.gl.TEXTURE_2D);
      this.loaded = true;
    });

    image.src = url;
  }

  update = () => {
    if (this.loaded === false) {
      return; // Dont draw anything until we have loaded the texture
    }

    this.shader.use();
  };
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

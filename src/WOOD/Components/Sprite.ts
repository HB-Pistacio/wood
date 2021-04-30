import { WOOD } from "../index";
import { Mat4 } from "../math/Mat4";
import { Vec2 } from "../math/Vec2";
import { Vec3 } from "../math/Vec3";
import { Component } from "../_internal/Component";
import { Shader } from "../_internal/Shader";

const unitRectangle = new Float32Array([0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1]);

export class Sprite extends Component {
  shader: Shader;

  // Internal
  private loaded: boolean = false;
  private texture: WebGLTexture;
  private textureSize: Vec2 = new Vec2(1, 1);
  private _start: Vec2;
  private _end: Vec2;

  constructor(url: string, options?: { offset?: Vec2; size?: Vec2 }) {
    super();
    const texture = WOOD.gl.createTexture();
    if (texture === null) {
      throw new Error(`Sprite: Could not instantiate WebGLTexture`);
    }
    this.texture = texture;
    this._start = options?.offset ?? new Vec2(0, 0);
    this._end = this._start.add(options?.size ?? new Vec2(1, 1));

    this.shader = new Shader({
      vertexShaderSource,
      fragmentShaderSource,
      attributes: ["a_position", "a_texcoord"],
      uniforms: ["u_view", "u_textureMatrix", "u_texture"],
    });

    this.shader.use();

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
      if (options?.size === undefined) {
        this._end = this.textureSize;
      }

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
    image.crossOrigin = "anonymous";
    image.src = url;
  }

  update = (deltaTime: number, projection: Mat4, view: Mat4) => {
    if (this.loaded === false) {
      return; // Dont draw anything until we have loaded the texture
    }

    this.shader.use();

    // Tell shader that we are going to pipe texture 0 into u_texture
    WOOD.gl.uniform1i(this.shader.uniform("u_texture"), 0);
    // Bind the sprite texture to TEXTURE0
    WOOD.gl.activeTexture(WOOD.gl.TEXTURE0);
    WOOD.gl.bindTexture(WOOD.gl.TEXTURE_2D, this.texture);

    // Compute size of sprite
    const size = this._end.subtract(this._start);

    // Transform view matrix by gameObject.transform
    const { position, rotation, scale } = this.gameObject!.transform;
    view = view.translate(new Vec3(-size.x / 2, -size.y / 2, 0)); // Move origin to center
    view = view.translate(position);
    view = view.scale(new Vec3(size.x, size.y, 1));
    view = view.scale(scale);
    view = view.zRotate(rotation.z);

    const texturePosition = new Vec3(
      this._start.x / this.textureSize.x,
      this._start.y / this.textureSize.y,
      0
    );

    const textureScale = new Vec3(
      size.x / this.textureSize.x,
      size.y / this.textureSize.y,
      1
    );
    let textureMatrix = Mat4.IDENTITY.translate(texturePosition);
    textureMatrix = textureMatrix.scale(textureScale);

    this.shader.uploadUniformMat4("u_view", projection.multiply(view));
    this.shader.uploadUniformMat4("u_textureMatrix", textureMatrix);
    WOOD.gl.drawArrays(WOOD.gl.TRIANGLES, 0, 6);

    this.shader.detach();
  };
}

const vertexShaderSource = `#version 300 es
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

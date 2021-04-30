import { WOOD, Mat4, degToRad, Vec2, Vec3 } from "../index";

import { Component } from "../_internal/Component";
import { Shader } from "../_internal/Shader";
import {
  Texture,
  TextureManager,
  UNLOADED_TEXTURE,
} from "../_internal/TextureManager";

const unitRectangle = new Float32Array([0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1]);

export class Sprite extends Component {
  private loaded: boolean = false;
  private texture: Texture = UNLOADED_TEXTURE;
  private _start: Vec2;
  private _end: Vec2;

  constructor(url: string, options?: { offset?: Vec2; size?: Vec2 }) {
    super();
    if (SPRITE_SHADER === undefined) makeSpriteShader();
    this._start = options?.offset ?? new Vec2(0, 0);
    this._end = this._start.add(options?.size ?? new Vec2(1, 1));

    TextureManager.load(url).then((texture) => {
      this.texture = texture;
      if (options?.size === undefined) {
        this._end = this._start.add(texture.size);
      }
      this.loaded = true;
    });
  }

  update = (deltaTime: number, projection: Mat4, view: Mat4) => {
    if (this.loaded === false) {
      return; // Dont draw anything until we have loaded the texture
    }

    SPRITE_SHADER.use();

    // Tell shader that we are going to pipe texture 0 into u_texture
    WOOD.gl.uniform1i(SPRITE_SHADER.uniform("u_texture"), 0);
    // Bind the sprite texture to TEXTURE0
    WOOD.gl.activeTexture(WOOD.gl.TEXTURE0);
    WOOD.gl.bindTexture(WOOD.gl.TEXTURE_2D, this.texture.texture);

    // Compute size of sprite
    const size = this._end.subtract(this._start);

    // Transform view matrix by gameObject.transform
    const { position, rotation, scale } = this.gameObject!.transform;
    view = view.translate(new Vec3(position.x, -position.y, position.z));
    view = view.zRotate(degToRad(rotation.z));
    view = view.translate(new Vec3(-size.x / 2, -size.y / 2, 0)); // Move origin to center
    view = view.scale(new Vec3(size.x, size.y, 1));
    view = view.scale(scale);

    let textureMatrix = Mat4.IDENTITY.translate(
      new Vec3(
        this._start.x / this.texture.size.x,
        this._start.y / this.texture.size.y,
        0
      )
    );
    textureMatrix = textureMatrix.scale(
      new Vec3(size.x / this.texture.size.x, size.y / this.texture.size.y, 1)
    );

    SPRITE_SHADER.uploadUniformMat4("u_view", projection.multiply(view));
    SPRITE_SHADER.uploadUniformMat4("u_textureMatrix", textureMatrix);
    WOOD.gl.drawArrays(WOOD.gl.TRIANGLES, 0, 6);

    SPRITE_SHADER.detach();
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

let SPRITE_SHADER: Shader = undefined as any;
const makeSpriteShader = () => {
  SPRITE_SHADER = new Shader({
    vertexShaderSource,
    fragmentShaderSource,
    attributes: ["a_position", "a_texcoord"],
    uniforms: ["u_view", "u_textureMatrix", "u_texture"],
  });

  SPRITE_SHADER.bufferAttributeData({
    attribute: "a_position",
    data: unitRectangle,
    size: 2,
  });

  SPRITE_SHADER.bufferAttributeData({
    attribute: "a_texcoord",
    data: unitRectangle,
    size: 2,
  });
};

import type { Shader } from "../Shader";
import type { Texture } from "../Texture";
import { WOOD, Mat4, degToRad, Vec, Component } from "../index";
import { isLoaded } from "../_internal/utils/isLoaded";

export class Sprite extends Component {
  private loaded = false;
  private texture: Texture | undefined;
  private shader: Shader;
  private _start: Vec;
  private _end: Vec;

  constructor(url: string, options?: { offset?: Vec; size?: Vec }) {
    super();
    this.shader = WOOD.getShader("wood/sprite");
    WOOD.getTexture(url).then((texture) => {
      this.loaded = true;
      this.texture = texture;
      if (options?.size === undefined) {
        this._end = this._start.add(texture.dimensions);
      }
    });

    this._start = options?.offset ?? new Vec([0, 0]);
    this._end = this._start.add(options?.size ?? new Vec([1, 1]));
  }

  update = () => {
    if (!isLoaded(this.loaded, this.texture)) {
      return;
    }

    this.shader.use();

    // Tell shader that we are going to pipe texture 0 into u_texture
    WOOD.gl.uniform1i(this.shader.uniform("u_texture"), 0);
    // Bind the sprite texture to TEXTURE0
    WOOD.gl.activeTexture(WOOD.gl.TEXTURE0);
    WOOD.gl.bindTexture(WOOD.gl.TEXTURE_2D, this.texture.id);

    // Compute size of sprite
    const size = this._end.subtract(this._start);

    // Transform view matrix by gameObject.transform
    const { position, rotation, scale } = this.gameObject!.transform;
    let view = WOOD.view.translate(
      new Vec([position.x, -position.y, position.z])
    );
    view = view.zRotate(degToRad(rotation.z));
    view = view.translate(new Vec([-size.x / 2, -size.y / 2, 0])); // Move origin to center
    view = view.scale(new Vec([size.x, size.y, 1]));
    view = view.scale(scale);

    let textureMatrix = Mat4.IDENTITY.translate(
      new Vec([
        this._start.x / this.texture.dimensions.x,
        this._start.y / this.texture.dimensions.y,
        0,
      ])
    );
    textureMatrix = textureMatrix.scale(
      new Vec([
        size.x / this.texture.dimensions.x,
        size.y / this.texture.dimensions.y,
        1,
      ])
    );

    this.shader.uploadUniformMat4("u_view", WOOD.projection.multiply(view));
    this.shader.uploadUniformMat4("u_textureMatrix", textureMatrix);
    WOOD.gl.drawArrays(WOOD.gl.TRIANGLES, 0, 6);

    this.shader.detach();
  };
}

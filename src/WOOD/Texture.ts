import { WOOD } from "./index";
import { Vec } from "./math/Vec";

export class Texture {
  private _id: WebGLTexture;
  private _url: string;
  private _dimensions = new Vec([1, 1]);

  static async load(url: string) {
    const texId = WOOD.gl.createTexture();
    if (texId === null) {
      throw new Error(`Sprite: Could not instantiate WebGLTexture`);
    }

    WOOD.gl.bindTexture(WOOD.gl.TEXTURE_2D, texId);
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

    return new Promise<Texture>((resolve) => {
      const image = new Image();
      image.addEventListener("load", () => {
        WOOD.gl.bindTexture(WOOD.gl.TEXTURE_2D, texId);
        WOOD.gl.texImage2D(
          WOOD.gl.TEXTURE_2D,
          0,
          WOOD.gl.RGBA,
          WOOD.gl.RGBA,
          WOOD.gl.UNSIGNED_BYTE,
          image
        );
        WOOD.gl.generateMipmap(WOOD.gl.TEXTURE_2D);

        resolve(
          new Texture({
            url,
            id: texId,
            dimensions: new Vec([image.width, image.height]),
          })
        );
      });

      image.crossOrigin = "anonymous";
      image.src = url;
    });
  }

  constructor(params: { url: string; id: WebGLTexture; dimensions: Vec }) {
    this._url = params.url;
    this._id = params.id;
    this._dimensions = params.dimensions;
  }

  get id() {
    return this._id;
  }

  get dimensions() {
    return this._dimensions;
  }

  get url() {
    return this._url;
  }
}

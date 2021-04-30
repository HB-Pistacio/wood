import { WOOD, Vec2 } from "../index";

export type Texture = { texture: WebGLTexture; size: Vec2 };
export const UNLOADED_TEXTURE = { texture: -1, size: new Vec2(1, 1) };

type URL = string;
const textures: Map<URL, Texture> = new Map();
const loading: Map<URL, Promise<Texture>> = new Map();

export const TextureManager = {
  load: async (url: URL): Promise<Texture> => {
    if (textures.has(url)) {
      return textures.get(url)!;
    }

    if (loading.has(url)) {
      return await loading.get(url)!;
    }

    const texture = WOOD.gl.createTexture();
    if (texture === null) {
      throw new Error(`Sprite: Could not instantiate WebGLTexture`);
    }

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

    const promise = new Promise<Texture>((resolve) => {
      // Bind texture to image after it has been loaded
      const image = new Image();
      image.addEventListener("load", () => {
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

        loading.delete(url);
        const textureValue = {
          size: new Vec2(image.width, image.height),
          texture,
        };
        textures.set(url, {
          size: new Vec2(image.width, image.height),
          texture,
        });

        resolve(textureValue);
      });

      image.crossOrigin = "anonymous";
      image.src = url;
    });

    loading.set(url, promise);
    return promise;
  },
};

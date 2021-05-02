import { Texture } from "../Texture";
import { Shader } from "../Shader";

///////// TEXTURES /////////
const textures = new Map<string, Texture | Promise<Texture>>();

export const getTexture = async (url: string): Promise<Texture> => {
  if (textures.has(url)) {
    return await textures.get(url)!;
  }

  const texture = Texture.load(url);
  textures.set(url, texture);
  return await texture;
};

///////// SHADERS /////////
const shaders = new Map<string, Shader>();

export const loadShader = (
  params: ConstructorParameters<typeof Shader>[0] & { url: string }
) => {
  const { url, ...shaderParams } = params;
  const shader = new Shader(shaderParams);
  shaders.set(url, shader);
  return shader;
};

export const getShader = (url: string): Shader => {
  if (shaders.has(url) === false) {
    throw new Error(`Cannot get unknown shader '${url}'`);
  }

  return shaders.get(url)!;
};

///////// TODO: MODELS /////////

import { loadShader } from "../AssetManager";
import * as spriteShader from "./sprite";

const unitRectangle = new Float32Array([0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1]);

export const LOAD_WOOD_SHADERS = () => {
  const SPRITE_SHADER = loadShader({ url: "wood/sprite", ...spriteShader });
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

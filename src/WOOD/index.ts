import { _WOOD } from "./_internal/_WOOD";

// Expose WOOD clases
export * from "./Scene";
export * as Input from "./Input";
export * from "./GameObject";
export * from "./Camera";

// Expose math helpers
export * from "./math/Mat4";
export * from "./math/Vec";
export * from "./math/interpolation";
export * from "./math/trigonometry";
export { Shader } from "./Shader";

// Expose components
export * from "./Components/Sprite";

// WOOD engine singleton
export const WOOD = new _WOOD();

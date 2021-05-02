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

// Expose internal classes for custom components
export { Component as WOOD_Component } from "./_internal/Component";
export { Shader } from "./Shader";

// Expose components
export * from "./Components/Transform";
export * from "./Components/Sprite";

// WOOD engine singleton
export const WOOD = new _WOOD();

import type { GameObject } from "../GameObject";
import type { Mat4 } from "../math/Mat4";

export abstract class Component {
  gameObject: GameObject | undefined = undefined;
  start: () => void = () => {};
  update: (deltaTime: number, projection: Mat4, view: Mat4) => void = () => {};
}

import { Mat4 } from "./math/Mat4";
import type { Vec2 } from "./math/Vec2";

export class Camera {
  projectionMatrix: Mat4;
  viewMatrix: Mat4;
  position: Vec2;

  constructor(position: Vec2, size: Vec2) {
    this.position = position;
    this.projectionMatrix = Mat4.orthographic(0, size.x, size.y, 0, 400, -400);
    this.viewMatrix = Mat4.IDENTITY;
  }

  getViewMatrix = () => {
    this.viewMatrix = Mat4.IDENTITY;
    // this.viewMatrix = Mat4.IDENTITY.lookAt(
    //   new Vec3(this.position.x, this.position.y, 20.0),
    //   new Vec3(this.position.x, this.position.y, -1.0),
    //   new Vec3(0, 1, 0)
    // );

    return this.viewMatrix;
  };
}

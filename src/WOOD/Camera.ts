import { WOOD } from "./index";
import { Mat4 } from "./math/Mat4";
import { Vec2 } from "./math/Vec2";
import { Vec3 } from "./math/Vec3";

export abstract class Camera {
  _viewMatrix: Mat4;
  position: Vec3;
  target: Vec3;

  constructor(position: Vec3, lookTarget: Vec3) {
    this.position = position;
    this.target = lookTarget;
    this._viewMatrix = this.viewMatrix;
  }

  get viewMatrix() {
    return Mat4.lookAt(this.position, this.target, new Vec3(0, 1, 0)).inverse;
  }

  get projection() {
    return Mat4.IDENTITY;
  }
}

export class CameraOrthographic extends Camera {
  size: Vec2;

  constructor(position: Vec3, lookTarget: Vec3, size: Vec2) {
    super(position, lookTarget);
    this.size = size;
  }

  get projection() {
    return Mat4.orthographic(0, this.size.x, this.size.y, 0, 400, -400);
  }
}

export class CameraFixedToCanvas extends Camera {
  constructor() {
    const clientSize = new Vec2(
      (WOOD.canvas as any).clientWidth,
      (WOOD.canvas as any).clientHeight
    );
    const position = new Vec3(-clientSize.x / 2, -clientSize.y / 2, 100);
    const lookTarget = new Vec3(-clientSize.x / 2, -clientSize.y / 2, 0);
    super(position, lookTarget);
  }

  get projection() {
    const clientSize = new Vec2(
      (WOOD.canvas as any).clientWidth,
      (WOOD.canvas as any).clientHeight
    );

    this.position = new Vec3(-clientSize.x / 2, -clientSize.y / 2, 100);
    this.target = new Vec3(-clientSize.x / 2, -clientSize.y / 2, 0);
    return Mat4.orthographic(0, clientSize.x, clientSize.y, 0, 400, -400);
  }
}

export class CameraPerspective extends Camera {
  fieldOfViewRadians: number;
  aspect: number;
  zNear: number;
  zFar: number;

  constructor(
    position: Vec3,
    lookTarget: Vec3,
    fieldOfViewRadians: number,
    aspect: number,
    zNear: number,
    zFar: number
  ) {
    super(position, lookTarget);
    this.fieldOfViewRadians = fieldOfViewRadians;
    this.aspect = aspect;
    this.zNear = zNear;
    this.zFar = zFar;
  }

  get projection() {
    return Mat4.perspective(
      this.fieldOfViewRadians,
      this.aspect,
      this.zNear,
      this.zFar
    );
  }
}

import { WOOD } from "./index";
import { Mat4 } from "./math/Mat4";
import { Vec } from "./math/Vec";

export abstract class Camera {
  _viewMatrix: Mat4;
  position: Vec;
  target: Vec;
  protected _projection: Mat4 = Mat4.IDENTITY;

  constructor(position: Vec, lookTarget: Vec) {
    this.position = position;
    this.target = lookTarget;
    this._viewMatrix = this.viewMatrix;
  }

  get viewMatrix() {
    return Mat4.lookAt(this.position, this.target, new Vec([0, 1, 0])).inverse;
  }

  get projection() {
    return this._projection;
  }
}

export class CameraOrthographic extends Camera {
  constructor(position: Vec, lookTarget: Vec, size: Vec) {
    super(position, lookTarget);
    this._projection = Mat4.orthographic(0, size.x, size.y, 0, 400, -400);
  }
}

export class CameraFixedToCanvas extends Camera {
  constructor() {
    const center = WOOD.windowSize.scale(-0.5);
    const position = new Vec([center.x, center.y, 100]);
    const lookTarget = new Vec([center.x, center.y, 0]);
    super(position, lookTarget);
  }

  get projection() {
    const clientSize = WOOD.windowSize;
    const center = clientSize.scale(-0.5);
    this.position = new Vec([center.x, center.y, 100]);
    this.target = new Vec([center.x, center.y, 0]);
    return Mat4.orthographic(0, clientSize.x, clientSize.y, 0, 400, -400);
  }
}

export class CameraPerspective extends Camera {
  fieldOfViewRadians: number;
  aspect: number;
  zNear: number;
  zFar: number;

  constructor(
    position: Vec,
    lookTarget: Vec,
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

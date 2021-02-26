import type { Vec2 } from "./Vec2";
import type { Vec3 } from "./Vec3";

const multiplyMatrixWithPoint = (
  mat: ReadonlyArray<number>,
  p: ReadonlyArray<number>
) => [
  p[0] * mat[0] + p[1] * mat[4] + p[2] * mat[8] + p[3] * mat[12],
  p[0] * mat[1] + p[1] * mat[5] + p[2] * mat[9] + p[3] * mat[13],
  p[0] * mat[2] + p[1] * mat[6] + p[2] * mat[10] + p[3] * mat[14],
  p[0] * mat[3] + p[1] * mat[7] + p[2] * mat[11] + p[3] * mat[15],
];

const multiplyMatrices = (
  matA: ReadonlyArray<number>,
  matB: ReadonlyArray<number>
) => [
  ...multiplyMatrixWithPoint(matA, [matB[0], matB[1], matB[2], matB[3]]),
  ...multiplyMatrixWithPoint(matA, [matB[4], matB[5], matB[6], matB[7]]),
  ...multiplyMatrixWithPoint(matA, [matB[8], matB[9], matB[10], matB[11]]),
  ...multiplyMatrixWithPoint(matA, [matB[12], matB[13], matB[14], matB[15]]),
];

export class Mat4 {
  // prettier-ignore
  static IDENTITY = Object.freeze(new Mat4([
    1, 0, 0, 0, 
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]));

  // Took this from here: http://learnwebgl.brown37.net/08_projections/projections_ortho.html#switch-coordinate-systems
  static orthographic = (
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ) => {
    // prettier-ignore
    return new Mat4([
      2.0 / (right - left), 0,                  0,               -(right + left) / (right - left),
      0,                    2 / (top - bottom), 0,               -(top + bottom) / (top - bottom),
      0,                    0,                  -2 / (far-near), -(far + near) / (far - near),
      0,                    0,                  0,               1
    ]);
  };

  values: ReadonlyArray<number>;

  constructor(values: ReadonlyArray<number>) {
    if (values.length !== 16)
      throw new Error(
        `Mat4 must be initialized with 4x4 values. Received '${values.length}'!`
      );

    this.values = values;
  }

  static multiply = (a: Mat4, b: Mat4) =>
    new Mat4(multiplyMatrices(a.values, b.values));

  lookAt = (eye: Vec3, center: Vec3, up: Vec3) => {
    let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
    let eyex = eye.x;
    let eyey = eye.y;
    let eyez = eye.z;
    let upx = up.x;
    let upy = up.y;
    let upz = up.z;
    let centerx = center.x;
    let centery = center.y;
    let centerz = center.z;

    if (
      Math.abs(eyex - centerx) < 0.000001 &&
      Math.abs(eyey - centery) < 0.000001 &&
      Math.abs(eyez - centerz) < 0.000001
    ) {
      return Mat4.IDENTITY;
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;
    len = 1 / Math.hypot(z0, z1, z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;
    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.hypot(x0, x1, x2);
    if (!len) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len = 1 / len;
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }
    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;
    len = Math.hypot(y0, y1, y2);
    if (!len) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      len = 1 / len;
      y0 *= len;
      y1 *= len;
      y2 *= len;
    }

    // prettier-ignore
    return new Mat4([
      x0, y0, z0, 0, 
      x1, y1, z1, 0,
      x2, y2, z2, 0,
      -(x0 * eyex + x1 * eyey + x2 * eyez),  -(y0 * eyex + y1 * eyey + y2 * eyez), -(z0 * eyex + z1 * eyey + z2 * eyez), 1
    ])
  };
}

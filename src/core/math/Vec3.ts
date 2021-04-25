import { lerp } from "./interpolation";

export class Vec3 {
  x: number;
  y: number;
  z: number;

  static ZERO = Object.freeze(new Vec3(0, 0, 0));
  static ONE = Object.freeze(new Vec3(1, 1, 1));
  static UP = Object.freeze(new Vec3(0, 1, 0));
  static DOWN = Object.freeze(new Vec3(0, -1, 0));
  static LEFT = Object.freeze(new Vec3(-1, 0, 0));
  static RIGHT = Object.freeze(new Vec3(1, 0, 0));
  static BACKWARD = Object.freeze(new Vec3(0, 0, -1));
  static FORWARD = Object.freeze(new Vec3(0, 0, 1));

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  get values() {
    return [this.x, this.y, this.z];
  }

  // Operations
  add = (other: Vec3) =>
    new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
  subtract = (other: Vec3) =>
    new Vec3(this.x - other.x, this.y - other.y, this.z - other.z);
  cross = (other: Vec3) =>
    new Vec3(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x
    );
  scale = (factor: number) =>
    new Vec3(this.x * factor, this.y * factor, this.z * factor);
  lerp = (target: Vec3, t: number, smoother?: (t: number) => number) =>
    new Vec3(
      lerp(this.x, target.x, t, smoother),
      lerp(this.y, target.y, t, smoother),
      lerp(this.z, target.z, t, smoother)
    );

  magnitude = () =>
    Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  normalize = () => {
    const magnitude = this.magnitude();
    return magnitude > 0.000001
      ? new Vec3(this.x / magnitude, this.y / magnitude, this.z / magnitude)
      : new Vec3(0, 0, 0);
  };

  // Utitlity
  toString = () => `Vec3(${this.x}, ${this.y}, ${this.z})`;
  toObject = () => ({ x: this.x, y: this.y, z: this.z });
}

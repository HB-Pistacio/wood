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

  // Operations
  add = (other: Vec3) =>
    new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
  subtract = (other: Vec3) =>
    new Vec3(this.x - other.x, this.y - other.y, this.z - other.z);

  // Utitlity
  toString = () => `Vec3(${this.x}, ${this.y}, ${this.z})`;
  toObject = () => ({ x: this.x, y: this.y, z: this.z });
}

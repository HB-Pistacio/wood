export class Vec2 {
  x: number;
  y: number;

  public static ZERO = Object.freeze(new Vec2(0, 0));
  public static ONE = Object.freeze(new Vec2(1, 1));
  public static UP = Object.freeze(new Vec2(0, 1));
  public static DOWN = Object.freeze(new Vec2(0, -1));
  public static LEFT = Object.freeze(new Vec2(-1, 0));
  public static RIGHT = Object.freeze(new Vec2(1, 0));

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  get values() {
    return [this.x, this.y];
  }

  // Operations
  add = (other: Vec2) => new Vec2(this.x + other.x, this.y + other.y);
  subtract = (other: Vec2) => new Vec2(this.x - other.x, this.y - other.y);

  get magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  get normalize() {
    const magnitude = this.magnitude;
    return magnitude > 0.000001
      ? new Vec2(this.x / magnitude, this.y / magnitude)
      : new Vec2(0, 0);
  }

  // Utitlity
  toString = () => `Vec2(${this.x}, ${this.y})`;
  toObject = () => ({ x: this.x, y: this.y });
}

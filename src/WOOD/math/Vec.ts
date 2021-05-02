import { lerp } from "./interpolation";

export class Vec {
  static ZERO = Object.freeze(new Vec([0, 0, 0]));
  static ONE = Object.freeze(new Vec([1, 1, 1]));
  static UP = Object.freeze(new Vec([0, 1, 0]));
  static DOWN = Object.freeze(new Vec([0, -1, 0]));
  static LEFT = Object.freeze(new Vec([-1, 0, 0]));
  static RIGHT = Object.freeze(new Vec([1, 0, 0]));
  static BACKWARD = Object.freeze(new Vec([0, 0, -1]));
  static FORWARD = Object.freeze(new Vec([0, 0, 1]));

  private values: Array<number>;

  constructor(values?: Iterable<number>) {
    this.values = values !== undefined ? [...values] : [0, 0, 0];
  }

  *[Symbol.iterator]() {
    yield* this.values;
  }

  get dimensions() {
    return this.values.length;
  }

  get x() {
    return this.values[0];
  }

  get y() {
    return this.values[1];
  }

  get z() {
    return this.values[2];
  }

  set x(value: number) {
    this.values[0] = value;
  }

  set y(value: number) {
    this.values[1] = value;
  }

  set z(value: number) {
    this.values[2] = value;
  }

  get xy() {
    return [this.values[0], this.values[1]];
  }

  get xyz() {
    return [this.values[0], this.values[1], this.values[2]];
  }

  get magnitude() {
    return Math.sqrt(
      this.values.map((v) => v * v).reduce((acc, v) => acc + v, 0)
    );
  }

  normalize = () => {
    const magnitude = this.magnitude;
    return magnitude > 0.000001
      ? new Vec(this.values.map((v) => v / magnitude))
      : new Vec(this.values.map(() => 0));
  };

  add = (other: Iterable<number>) => {
    const otherValues = [...other];
    return new Vec(this.values.map((v, i) => v + otherValues[i] ?? 0, 0));
  };

  subtract = (other: Iterable<number>) => {
    const otherValues = [...other];
    return new Vec(this.values.map((v, i) => v - otherValues[i] ?? 0, 0));
  };

  multiply = (other: Iterable<number>) => {
    const otherValues = [...other];
    return new Vec(this.values.map((v, i) => v * otherValues[i] ?? 1, 0));
  };

  scale = (factor: number) => {
    return new Vec(this.values.map((v) => v * factor, 0));
  };

  cross = (other: Iterable<number>) => {
    const otherValues = [...other];
    if (this.dimensions !== 3 || otherValues.length !== 3) {
      throw new Error(
        `Cannot compute cross product of vectors with dimensions '${this.dimensions}' and '${otherValues.length}'`
      );
    }

    return new Vec([
      this.values[1] * otherValues[2] - this.values[2] * otherValues[1],
      this.values[2] * otherValues[0] - this.values[0] * otherValues[2],
      this.values[0] * otherValues[1] - this.values[1] * otherValues[0],
    ]);
  };

  clamp = (mins: Iterable<number>, maxs: Iterable<number>) => {
    const minValues = [...mins];
    const maxValues = [...maxs];

    if (
      this.dimensions !== minValues.length ||
      this.dimensions !== maxValues.length
    ) {
      throw new Error(
        `Cannot clamp vector of dimensions '${this.dimensions}' between dimensions '${minValues.length}' and '${maxValues.length}'`
      );
    }

    return new Vec(
      this.values.map((v, i) =>
        Math.min(Math.max(v, minValues[i]), maxValues[i])
      )
    );
  };

  lerp = (
    target: Iterable<number>,
    t: number,
    smoother?: (t: number) => number
  ) => {
    const targetValues = [...target];
    if (this.dimensions !== targetValues.length) {
      throw new Error(
        `Cannot lerp vector of dimension '${this.dimensions}' towards vector of dimension '${targetValues.length}'`
      );
    }

    return new Vec(
      this.values.map((v, i) => lerp(v, targetValues[i], t, smoother))
    );
  };

  clamp01 = () => {
    return new Vec(this.values.map((v) => Math.min(Math.max(v, 0), 1)));
  };

  toString = () => `Vec${this.dimensions}(${this.values.join(", ")})`;
}

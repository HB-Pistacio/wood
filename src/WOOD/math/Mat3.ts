export class Mat3 {
  // prettier-ignore
  static IDENTITY = Object.freeze(new Mat3([
    1, 0, 0, 
    0, 1, 0, 
    0, 0, 1
  ]));

  static projection = (width: number, height: number) =>
    new Mat3([2.0 / width, 0, 0, 0, -2 / height, 0, -1, 1, 1]);

  values: ReadonlyArray<number>;

  constructor(values: ReadonlyArray<number>) {
    if (values.length !== 9)
      throw new Error(
        `Mat3 must be initialized with 3x3 values. Received '${values.length}'!`
      );
    this.values = values;
  }

  static multiply = (a: Mat3, b: Mat3) => {
    const _a = a.values;
    const _b = b.values;

    return new Mat3([
      _b[0 * 3 + 0] * _a[0 * 3 + 0] +
        _b[0 * 3 + 1] * _a[1 * 3 + 0] +
        _b[0 * 3 + 2] * _a[2 * 3 + 0],
      _b[0 * 3 + 0] * _a[0 * 3 + 1] +
        _b[0 * 3 + 1] * _a[1 * 3 + 1] +
        _b[0 * 3 + 2] * _a[2 * 3 + 1],
      _b[0 * 3 + 0] * _a[0 * 3 + 2] +
        _b[0 * 3 + 1] * _a[1 * 3 + 2] +
        _b[0 * 3 + 2] * _a[2 * 3 + 2],
      _b[1 * 3 + 0] * _a[0 * 3 + 0] +
        _b[1 * 3 + 1] * _a[1 * 3 + 0] +
        _b[1 * 3 + 2] * _a[2 * 3 + 0],
      _b[1 * 3 + 0] * _a[0 * 3 + 1] +
        _b[1 * 3 + 1] * _a[1 * 3 + 1] +
        _b[1 * 3 + 2] * _a[2 * 3 + 1],
      _b[1 * 3 + 0] * _a[0 * 3 + 2] +
        _b[1 * 3 + 1] * _a[1 * 3 + 2] +
        _b[1 * 3 + 2] * _a[2 * 3 + 2],
      _b[2 * 3 + 0] * _a[0 * 3 + 0] +
        _b[2 * 3 + 1] * _a[1 * 3 + 0] +
        _b[2 * 3 + 2] * _a[2 * 3 + 0],
      _b[2 * 3 + 0] * _a[0 * 3 + 1] +
        _b[2 * 3 + 1] * _a[1 * 3 + 1] +
        _b[2 * 3 + 2] * _a[2 * 3 + 1],
      _b[2 * 3 + 0] * _a[0 * 3 + 2] +
        _b[2 * 3 + 1] * _a[1 * 3 + 2] +
        _b[2 * 3 + 2] * _a[2 * 3 + 2],
    ]);
  };

  translate = (x: number, y: number) =>
    (this.values = Mat3.multiply(
      this,
      new Mat3([1, 0, 0, 0, 1, 0, x, y, 1])
    ).values);

  scale = (x: number, y: number) =>
    (this.values = Mat3.multiply(
      this,
      new Mat3([x, 0, 0, 0, y, 0, 0, 0, 1])
    ).values);

  rotate = (radians: number) => {
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);

    this.values = Mat3.multiply(
      this,
      new Mat3([cos, -sin, 0, sin, cos, 0, 0, 0, 1])
    ).values;
  };
}

export const lerp = (
  a: number,
  b: number,
  t: number,
  smoother: (t: number) => number = (t) => t
) => {
  if (t < 0 || t > 1) throw new Error(`t must be between 0 and 1. Got ${t}`);
  if (a === b) return a;
  const tSmooth = smoother(t);
  return (1 - tSmooth) * a + tSmooth * b;
};

export const smoothStep = (t: number) => t * t * (3 - 2 * t);

export const smoothDamp = (
  current: number,
  target: number,
  ref: { velocityRef: number },
  smoothTime: number,
  maxSpeed: number,
  deltaTime: number
) => {
  const _smoothTime = Math.max(0.0001, smoothTime);
  const num = 2 / _smoothTime;
  const num2 = num * deltaTime;
  const num3 = 1 / (1 + num2 + 0.48 * num2 * num2 + 0.235 * num2 * num2 * num2);
  let num4 = current - target;
  const num5 = target;
  const num6 = maxSpeed * _smoothTime;
  num4 = Math.min(Math.max(num4, -num6), num6);
  target = current - num4;
  const num7 = (ref.velocityRef + num * num4) * deltaTime;
  ref.velocityRef = (ref.velocityRef - num * num7) * num3;
  let num8 = target + (num4 + num7) * num3;

  if (num5 - current > 0 === num8 > num5) {
    num8 = num5;
    ref.velocityRef = (num8 - num5) / deltaTime;
  }

  return num8;
};

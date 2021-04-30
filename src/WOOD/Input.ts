import type { ButtonIdentifier, KeyIdentifier } from "./_internal/Input";
import { BUTTONS, KEYS, inputState } from "./_internal/Input";

export const isButtonPressed = (button: ButtonIdentifier) =>
  inputState.buttonsPressed.get(BUTTONS[button]) === true;

export const isKeyPressed = (key: KeyIdentifier) =>
  inputState.keysPressed.get(KEYS[key]) === true;

export const getMousePosition = () => ({
  x: inputState.mousePosition.x,
  y: inputState.mousePosition.y,
});

export const getMouseDelta = () => ({
  x: inputState.mouseDelta.x,
  y: inputState.mouseDelta.y,
});

export const getScroll = () => ({
  x: inputState.mouseScroll.x,
  y: inputState.mouseScroll.y,
});

const Axes = {
  horizontal: { negative: ["LEFT", "A"], positive: ["RIGHT", "D"] },
  vertical: { negative: ["DOWN", "S"], positive: ["UP", "W"] },
} as const;

export const getAxis = (axis: keyof typeof Axes) => {
  const { negative, positive } = Axes[axis];
  const negativePressed = negative.some(isKeyPressed);
  const positivePressed = positive.some(isKeyPressed);
  return negativePressed === positivePressed ? 0 : negativePressed ? -1 : 1;
};

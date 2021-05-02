import { Vec } from "../math/Vec";

export const KEYS = {
  BREAK: 3,
  DELETE: 8,
  TAB: 9,
  CLEAR: 12,
  ENTER: 13,
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  PAUSE: 19,
  CAPS_LOCK: 20,
  ESC: 27,
  SPACE: 32,
  PAGE_UP: 33,
  PAGE_DOWN: 34,
  END: 35,
  HOME: 36,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  "0": 48,
  "1": 49,
  "2": 50,
  "3": 51,
  "4": 52,
  "5": 53,
  "6": 54,
  "7": 55,
  "8": 56,
  "9": 57,
  COLON: 58,
  EQUALS: 59,
  LESS_THAN: 60,
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,
  META_LEFT: 91,
  META_RIGHT: 93,
  NUMPAD_0: 96,
  NUMPAD_1: 97,
  NUMPAD_2: 98,
  NUMPAD_3: 99,
  NUMPAD_4: 100,
  NUMPAD_5: 101,
  NUMPAD_6: 102,
  NUMPAD_7: 103,
  NUMPAD_8: 104,
  NUMPAD_9: 105,
  MULTIPLY: 106,
  ADD: 107,
  SUBTRACT: 109,
  DECIMAL_POINT: 110,
  DIVIDE: 111,
  F1: 112,
  F2: 113,
  F3: 114,
  F4: 115,
  F5: 116,
  F6: 117,
  F7: 118,
  F8: 119,
  F9: 120,
  F10: 121,
  F11: 122,
  F12: 123,
  F13: 124,
  F14: 125,
  F15: 126,
  F16: 127,
  F17: 128,
  F18: 129,
  F19: 130,
  F20: 131,
  F21: 132,
  F22: 133,
  F23: 134,
  F24: 135,
  F25: 136,
  F26: 137,
  F27: 138,
  F28: 139,
  F29: 140,
  F30: 141,
  F31: 142,
  F32: 143,
  NUMLOCK: 144,
  CARET: 160,
  EXCLAMATION: 161,
  HASH: 163,
  DOLLAR: 164,
  REFRESH: 168,
  TIMES: 170,
  TILDE: 171,
  DECREASE_VOLUME: 174,
  INCREASE_VOLUME: 175,
  NEXT: 176,
  PREVIOUS: 177,
  STOP: 178,
  PLAY: 179,
  SEMICOLON: 186,
  COMMA: 188,
  DASH: 189,
  PERIOD: 190,
  FORWARD_SLASH: 191,
  ACCENT: 192,
  QUESTION_MARK: 193,
  OPEN_BRACKET: 219,
  BACK_SLASH: 220,
  CLOSE_BRACKET: 221,
  SINGLE_QUOTE: 222,
} as const;

export const BUTTONS = {
  PRIMARY: 1,
  SECONDARY: 2,
  MOUSE3: 4,
  BACK: 8,
  FORWARD: 16,
} as const;

type KeyCode = typeof KEYS[keyof typeof KEYS];
type ButtonCode = typeof BUTTONS[keyof typeof BUTTONS];
export const inputState = {
  keysPressed: new Map<KeyCode, boolean>(),
  buttonsPressed: new Map<ButtonCode, boolean>(),
  mouseDelta: new Vec([0, 0]),
  mousePosition: new Vec([0, 0]),
  mouseScroll: new Vec([0, 0]),
};

export type KeyIdentifier = keyof typeof KEYS;
export type ButtonIdentifier = keyof typeof BUTTONS;

const keydown = (e: KeyboardEvent) =>
  inputState.keysPressed.set(e.keyCode as KeyCode, true);

const keyup = (e: KeyboardEvent) =>
  inputState.keysPressed.set(e.keyCode as KeyCode, false);

const mousedown = (e: MouseEvent) =>
  inputState.buttonsPressed.set(e.button as ButtonCode, true);

const mouseup = (e: MouseEvent) =>
  inputState.buttonsPressed.set(e.button as ButtonCode, false);

const wheel = (e: WheelEvent) => {
  e.preventDefault();
  inputState.mouseScroll = new Vec([e.deltaX, e.deltaY]);
};

const makeMousemove = (canvas: HTMLCanvasElement) => (e: MouseEvent) => {
  const rect = canvas.getBoundingClientRect();
  inputState.mousePosition = new Vec([
    e.clientX - rect.left,
    e.clientY - rect.top,
  ]);
  inputState.mouseDelta = new Vec([e.movementX, e.movementY]);
};

export const attachInputToCanvas = (canvas: HTMLCanvasElement) => {
  canvas.tabIndex = 1;
  canvas.style.outline = "none";

  const mousemove = makeMousemove(canvas);
  canvas.addEventListener("keydown", keydown);
  canvas.addEventListener("keyup", keyup);
  canvas.addEventListener("mousedown", mousedown);
  canvas.addEventListener("mouseup", mouseup);
  canvas.addEventListener("wheel", wheel, { passive: false });
  canvas.addEventListener("mousemove", mousemove);

  // Return detach function
  return () => {
    canvas.removeEventListener("keydown", keydown);
    canvas.removeEventListener("keyup", keyup);
    canvas.removeEventListener("mousedown", mousedown);
    canvas.removeEventListener("mouseup", mouseup);
    canvas.removeEventListener("wheel", wheel);
    canvas.removeEventListener("mousemove", mousemove);
  };
};

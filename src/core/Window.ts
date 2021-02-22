import type { Scene } from "./Scene";

export class Window {
  running: boolean = false;
  canvas: HTMLCanvasElement;
  gl: WebGL2RenderingContext;
  scene: Scene | undefined;

  _then: number;

  constructor(canvasQuery: string) {
    const canvas = document.querySelector(
      canvasQuery
    ) as HTMLCanvasElement | null;
    if (canvas === null) throw Error("No wood root!");
    this.canvas = canvas;

    const gl = canvas.getContext("webgl2");
    if (gl === null) throw Error("No WebGL2!");
    this.gl = gl;

    this._then = -1;
  }

  load = (scene: Scene) => {
    this.scene = scene;
  };

  start = () => {
    this.running = true;
    console.log("starting window");
    requestAnimationFrame(this._step);
  };

  stop = () => {
    this.running = false;
  };

  _resizeCanvasToDisplaySize = () => {
    const dpr = window.devicePixelRatio;
    const { width, height } = this.canvas.getBoundingClientRect();
    const displayWidth = Math.round(width * dpr);
    const displayHeight = Math.round(height * dpr);

    const needResize =
      this.canvas.width !== displayWidth ||
      this.canvas.height !== displayHeight;

    if (needResize) {
      this.canvas.width = displayWidth;
      this.canvas.height = displayHeight;
    }

    return needResize;
  };

  _clear = (r: number, g: number, b: number, a: number) => {
    this.gl.clearColor(r, g, b, a);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  };

  _step = (now: number) => {
    // Resize canvas
    this._resizeCanvasToDisplaySize();
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    // Clear to white
    this._clear(1, 1, 1, 1);

    if (this.scene !== undefined) {
      this.scene.update(now - this._then);
    }

    // Request next animation frame
    this._then = now;
    if (this.running) {
      requestAnimationFrame(this._step);
    }
  };
}

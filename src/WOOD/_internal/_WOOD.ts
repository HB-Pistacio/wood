import type { Scene } from "../Scene";
import { attachInputToCanvas } from "./Input";
import { WOODInitError } from "./Errors";
import { loadShader, getShader, getTexture } from "./AssetManager";

import { Vec } from "../math/Vec";
import type { Mat4 } from "../math/Mat4";

import { LOAD_WOOD_SHADERS } from "./shaders";

export class _WOOD {
  running: boolean = false;
  scene: Scene | undefined;
  private _canvas: HTMLCanvasElement | undefined;
  private _gl: WebGL2RenderingContext | undefined;
  private detachInput: () => void = () => {};
  private then: number = -1;

  attachTo = (canvasQuery: string) => {
    const canvas = document.querySelector(
      canvasQuery
    ) as HTMLCanvasElement | null;
    if (canvas === null)
      throw Error(`Could not find canvas with query: '${canvasQuery}' `);
    this._canvas = canvas;

    const _gl = canvas.getContext("webgl2");
    if (_gl === null)
      throw Error(`Could not instantiate WebGL2RenderingContext`);
    this._gl = _gl;

    this.detachInput = attachInputToCanvas(canvas);

    LOAD_WOOD_SHADERS();
  };

  detach = () => {
    this.stop();
    this._canvas = undefined;
    this._gl = undefined;
    this.detachInput();
  };

  loadShader = loadShader;
  getShader = getShader;
  getTexture = getTexture;

  get gl(): WebGL2RenderingContext {
    if (this._gl === undefined) throw new WOODInitError();
    return this._gl!;
  }

  get canvas(): HTMLCanvasElement {
    if (this._canvas === undefined) throw new WOODInitError();
    return this._canvas!;
  }

  get windowSize(): Vec {
    if (this._canvas === undefined) throw new WOODInitError();
    return new Vec([this.canvas.clientWidth, this.canvas.clientHeight]);
  }

  get projection(): Mat4 {
    if (this.scene === undefined) throw new WOODInitError();
    return this.scene.camera.projection;
  }

  get view(): Mat4 {
    if (this.scene === undefined) throw new WOODInitError();
    return this.scene.camera.viewMatrix;
  }

  load = (scene: Scene) => {
    this.scene = scene;
  };

  start = () => {
    this.running = true;
    if (this.scene !== undefined) this.scene.start();
    requestAnimationFrame(this._step);
  };

  stop = () => {
    this.running = false;
  };

  _resizeCanvasToDisplaySize = () => {
    const dpr = window.devicePixelRatio;
    const { width, height } = this._canvas!.getBoundingClientRect();
    const displayWidth = Math.round(width * dpr);
    const displayHeight = Math.round(height * dpr);

    const needResize =
      this._canvas!.width !== displayWidth ||
      this._canvas!.height !== displayHeight;

    if (needResize) {
      this._canvas!.width = displayWidth;
      this._canvas!.height = displayHeight;
    }

    return needResize;
  };

  _clear = (r: number, g: number, b: number, a: number) => {
    this._gl!.clearColor(r, g, b, a);
    this._gl!.clear(this._gl!.COLOR_BUFFER_BIT | this._gl!.DEPTH_BUFFER_BIT);
  };

  _step = (now: number) => {
    // Resize canvas
    this._resizeCanvasToDisplaySize();
    this._gl!.viewport(0, 0, this._gl!.canvas.width, this._gl!.canvas.height);

    this._clear(1, 1, 1, 1); // Clear to white
    this._gl!.enable(this._gl!.DEPTH_TEST); // turn on depth testing
    this._gl!.enable(this._gl!.CULL_FACE); // tell webgl to cull faces

    if (this.scene !== undefined) {
      this.scene.update(now - this.then);
    }

    // Request next animation frame
    this.then = now;
    if (this.running) {
      requestAnimationFrame(this._step);
    }
  };
}

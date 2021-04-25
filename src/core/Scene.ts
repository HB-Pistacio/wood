import { Camera, CameraFixedToCanvas } from "./Camera";
import type { GameObject } from "./GameObject";

export class Scene {
  gl: WebGL2RenderingContext;
  camera: Camera;
  gameObjects: Map<string, GameObject> = new Map();

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.camera = new CameraFixedToCanvas(this.gl);
  }

  spawn = (gameObject: GameObject) =>
    this.gameObjects.set(gameObject.id, gameObject);

  destroy = (gameObject: GameObject) => {
    gameObject.destroy();
    this.gameObjects.delete(gameObject.id);
  };

  start = () => {
    for (const gameObject of this.gameObjects.values()) {
      gameObject.start();
    }
  };

  update = (deltaTime: number) => {
    for (const gameObject of this.gameObjects.values()) {
      gameObject.update(
        deltaTime,
        this.camera.projection,
        this.camera.viewMatrix
      );
    }
  };
}

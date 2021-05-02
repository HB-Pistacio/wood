import { Camera, CameraFixedToCanvas } from "./Camera";
import type { GameObject } from "./GameObject";

export class Scene {
  camera: Camera;
  gameObjects: Map<string, GameObject> = new Map();

  constructor() {
    this.camera = new CameraFixedToCanvas();
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
      gameObject.update(deltaTime);
    }
  };
}

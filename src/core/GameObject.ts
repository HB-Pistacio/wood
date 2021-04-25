import type { Component } from "./Components";
import { Transform } from "./Components/Transform";
import type { Mat4 } from "./math/Mat4";
import type { Vec3 } from "./math/Vec3";

let idNum = 0;

export class GameObject {
  id: string;
  transform: Transform;
  private components: Map<string, Component> = new Map();

  constructor(
    id?: string,
    transform?: {
      position?: Vec3;
      scale?: Vec3;
      rotation?: Vec3;
    }
  ) {
    this.id = id ?? `obj-${idNum++}`;
    this.transform = new Transform(transform);
  }

  get = (component: typeof Component) => this.components.get(component.name);
  has = (component: typeof Component) => this.components.has(component.name);

  addComponent = (component: Component): void => {
    component.gameObject = this;
    this.components.set(component.constructor.name, component);
  };

  removeComponent = (component: typeof Component) => {
    const comp = this.components.get(component.name);
    if (comp !== undefined) comp.gameObject = undefined;
    this.components.delete(component.name);
  };

  destroy = () => {
    for (const component of this.components.values()) {
      component.gameObject = undefined;
    }

    this.components.clear();
  };

  start = () => {
    for (const component of this.components.values()) {
      component.start();
    }
  };

  update = (deltaTime: number, projection: Mat4, view: Mat4) => {
    for (const component of this.components.values()) {
      component.update(deltaTime, projection, view);
    }
  };
}

import { Vec } from "./math/Vec";

export abstract class Component {
  gameObject: GameObject | undefined = undefined;
  start: () => void = () => {};
  update: (deltaTime: number) => void = () => {};
}

let idNum = 0;
export class GameObject {
  id: string;
  transform: Transform;
  private components: Map<string, Component> = new Map();

  constructor(
    id?: string,
    transform?: {
      position?: Vec;
      scale?: Vec;
      rotation?: Vec;
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

  update = (deltaTime: number) => {
    for (const component of this.components.values()) {
      component.update(deltaTime);
    }
  };
}

class Transform {
  position: Vec;
  scale: Vec;
  rotation: Vec;

  constructor(args?: { position?: Vec; scale?: Vec; rotation?: Vec }) {
    this.position = args?.position ?? new Vec([0, 0, 0]);
    this.scale = args?.scale ?? new Vec([1, 1, 1]);
    this.rotation = args?.rotation ?? new Vec([0, 0, 0]);
  }

  translate = (amount: Vec) => {
    this.position = this.position.add(amount);
  };

  scaleBy = (amount: Vec) => {
    this.scale = this.scale.add(amount);
  };

  rotate = (amount: Vec) => {
    this.rotation = this.rotation.add(amount);
  };
}

import { Component } from "../_internal/Component";
import { Vec } from "../math/Vec";

export class Transform extends Component {
  position: Vec;
  scale: Vec;
  rotation: Vec;

  constructor(args?: { position?: Vec; scale?: Vec; rotation?: Vec }) {
    super();
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

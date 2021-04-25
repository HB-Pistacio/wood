import { Component } from "./index";
import { Vec3 } from "../math/Vec3";

export class Transform extends Component {
  position: Vec3;
  scale: Vec3;
  rotation: Vec3;

  constructor(args?: { position?: Vec3; scale?: Vec3; rotation?: Vec3 }) {
    super();
    this.position = args?.position ?? new Vec3(0, 0, 0);
    this.scale = args?.scale ?? new Vec3(1, 1, 1);
    this.rotation = args?.rotation ?? new Vec3(0, 0, 0);
  }

  translate = (amount: Vec3) => {
    this.position = this.position.add(amount);
  };

  scaleBy = (amount: Vec3) => {
    this.scale = this.scale.add(amount);
  };

  rotate = (amount: Vec3) => {
    this.rotation = this.rotation.add(amount);
  };
}

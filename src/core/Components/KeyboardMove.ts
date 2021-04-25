import { Component } from "./index";
import * as Input from "../../core/Input";
import { Vec2 } from "../math/Vec2";
import { Vec3 } from "../math/Vec3";

export class KeyboardMove extends Component {
  speed: number = 5;
  targetVelocity: Vec2 = new Vec2(0, 0);
  velocity: Vec2 = new Vec2(0, 0);

  update = (deltaTime: number) => {
    const direction = new Vec2(
      Input.isKeyPressed("A") ? -1 : Input.isKeyPressed("D") ? 1 : 0,
      Input.isKeyPressed("S") ? 1 : Input.isKeyPressed("W") ? -1 : 0
    );

    this.targetVelocity = direction.scale(this.speed / 10);
    this.velocity = this.velocity.lerp(this.targetVelocity, 0.1);
    this.gameObject!.transform.translate(
      new Vec3(this.velocity.x, this.velocity.y, 0).scale(deltaTime)
    );
  };
}

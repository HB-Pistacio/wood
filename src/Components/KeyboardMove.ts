import { WOOD_Component, Vec2, Vec3, Input } from "../WOOD";

export class KeyboardMove extends WOOD_Component {
  speed: number = 5;
  targetVelocity: Vec2 = new Vec2(0, 0);
  velocity: Vec2 = new Vec2(0, 0);

  update = (deltaTime: number) => {
    const direction = new Vec2(
      Input.getAxis("horizontal"),
      Input.getAxis("vertical")
    ).normalize;

    this.targetVelocity = direction.scale(this.speed / 10);
    this.velocity = this.velocity.lerp(this.targetVelocity, 0.1);
    this.gameObject!.transform.translate(
      new Vec3(this.velocity.x, this.velocity.y, 0).scale(deltaTime)
    );
  };
}

import { WOOD_Component, Vec2, Vec3, Input, WOOD } from "../WOOD";

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

    const targetPosition = this.gameObject!.transform.position.add(
      new Vec3(this.velocity.x, this.velocity.y, 0).scale(deltaTime)
    );

    const halfScreen = WOOD.windowSize.scale(0.5);
    this.gameObject!.transform.position = targetPosition.clamp(
      new Vec3(-halfScreen.x, -halfScreen.y, targetPosition.z),
      new Vec3(halfScreen.x, halfScreen.y, targetPosition.z)
    );
  };
}

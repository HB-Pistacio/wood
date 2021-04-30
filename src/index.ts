import { WOOD } from "./WOOD";
import { GameObject } from "./WOOD/GameObject";
import { Scene } from "./WOOD/Scene";
import { Vec3 } from "./WOOD/math/Vec3";
import { F } from "./WOOD/Components/F";
import { KeyboardMove } from "./WOOD/Components/KeyboardMove";
import { Sprite } from "./WOOD/Components/Sprite";
import { Vec2 } from "./WOOD/math/Vec2";

WOOD.attachTo("#wood-root");

const spriteGO = new GameObject("Morio", {
  position: new Vec3(0, 0, 0),
  scale: new Vec3(1, 1, 0),
});

spriteGO.addComponent(
  new Sprite("https://webgl2fundamentals.org/webgl/resources/star.jpg")
);

spriteGO.addComponent(new KeyboardMove());

// const player = new GameObject("player", { position: new Vec3(10, 10, -100) });
// player.addComponent(new F());
// player.addComponent(new KeyboardMove());

const scene = new Scene();
WOOD.load(scene);
WOOD.start();

// scene.spawn(player);
scene.spawn(spriteGO);

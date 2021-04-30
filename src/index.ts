import { WOOD, Scene, GameObject, Vec3, Sprite } from "./WOOD";
import { KeyboardMove } from "./Components/KeyboardMove";
import { F } from "./Components/F";

WOOD.attachTo("#wood-root");

const spriteGO = new GameObject("Morio");

spriteGO.addComponent(
  new Sprite("https://webgl2fundamentals.org/webgl/resources/star.jpg")
);

spriteGO.addComponent(new KeyboardMove());

const player = new GameObject("player", {
  position: new Vec3(200, 10, -100),
  scale: new Vec3(1, 2, 1),
});
player.addComponent(new F());
player.addComponent(new KeyboardMove());

const scene = new Scene();
WOOD.load(scene);
WOOD.start();

scene.spawn(player);
scene.spawn(spriteGO);

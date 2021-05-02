import { WOOD, Scene, GameObject, Sprite, Vec } from "./WOOD";
import { KeyboardMove } from "./Components/KeyboardMove";
import { F } from "./Components/F";

WOOD.attachTo("#wood-root");

const sprite1 = new GameObject("sprite1");
sprite1.addComponent(
  new Sprite("https://webgl2fundamentals.org/webgl/resources/star.jpg")
);
sprite1.addComponent(new KeyboardMove());

const player = new GameObject("player", {
  position: new Vec([200, 10, -100]),
  scale: new Vec([1, 2, 1]),
});
player.addComponent(new F());
player.addComponent(new KeyboardMove());

const sprite2 = new GameObject("sprite2");
sprite2.addComponent(
  new Sprite("https://webgl2fundamentals.org/webgl/resources/star.jpg", {
    size: new Vec([150, 150]),
  })
);

const scene = new Scene();
WOOD.load(scene);
WOOD.start();

scene.spawn(player);
scene.spawn(sprite1);
scene.spawn(sprite2);

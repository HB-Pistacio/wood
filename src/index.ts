import { WOOD } from "./WOOD";
import { GameObject } from "./WOOD/GameObject";
import { Scene } from "./WOOD/Scene";
import { Vec3 } from "./WOOD/math/Vec3";
import { F } from "./WOOD/Components/F";
import { KeyboardMove } from "./WOOD/Components/KeyboardMove";

WOOD.attachTo("#wood-root");

const player = new GameObject("player", { position: new Vec3(10, 10, 0) });
player.addComponent(new F());
player.addComponent(new KeyboardMove());

const scene = new Scene();
WOOD.load(scene);
WOOD.start();

scene.spawn(player);

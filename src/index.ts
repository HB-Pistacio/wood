import { GameObject } from "./core/GameObject";
import { Scene } from "./core/Scene";
import { Vec3 } from "./core/math/Vec3";
import { F } from "./core/Components/F";
import { KeyboardMove } from "./core/Components/KeyboardMove";
import { WOOD } from "./core";

WOOD.attachTo("#wood-root");

const player = new GameObject("player", { position: new Vec3(10, 10, 0) });
player.addComponent(new F());
player.addComponent(new KeyboardMove());

const scene = new Scene();
WOOD.load(scene);
WOOD.start();

scene.spawn(player);

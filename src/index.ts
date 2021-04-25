import { GameObject } from "./core/GameObject";
import * as Input from "./core/Input";
import { Scene } from "./core/Scene";
import { Window } from "./core/Window";
import { Vec3 } from "./core/math/Vec3";
import { F } from "./core/Components/F";

const window = new Window("#wood-root");
const scene = new Scene(window.gl);

Input.attachTo(window);

const player = new GameObject("player", { position: new Vec3(10, 10, 0) });
player.addComponent(new F(window.gl));

window.load(scene);
window.start();
scene.spawn(player);

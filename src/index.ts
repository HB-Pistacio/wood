import * as Input from "./core/Input";
import { Scene } from "./core/Scene";
import { Window } from "./core/Window";

const window = new Window("#wood-root");
const scene = new Scene(window.gl);

Input.attachTo(window);

window.load(scene);
window.start();

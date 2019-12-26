import { SceneBase } from "./SceneBase";
import { CameraController } from "../Services/CameraController";
import { KeyController } from "../Services/KeyController";
import { Sun } from "../Objects/Sun";
import { Cube } from "../Objects/Cube";
import { Skybox } from "../Objects/Skybox";

export class TestScene extends SceneBase {
	public Iterate(keyController: KeyController, Step: number): void {
		this.Meshes.forEach(element => {
			try {
				element.Collide(this.CollideMeshes)
				element.Interval(keyController, Step);
			}
			catch {}
		});
	}

	constructor(
		protected Camera: CameraController,
		keyController: KeyController
	) {
		super(Camera);
		this.Add(new Sun(this.Scene, 0, 80, 0));
		this.Add(new Cube(1000, 1, 1000, 0, -2, 0));
		this.Add(new Skybox(this.Camera));
	}
}
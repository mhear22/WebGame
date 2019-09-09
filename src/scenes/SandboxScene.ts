import { SceneBase } from "./sceneBase";
import { KeyController } from "../Services/KeyController";
import { CameraController } from "../Services/CameraController";
import { Sun } from "../Objects/Sun";
import { Cube } from "../Objects/Cube";

export class SandboxScene extends SceneBase {
	
	constructor(
		protected Camera: CameraController,
		keyController: KeyController
	){
		super(Camera);
		this.Add(new Sun(this.Scene, 0, 80, 0));
		this.Add(new Cube(100, 1, 100, -50, -1, -50));
	}
	
	public Iterate(keyController: KeyController, Step: number): void {
	}
	
}
import { SceneBase } from "./SceneBase";
import { KeyController } from "../Services/KeyController";
import { CameraController } from "../Services/CameraController";
import { Sun } from "../Objects/Sun";
import { Cube } from "../Objects/Cube";
import { Skybox } from "../Objects/Skybox";
import { FileAsset } from "../Objects/FileAsset";
import { CarModel } from "../Models/Car/Car";
import { CubeModel } from "../Models/Cube/Cube";

export class SandboxScene extends SceneBase {
	
	constructor(
		protected Camera: CameraController,
		keyController: KeyController
	){
		super(Camera);
		this.Add(new Sun(this.Scene, 0, 80, 0));
		this.Add(new Cube(10000, 1, 10000, 0, -1, 0));
		this.Add(new Skybox(this.Camera));
		this.Add(new CarModel(keyController,this.Camera));
		//this.Add(new CubeModel());
	}
	
	public Iterate(keyController: KeyController, Step: number): void {
		this.Meshes.forEach(element => {
			element.Interval(keyController, Step);
		});
	}
	
}
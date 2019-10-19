import { SceneBase } from "./SceneBase";
import { KeyController } from "../Services/KeyController";
import { CameraController } from "../Services/CameraController";
import { Sun } from "../Objects/Sun";
import { Cube } from "../Objects/Cube";
import { Skybox } from "../Objects/Skybox";
import { FileAsset } from "../Objects/FileAsset";
import { CarModel } from "../Models/Car/Car";
import { CubeModel } from "../Models/Cube/Cube";
import { BuildingModel } from "../Models/Building/building";
import * as three from "three"
import { BoxModel } from "../Models/Box/box";


export class SandboxScene extends SceneBase {
	
	constructor(
		protected Camera: CameraController,
		keyController: KeyController
	){
		super(Camera);
		//this.Scene.add(new three.AmbientLight(0x404040))
		this.Add(new Sun(this.Scene, 0, 80, 0));
		this.Add(new Cube(1000, 1, 1000, 0, -2, 0));
		this.Add(new Skybox(this.Camera));
		this.Add(new CarModel(keyController,this.Camera, new three.Vector3(-20,0,-30), 1.53));
		//this.Add(new BuildingModel(0,-30));
		this.Add(new BoxModel(10, new three.Vector3(-10,0,-20)))
	}
	
	public Iterate(keyController: KeyController, Step: number): void {
		this.Meshes.forEach(element => {
			try {
				element.Collide(this.CollideMeshes)
				element.Interval(keyController, Step);
			}
			catch {}
		});
	}
}
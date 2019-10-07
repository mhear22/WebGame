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


export class SandboxScene extends SceneBase {
	
	constructor(
		protected Camera: CameraController,
		keyController: KeyController
	){
		super(Camera);
		this.Add(new Sun(this.Scene, 0, 80, 0));
		this.Add(new Cube(1000, 1, 1000, 0, -1, 0));
		this.Add(new Skybox(this.Camera));
		this.Add(new CarModel(keyController,this.Camera));
		this.Add(new BuildingModel(0,-20));
		//this.Add(new CubeModel());
	}
	
	public Iterate(keyController: KeyController, Step: number): void {
		this.Meshes.forEach(element => {
			try {
				element.Interval(keyController, Step);
			}
			catch {}
			
			if(element instanceof BuildingModel) {
				this.Meshes.forEach(target => {
					if(target instanceof CarModel) {
						var mesh = (element.Element as three.Mesh);
						//Work out collision detection
						//https://github.com/josdirksen/threejs-cookbook/blob/master/07-animations-physics/07.06-add-simple-detection-collision.html
					}
				})
			}
		});
	}
}
import { SceneBase } from "./SceneBase";
import { CameraController } from "../Services/CameraController";
import { Cube } from "../Objects/Cube";
import * as three from "three";
import { PhysicsCube } from "../Objects/PhysicsCube";
import { Sun } from "../Objects/Sun";
import { Plane } from "../Objects/Plane";
import { Vector3 } from "three";

export class TempScene extends SceneBase {

	constructor(protected Camera: CameraController) {
		super(Camera);
		this.Add(new Plane(-9));
		var pos = Camera.camera.position;
		this.Add(new PhysicsCube(2, 2, 2, pos.x, 20, pos.z - 20));
		this.Add(new Sun(this.Scene, 0, 20, 0))
		this.Add(new Sun(this.Scene, 100, 20, 0))
		this.Add(new Sun(this.Scene, 0, 20, 100))
	}

	private SpaceLimiter: number = 0;
	public Iterate(KeyMap: any, Step: number): void {

		if (KeyMap[" "]) {
			if (this.SpaceLimiter > 0) {
				this.SpaceLimiter = -100;
				var pos = this.Camera.camera.position;
				var vec = new Vector3(0,0,-10);
				vec.applyAxisAngle(this.Camera.camera.up,this.Camera.RotationY);
				var loc = new Vector3(pos.x, pos.y, pos.z).add(vec);
				this.Add(new PhysicsCube(2,2,2,loc.x, 1, loc.z));
			}
			else {
				this.SpaceLimiter += Step * 100;
			}
		}
		else if (KeyMap["L"]) {
			
		}
		
		
		this.Meshes.forEach(x => {
			x.Interval(KeyMap, Step);
		});
	}
}
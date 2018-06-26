import { SceneBase } from "./SceneBase";
import { CameraController } from "../Services/CameraController";
import { Cube } from "../Objects/Cube";
import * as three from "three";
import { PhysicsCube } from "../Objects/PhysicsCube";
import { PlaneMapper } from "../Services/Plane";
import { Sun } from "../Objects/Sun";

export class TempScene extends SceneBase {

	constructor(protected Camera: CameraController) {
		super(Camera);
		var plane = new PlaneMapper(this.Camera, this.Scene);
		var pos = Camera.camera.position;
		this.SpawnCube(pos);
		this.drawLight();
	}
	
	private drawLight() {
		this.Meshes.push(new Sun(this.Scene, 0, 20, 0))
	}

	public LoadMeshes(): void {
		this.Meshes.forEach(x => {
			this.Scene.add(x.Element);
		});
	}

	private SpaceLimiter: number = 0;
	public Iterate(KeyMap: any, Step: number): void {

		if (KeyMap[" "]) {

			if (this.SpaceLimiter > 0) {
				this.SpaceLimiter = -100;
				var pos = this.Camera.camera.position;
				this.SpawnCube(pos);
			}
			else {
				this.SpaceLimiter += Step * 100;
			}
		}
		this.Meshes.forEach(x => {
			x.Interval(KeyMap, Step);
		});
	}

	private SpawnCube(pos:three.Vector3) {
		var nuCube = new PhysicsCube(2, 2, 2, pos.x, 20, pos.z - 20);
		this.Meshes.push(nuCube);
		this.Scene.add(nuCube.Element);
	}
}
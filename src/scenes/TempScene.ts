import { SceneBase } from "./SceneBase";
import { CameraController } from "../Services/CameraController";
import { Cube } from "../Objects/Cube";
import * as three from "three";
import { PhysicsCube } from "../Objects/PhysicsCube";
import { PlaneMapper } from "../Services/Plane";

export class TempScene extends SceneBase {

	constructor(protected Camera: CameraController) {
		super(Camera);
		var plane = new PlaneMapper(this.Camera, this.Scene);
		var pos = Camera.camera.position;
		this.SpawnCube(pos);
		this.drawLight();
	}
	private light:three.PointLight;
	
	private drawLight() {
		this.light = new three.PointLight(0xffffff, 1, 1000, 0);
		var pos = this.Camera.camera.position
		this.light.position.y = 20;
		this.light.castShadow = true;
		this.light.shadowCameraFar = 10000;
		this.light.shadowCameraNear = 1;
		this.light.shadowMapHeight = 2048;
		this.light.shadowMapWidth = 2048;
		
		this.Scene.add(this.light);
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
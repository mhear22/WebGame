import { SceneBase } from "./sceneBase";
import { CameraController } from "../Services/CameraController";
import { Cube } from "../objects/Cube";
import * as three from "three";
import { PathMapper } from "../Services/PathMapper";
import { Path } from "three";
import { Asset } from "../objects/asset";
import { PhysicsCube } from "../objects/PhysicsCube";

export class TempScene extends SceneBase {
	private pathMapper: PathMapper;

	constructor(protected Camera: CameraController) {
		super(Camera);
		this.pathMapper = new PathMapper(Camera, this.Meshes, this.Scene);
		var pos = Camera.camera.position;
		this.SpawnCube(pos);
	}

	public LoadMeshes(): void {
		this.Meshes.push(new Cube(10, 2, 10, 0, -10, 0));
		this.Meshes.forEach(x => {
			this.Scene.add(x.Element);
		});
	}

	private SpaceLimiter: number = 0;
	public Iterate(KeyMap: any, Step: number): void {
		this.pathMapper.Iterate(Step);

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
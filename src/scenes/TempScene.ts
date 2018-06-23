import { SceneBase } from "./sceneBase";
import { CameraController } from "../parts/Service/CameraController";
import { Cube } from "../objects/Cube";
import * as three from "three";
import { PathMapper } from "../parts/Service/PathMapper";
import { Path } from "three";
import { Asset } from "../objects/asset";
import { PhysicsCube } from "../objects/PhysicsCube";

export class TempScene extends SceneBase {
	private pathMapper:PathMapper;
	
	constructor(protected Camera:CameraController, protected KeyMap:any) {
		super(Camera, KeyMap);
		this.pathMapper = new PathMapper(Camera, this.Meshes, this.Scene);
	}
	
	public LoadMeshes():void {
		this.Meshes.push(new Cube(10, 2, 10,0,-10,0));
		this.Meshes.forEach(x => {
			this.Scene.add(x.Element);
		});
	}
	
	private SpaceLimiter:number = 0;
	public Iterate(Step:number):void {
		this.pathMapper.Iterate(Step);
		
		
		if (this.KeyMap[" "]) {
			if(this.SpaceLimiter>100) {
				this.SpaceLimiter = 0;
				var pos = this.Camera.camera.position;
				var nuCube = new PhysicsCube(2,2,2,pos.x,20,pos.z);
				this.Meshes.push(nuCube);
				this.Scene.add(nuCube.Element);
			}
			else {
				this.SpaceLimiter += Step*100;
			}
			
		}
		this.Meshes.forEach(x => {
			x.Interval(this.KeyMap, Step);
		});
	}
}
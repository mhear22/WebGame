import { SceneBase } from "./sceneBase";
import { CameraController } from "../parts/Service/Camera";
import { Cube } from "../objects/Cube";
import * as three from "three";

export class TempScene extends SceneBase {
	constructor(protected Camera:CameraController, protected KeyMap:any) {
		super(Camera, KeyMap);
	}
	
	public LoadMeshes():void {
		this.Meshes.push(new Cube(2, 2, 2,0,0,10));
		this.Meshes.push(new Cube(2, 2, 2,0,0,-10));
		this.Meshes.push(new Cube(2, 2, 2,0,10,0));
		this.Meshes.push(new Cube(2, 2, 2,0,-10,0));
		this.Meshes.push(new Cube(2, 2, 2,10,0,0));
		this.Meshes.push(new Cube(2, 2, 2,-10,0,0));
		
		this.Meshes.forEach(x => {
			this.Scene.add(x.Element);
		});
	}
	
	public Iterate(Step:Number):void {
		if (this.KeyMap[" "]) {
			var nuCube = new Cube();
			this.Meshes.push(nuCube);
			this.Scene.add(nuCube.Element);
		}
		this.Meshes.forEach(x => {
			x.Interval(this.KeyMap, Step);
		});
	}
}
import { SceneBase } from "./sceneBase";
import { CameraController } from "../parts/Service/Camera";
import { Cube } from "../objects/Cube";
import * as three from "three";
import { PathMapper } from "../parts/Service/PathMapper";
import { Path } from "three";
import { Asset } from "../objects/asset";

export class TempScene extends SceneBase {
	private pathMapper:PathMapper;
	
	constructor(protected Camera:CameraController, protected KeyMap:any) {
		super(Camera, KeyMap);
		this.pathMapper = new PathMapper(Camera, this.Meshes, this.Scene);
	}
	
	public LoadMeshes():void {
		//this.Meshes.push(new Cube(2, 2, 2,0,0,10));
		//this.Meshes.push(new Cube(2, 2, 2,0,0,-10));
		//this.Meshes.push(new Cube(2, 2, 2,0,10,0));
		this.Meshes.push(new Cube(10, 2, 10,0,-10,0));
		//this.Meshes.push(new Cube(2, 2, 2,10,0,0));
		//this.Meshes.push(new Cube(2, 2, 2,-10,0,0));
		
		this.Meshes.forEach(x => {
			this.Scene.add(x.Element);
		});
	}
	
	public Iterate(Step:Number):void {
		//if(this.KeyMap["1"])
		this.pathMapper.Iterate(Step);
		
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
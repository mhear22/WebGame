import { CameraController } from "../parts/Service/Camera";
import * as three from "three";
import { Asset } from "../objects/asset";

export abstract class SceneBase {
	constructor(protected Camera:CameraController, KeyMap:any) {
		this.Scene = new three.Scene();
		this.KeyMap = KeyMap;
	}
	
	protected KeyMap:any;
	protected Scene:three.Scene;
	protected Meshes:Asset[] = [];
	
	public abstract LoadMeshes():void;
	public abstract Iterate(Step:number):void;
	
	public GetScene():three.Scene{
		return this.Scene;
	}
}
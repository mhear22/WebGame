import { CameraController } from "../Services/CameraController";
import * as three from "three";
import { Asset } from "../Objects/Asset";
import { KeyController } from "../Services/KeyController";
import { Object3D } from "three";

export abstract class SceneBase {
	constructor(protected Camera:CameraController) {
		this.Scene = new three.Scene();
	}
	
	public InteractionText:string;
	
	protected Scene:three.Scene;
	protected Meshes:Asset[] = [];
	
	protected get CollideMeshes() {
		return this.Meshes
			.filter(x=> x.Element && x.CanCollide)
			.map(x=>x.Element);
	}
	
	public abstract Iterate(keyController:KeyController, Step:number):void;
	
	public GetScene():three.Scene{
		return this.Scene;
	}
	

	public Add(asset:Asset) {
		asset.AddElement(this.Scene);
		this.Meshes.push(asset);
	}
}
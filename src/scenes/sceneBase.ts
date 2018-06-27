import { CameraController } from "../Services/CameraController";
import * as three from "three";
import { Asset } from "../Objects/Asset";
import { KeyController } from "../Services/KeyController";

export abstract class SceneBase {
	constructor(protected Camera:CameraController) {
		this.Scene = new three.Scene();
	}
	
	protected Scene:three.Scene;
	protected Meshes:Asset[] = [];
	
	public abstract Iterate(keyController:KeyController, Step:number):void;
	
	public GetScene():three.Scene{
		return this.Scene;
	}
	
	public Add(asset:Asset) {
		this.Scene.add(asset.Element);
		this.Meshes.push(asset);
	}
}
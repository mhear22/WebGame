import { CameraController } from "../Services/CameraController";
import * as three from "three";
import { Asset } from "../Objects/Asset";
import { KeyController } from "../Services/KeyController";
import { Object3D } from "three";
import { Injector } from "@angular/core";

export abstract class SceneBase {
	constructor(protected Camera:CameraController, protected Injector: Injector = null) {
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
	
	public ColideIterate(key:KeyController, step: number):void {
		this.Meshes.forEach(element => {
			try {
				element.Collide(this.CollideMeshes)
				element.Interval(key, step);
			}
			catch {}
		});
	}

	public Add(asset:Asset) {
		asset.AddElement(this.Scene);
		this.Meshes.push(asset);
	}
}
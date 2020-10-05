import { CameraController } from "../Services/CameraController";
import * as three from "three";
import { Asset } from "../Models/Asset";
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
	
	public get Assets() {
		return this.Meshes
			.filter(x=>x.Element);
	}
	
	public get SceneMeshes() {
		return this.Meshes
			.filter(x=>x.Element)
			.map(x=>x.Element);
	}
	
	public get CollideMeshes() {
		return this.Meshes
			.filter(x=> x.Element && x.CanCollide)
			.map(x=>x.Element);
	}
	
	public IsLoaded() {
		return this.Meshes.every(x=>x.IsLoaded);
	}
	
	public abstract Iterate(keyController:KeyController, Step:number):void;
	
	public GetScene():three.Scene{
		return this.Scene;
	}
	
	public ColideIterate(key:KeyController, step: number):void {
		this.Meshes.forEach(element => {
			try {
				if(element.canCollide) {
					element.Collide(this.CollideMeshes)
				}
				element.Interval(key, step);
			}
			catch (exception) {
				console.error(exception);
			}
		});
	}

	public Add(asset:Asset) {
		asset.AddElement(this.Scene);
		this.Meshes.push(asset);
	}
	
	public Remove(asset: Asset) {
		var index = this.Meshes.indexOf(asset);
		this.Meshes = this.Meshes.filter(x=>x.Element.uuid != asset.Element.uuid)
		this.Scene.remove(asset.Element);
	}
}
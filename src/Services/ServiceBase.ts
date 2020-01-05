import { CameraController } from "./CameraController";
import { KeyController } from "./KeyController";
import { Injector } from "@angular/core";
import { SceneBase } from "../Scenes/SceneBase";

export abstract class ServiceBase {
	public constructor(
		protected Camera: CameraController,
		protected Key: KeyController,
		protected injector: Injector
	) { }
	
	public GetScene: () => SceneBase = null;
	public abstract DrawsHtml:boolean = false;
	public abstract Iterates:boolean = false;
	
	//Logic for iteration
	public Iterate(Split:number) { 
		throw "NotImplemented"
	};
	public GetHtml():string {
		throw "NotImplemented"
	};
	
}
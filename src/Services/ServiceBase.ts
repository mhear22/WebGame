import { CameraController } from "./CameraController";
import { KeyController } from "./KeyController";

export abstract class ServiceBase {
	public constructor(
		protected Camera: CameraController,
		protected Key: KeyController
	) { }
	
	public abstract DrawsHtml:boolean = false;
	public abstract Draws3D:boolean = false;
	public abstract Iterates:boolean = false;
	
	public Iterate(Split:number) { throw "NotImplemented" };
	public GetHtml():string { throw "NotImplemented" };
	public GetContext() { throw "NotImplemented" };
	
}
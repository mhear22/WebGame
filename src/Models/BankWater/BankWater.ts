import { FileAsset } from "../../Models/FileAsset";
import { KeyController } from "../../Services/KeyController";
import { Vector3, Color, Material, Texture } from "three";

export class BankWater extends FileAsset {
	constructor(private scale:number = 0, private pos:Vector3 = new Vector3(), private opacity: number = 0.3) {
		super(require("./bankwater.obj"), require("./bankwater.mtl"), require("./watertexture.png"))
	}
	
	OnLoaded() {
		this.element.scale.addScalar(this.scale)
		this.element.position.copy(this.pos)
		this.canCollide = true;
		
		var mat: Material = (this.element as any).material;
		mat.opacity = this.opacity;
		mat.transparent = true;
	}
	
	Interval(keyController: KeyController, timeSplit: number): void {
		var mat: Texture = ((this.element as any).material.map as Texture);
		var flow = timeSplit * 0.02;
		
		mat.offset.x -= flow
		//mat.offset.y += flow * 2
	}
}
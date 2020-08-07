import { FileAsset } from "../../Models/FileAsset";
import { KeyController } from "../../Services/KeyController";
import { Vector3 } from "three";

export class BankModel extends FileAsset {
	constructor(private scale:number = 0, private pos:Vector3 = new Vector3()) {
		super(require("./bank.obj"), require("./bank.mtl"), require("./bank.png"))
	}
	
	OnLoaded() {
		this.element.scale.addScalar(this.scale)
		this.element.position.copy(this.pos)
	}
	
	Interval(keyController: KeyController, timeSplit: number): void { }
}
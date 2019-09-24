import { FileAsset } from "../../Objects/FileAsset";
import { KeyController } from "../../Services/KeyController";

export class CarModel extends FileAsset {
	constructor() {
		super(require("./Car.obj"), require("./Car.mtl"));
	}
	
	OnLoaded() {
		this.element.scale.addScalar(5);
		this.element.position.z = -20;
		this.element.rotateY(-45);
	}
	
	Interval(keyController: KeyController, timeSplit: number): void {
		if(this.element) {
			this.element.rotateY(timeSplit)
		}
	}
}
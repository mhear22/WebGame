import { FileAsset } from "../FileAsset";
import { KeyController } from "../../Services/KeyController";

export class CubeModel extends FileAsset {
	constructor() {
		super(require("./cube.obj"))
	}
	
	OnLoaded() {
		this.element.position.x = 0;
		this.element.position.z = -10;
		this.element.position.y = 5;
		this.element.rotateY(-45);
	}
	
	Interval(keyController: KeyController, timeSplit: number): void {
		if(this.element) {
			this.element.rotateY(timeSplit)
			this.element.rotateX(timeSplit/2)
		}
	}
}
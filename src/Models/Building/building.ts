import { FileAsset } from "../../Objects/FileAsset";
import { KeyController } from "../../Services/KeyController";

export class BuildingModel extends FileAsset {
	constructor(private x:number, private z:number) {
		super(require("./building.obj"),require("./building.mtl"));
	}
	
	OnLoaded() {
		this.element.position.x = this.x;
		this.element.position.z = this.z;
		this.element.scale.addScalar(5);
	}
	
	Interval(key:KeyController, split: number) {
		
	}
}
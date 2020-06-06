import { FileAsset } from "../../Objects/FileAsset";
import { KeyController } from "../../Services/KeyController";
import { CameraController } from "../../Services/CameraController";

export class CrateModel extends FileAsset {
	constructor(
		private Camera: CameraController,
		private x: number = 0,
		private y: number = 5,
		private z: number = -10
	) {
		super(require("./crate.obj"))
	}
	
	private isClose = false;
	public IsCollected = false;
	
	OnLoaded() {
		this.element.position.x = this.x;
		this.element.position.y = this.y;
		this.element.position.z = this.z;
		this.element.rotateY(-45);
	}
	
	Interval(keyController: KeyController, timeSplit: number): void {
		if(this.element) {
			this.element.rotateY(timeSplit)
			this.element.rotateX(timeSplit/2)
		}
		
		var dist = this.element.position.distanceTo(this.Camera.camera.position);
		var isNowClose = false;
		if(dist < 5) {
			isNowClose = true;
		}
		
		if(isNowClose != this.isClose) {
			if(isNowClose) {
				this.IsCollected = true;
				this.element.visible = false;
			}
		}
		this.isClose = isNowClose;
	}
}
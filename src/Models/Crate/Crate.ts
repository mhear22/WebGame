import { FileAsset } from "../../Models/FileAsset";
import { KeyController } from "../../Services/KeyController";
import { CameraController } from "../../Services/CameraController";
import { DebugService } from "../../Services/DebugService";
import { InventoryService } from "../../Services/InventoryService";

export class CrateModel extends FileAsset {
	constructor(
		private Camera: CameraController,
		private x: number = 0,
		private y: number = 5,
		private z: number = -10
	) {
		super(require("./crate.obj"))
		this._collectable = true;
		this.canCollide = false;
	}
	
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
		
		if(!this.IsCollected && this.CanPickup(this.Camera.camera.position)) {
			InventoryService.AddItem("cube");
			this.IsCollected = true;
			this.element.visible = false;
		}
	}
}
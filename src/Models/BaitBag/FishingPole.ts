import { FileAsset } from "../../Models/FileAsset";
import { KeyController } from "../../Services/KeyController";
import { Vector3 } from "three";
import { CameraController } from "../../Services/CameraController";
import { InventoryService } from "../../Services/InventoryService";
import { BaitBagItem } from "./BaitBagItem";

export class BaitBag extends FileAsset {
	constructor(
		private Camera: CameraController,
		private scale:number = 0,
		private pos:Vector3 = new Vector3()
	) {
		super(require("./baitbag.obj"), require("./baitbag.mtl"))
		this._collectable = true;
		this.canCollide = false;
	}
	public IsCollected = false;
	
	OnLoaded() {
		this.element.scale.addScalar(this.scale)
		this.element.position.copy(this.pos)
	}
	
	Interval(keyController: KeyController, timeSplit: number): void {
		if(this.element) {
			this.element.rotateY(timeSplit);
		}
		
		if(!this.IsCollected && this.CanPickup(this.Camera.camera.position, 7)) {
			var item = new BaitBagItem(null);
			InventoryService.AddInventoryItem(item);
			
			this.IsCollected = true;
			this.element.visible = false;
		}
	}
}
import { FileAsset } from "../../Models/FileAsset";
import { KeyController } from "../../Services/KeyController";
import { Vector3 } from "three";
import { CameraController } from "../../Services/CameraController";
import { InventoryService } from "../../Services/InventoryService";
import { InventoryItem } from "../../DataModels/InventoryItem";
import { DebugService } from "../../Services/DebugService";
import { Injector } from "@angular/core";
import { Servicer } from "../../Services/Servicer";
import { SceneBase } from "../../Scenes/SceneBase";
import { PlayerService } from "../../Services/PlayerService";
import * as three from 'three';

export class FishingPole extends FileAsset {
	constructor(
		private Camera: CameraController,
		private scale:number = 0,
		private pos:Vector3 = new Vector3()
	) {
		super(require("./pole.obj"), require("./pole.mtl"))
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
			var item= new InventoryItem("pole", null, null, (item: any, inj: Injector) => {
				//var scene: SceneBase = Servicer.Get("Scene");
				//var player: PlayerService = Servicer.Get("PlayerService");
				//var pos = this.Camera.camera.position.clone();
				//var dir = this.Camera.camera.rotation.clone().toVector3().normalize();
				//var ray = new three.Raycaster(pos, dir, 0, 1000);
				//var rays = ray.intersectObjects(scene.CollideMeshes).filter(x=>x.distance > 0).sort(x=>x.distance);
				//var fish = rays.filter(x=>x)
				
				return item;
			});
			
			InventoryService.AddInventoryItem(item);
			
			this.IsCollected = true;
			this.element.visible = false;
		}
	}
}
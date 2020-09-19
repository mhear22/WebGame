import { InventoryItem } from "../../DataModels/InventoryItem";
import { SceneBase } from "../../Scenes/SceneBase";
import { CameraController } from "../../Services/CameraController";
import { DebugService } from "../../Services/DebugService";
import { PlayerService } from "../../Services/PlayerService";
import { Servicer } from "../../Services/Servicer";
import * as three from "three";

export class FishingPoleItem extends InventoryItem {
	constructor(Data?:object) {
		super("Fishing Pole", Data, null, (obj:FishingPoleItem) => {this.CastRod(obj)})
	}
	
	CastRod(item:FishingPoleItem) {
		var scene: SceneBase = Servicer.Get("Scene");
		var player: PlayerService = Servicer.Get("PlayerService");
		var cam: CameraController = Servicer.Get("CameraController");
		var pos = cam.camera.position.clone();
		var dir = cam.camera.rotation.clone().toVector3().normalize();
		var ray = new three.Raycaster(pos, dir, 0, 1000);
		var rays = ray.intersectObjects(scene.CollideMeshes).filter(x=>x.distance > 0).sort(x=>x.distance);
		//var fish = rays.filter(x=>x)
		
		DebugService.Message("Throwing Rod");
	}
}
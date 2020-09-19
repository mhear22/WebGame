import { InventoryItem } from "../../DataModels/InventoryItem";
import { SceneBase } from "../../Scenes/SceneBase";
import { CameraController } from "../../Services/CameraController";
import { DebugService } from "../../Services/DebugService";
import { PlayerService } from "../../Services/PlayerService";
import { Servicer } from "../../Services/Servicer";
import * as three from "three";
import { Cube } from "../Cube";

export class FishingPoleItem extends InventoryItem {
	constructor(Data?:object) {
		super("Fishing Pole", Data, null, (obj:FishingPoleItem) => {this.CastRod(obj)})
	}
	
	CastRod(item:FishingPoleItem) {
		var scene: SceneBase = Servicer.Get("Scene");
		var player: PlayerService = Servicer.Get("PlayerService");
		var cam: CameraController = Servicer.Get("CameraController");
		var pos = cam.camera.position.clone();
		//var dir = cam.camera.rotation.clone().toVector3()
		var dir = new three.Vector3(0,0,-1);
		var camDir = dir.applyEuler(cam.camera.rotation);
		
		
		
		var ray = new three.Raycaster(pos, camDir, 0, 1000);
		var rays = ray.intersectObjects(scene.CollideMeshes).filter(x=>x.distance > 0).sort(x=>x.distance);
		//var fish = rays.filter(x=>x)
		if(rays.length > 0) {
			rays.forEach(x=> {
				var point = x.point
				var cube = new Cube(1,1,1,point.x,point.y,point.z, false);
				DebugService.Message(`Created at ${point.x.toFixed(2)} ${point.y.toFixed(2)} ${point.z.toFixed(2)}`);
				scene.Add(cube);
			});
			
			DebugService.Message("Throwing Rod");
		}
	}
}
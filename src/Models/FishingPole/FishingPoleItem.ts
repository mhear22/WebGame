import { InventoryItem } from "../../DataModels/InventoryItem";
import { SceneBase } from "../../Scenes/SceneBase";
import { CameraController } from "../../Services/CameraController";
import { DebugService } from "../../Services/DebugService";
import { PlayerService } from "../../Services/PlayerService";
import { Servicer } from "../../Services/Servicer";
import * as three from "three";
import { Cube } from "../Cube";
import { Tween, TweenMethod } from "../../Services/TweenService";
import { Asset } from "../Asset";
import { Bait } from "./BaitModel";

export class FishingPoleItem extends InventoryItem {
	constructor(Data?:object) {
		super("Fishing Pole", Data, null, (obj:FishingPoleItem) => {this.CastRod(obj)})
	}
	
	private isCast = false;
	private tween: Tween = null;
	private createdItems: Asset[] = [];
	
	CastRod(item:FishingPoleItem) {
		var scene: SceneBase = Servicer.Get("Scene");
		var player: PlayerService = Servicer.Get("PlayerService");
		var cam: CameraController = Servicer.Get("CameraController");
		
		var pos = cam.camera.position.clone();
		var target = this.getTarget(cam, pos, scene);
		
		if(this.isCast) {
			this.ClearReal();
		}
		else {
			this.CastReel(target, pos, scene);
		}
	}
	
	private CastReel(target: three.Vector3, position: three.Vector3, scene: SceneBase) {
		var tween = new Tween(position, target, TweenMethod.Linear, 5, false);
		var model = new Bait(tween);
		this.createdItems.push(model);
		scene.Add(model);
	}
	
	private ClearReal() {
		this.createdItems.forEach(x=>x.Element.visible = false);
		this.createdItems = []
	}
	
	private getTarget(cam: CameraController, position: three.Vector3, scene: SceneBase) {
		var dir = new three.Vector3(0,0,-1);
		var camDir = dir.applyEuler(cam.camera.rotation);
		
		var ray = new three.Raycaster(position, camDir, 0, 1000);
		var rays = ray.intersectObjects(scene.SceneMeshes).filter(x=>x.distance > 0).sort(x=>x.distance);
		
		if(rays.length > 0) {
			return rays[0].point;
		}
		return null;

	}
}
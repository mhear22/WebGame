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
import { Hook } from "./HookModel";
import { InventoryService } from "../../Services/InventoryService";
import { FishItem } from "../Fish/FishItem";
import { Fish } from "../Fish/Fish";

export class FishingPoleItem extends InventoryItem {
	constructor(Data?:object) {
		super("Fishing Pole", Data, null, (obj:FishingPoleItem) => {this.UseRod(obj)})
	}
	
	private isCast = false;
	private tween: Tween = null;
	private createdItems: Asset[] = [];
	
	UseRod(item:FishingPoleItem) {
		var scene = Servicer.GetScene();
		var player: PlayerService = Servicer.Get("PlayerService");
		var cam: CameraController = Servicer.Get("CameraController");
		
		if(this.isCast) {
			this.RecallCast(scene);
			this.isCast = false;
		}
		else {
			var pos = cam.camera.position.clone();
			var target = this.getTarget(cam, pos, scene);
			if(target != null) {
				this.CastRod(target, pos, scene);
				this.isCast = true
			}
		}
	}
	
	private RecallCast(scene: SceneBase) {
		this.createdItems.forEach(x=> {
			var model = x as Hook;
			if(model.isHooked) {
				var targetFish = scene.Assets.filter(x=>x.Element.uuid == model.HookedFish)[0] as Fish;
				InventoryService.AddInventoryItem(new FishItem(targetFish))
				scene.Remove(targetFish);
			}
			scene.Remove(x);
		});
		this.createdItems = [];
	}
	
	private CastRod(target: three.Vector3, position: three.Vector3, scene: SceneBase) {
		var tween = new Tween(position, target, TweenMethod.Linear, 1, false);
		var model = new Hook(tween);
		this.createdItems.push(model);
		scene.Add(model);
	}
	
	private getTarget(cam: CameraController, position: three.Vector3, scene: SceneBase) {
		var dir = new three.Vector3(0,0,-1);
		var camDir = dir.applyEuler(cam.camera.rotation);
		
		var ray = new three.Raycaster(position, camDir, 0, 1000);
		var rays = ray.intersectObjects(scene.SceneMeshes).filter(x=>x.distance > 0).sort(x=>x.distance);
		
		if(rays.length > 0) {
			if(rays[0].object.name.startsWith("BankWater")) {
				return rays[0].point;
			}
			
		}
		return null;

	}
}
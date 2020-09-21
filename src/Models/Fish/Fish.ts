import { KeyController } from "../../Services/KeyController";
import * as three from "three";
import { FileAsset } from "../FileAsset";
import { Tween, TweenMethod } from "../../Services/TweenService";
import { Servicer } from "../../Services/Servicer";
import { SceneBase } from "../../Scenes/SceneBase";

export class Fish extends FileAsset {
	private tween: Tween;
	private static Agressions:number[] = [];
	private agression = Math.random() * 100
	private get isKingFish() {
		return Math.max(...Fish.Agressions) == this.agression;
	}
	
	public constructor(
		private position: three.Vector3,
		private rotation: number
	) {
		super(require("./fish.obj"));
		Fish.Agressions.push(this.agression);
	}
	
	OnLoaded() {
		this.element.position.copy(this.position);
		this.element.rotation.y = this.rotation;
	}
	
	Interval(keyController: KeyController, timeSplit: number): void {
		if(this.tween == null || this.tween.complete) {
			var current = this.element.position.clone();
			var max = this.agression;
			
			var target: three.Vector3 = null
			
			target = this.ClosestFood()
			if(target == null) {
				var newX = current.x + ((Math.random() * max) - max/2);
				var newZ = current.z + ((Math.random() * max) - max/2);
				target = new three.Vector3(newX, current.y, newZ);
			}
			else {
				var offset = Math.random()
				target = target.multiplyScalar(offset);
			}
			
			
			this.tween = new Tween(
				current, 
				target, 
				TweenMethod.Linear,
				5,
				false
			)
			
			if(target.distanceTo(current) > 3) {
				var rot = new three.Vector3(target.x - current.x, 0, target.z - current.z);
				var angle = rot.angleTo(new three.Vector3(1,0,0))
				this.element.rotation.y = angle;
			}
		}
		
		this.element.position.copy(this.tween.value.clone())
		if(this.IsCollided) {
			var dir = this.UnCollide();
			dir.y = 0;
			this.element.position.add(dir);
		}
	}
	
	private ClosestFood():any {
		var scene: SceneBase = Servicer.Get(Servicer.Scene);
		var currentPos = this.element.position;

		var baits = scene.SceneMeshes.filter(x=>x.name.startsWith("Bait"));
		if(baits.length > 0) {
			var targets = baits.map(x=> {
				return {
					"distance": x.position.distanceTo(currentPos),
					"point": x.position
				}
			});
			var closest = targets.sort(x=>x.distance)[0];
			
			var directionOfFood = closest.point.sub(currentPos)
			directionOfFood.y = 0;
			return directionOfFood
		}
		else {
			return null;
		}
	}
}
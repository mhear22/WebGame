import { KeyController } from "../../Services/KeyController";
import { Tween } from "../../Services/TweenService";
import { Asset } from "../Asset";
import * as three from "three";
import { Servicer } from "../../Services/Servicer";
import { SceneBase } from "../../Scenes/SceneBase";
import { MathService } from "../../Services/MathService";

export class Hook extends Asset {
	public isHooked = false;
	public HookedFish:string = null;
	
	constructor(private tween: Tween) {
		super();
		var geo = new three.BoxBufferGeometry(1, 1, 1);
		var mat = new three.MeshPhongMaterial({ color: "#FFFFFF"});
		this.element = new three.Mesh(geo, mat);
		this.element.position.copy(tween.InitalValue);
		this.element.castShadow = true;
		this.element.receiveShadow = true;
		this.canCollide = false;
	}
	
	Interval(keyController: KeyController, timeSplit: number): void {
		var scene: SceneBase = Servicer.Get(Servicer.Scene);
		
		if(this.tween) {
			this.Element.position.copy(this.tween.value);
			if(this.tween.complete) {
				this.tween = null;
			}
		}
		
		var fish = scene.SceneMeshes.filter(x=>x.name.startsWith("Fish"))
		
		var localFish = fish
			.map(x=> { 
				return {
					distance: x.position.distanceTo(this.element.position),
					fish: x
				}
			})
			
		this.isHooked = localFish
			.some(x=>x.distance < 15);
		
		if(this.isHooked) {
			var closest = localFish.sort(x=>x.distance)[0]
			this.HookedFish = closest.fish.uuid;
		}
		else {
			this.HookedFish = null;
		}
	}
}
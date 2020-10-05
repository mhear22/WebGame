import { KeyController } from "../../Services/KeyController";
import { Tween } from "../../Services/TweenService";
import { Asset } from "../Asset";
import * as three from "three";
import { Servicer } from "../../Services/Servicer";
import { SceneBase } from "../../Scenes/SceneBase";
import { MathService } from "../../Services/MathService";

export class Hook extends Asset {
	public isHooked = false;
	//public HookedFish:string = null;
	
	public get HookedFish() {
		if(!this.isHooked)
			return null;
		
		var scene: SceneBase = Servicer.Get(Servicer.Scene);
		var hookPosition = this.Element.position;
		var localFish = scene.Assets
			.filter(x=>x.Element.name == "Fish")
			.map(x=> {
				return {
					fish: x,
					distance: x.Element.position.distanceTo(hookPosition)
				};
			})
			.sort(x=>x.distance);
		
		var closest = localFish[0];
		return closest.fish.Element.uuid;
	}
	
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
	}
}
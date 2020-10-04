import { KeyController } from "../../Services/KeyController";
import { Tween } from "../../Services/TweenService";
import { Asset } from "../Asset";
import * as three from "three";
import { Servicer } from "../../Services/Servicer";
import { SceneBase } from "../../Scenes/SceneBase";

export class Bait extends Asset {
	constructor(private tween: Tween) {
		super();
		var geo = new three.BoxBufferGeometry(1, 1, 1);
		var mat = new three.MeshPhongMaterial({ color: "#FF0000"});
		this.element = new three.Mesh(geo, mat);
		this.element.position.copy(tween.InitalValue);
		this.element.castShadow = true;
		this.element.receiveShadow = true;
		this.canCollide = false;
	}
	private lifespan = 100;
	
	Interval(keyController: KeyController, timeSplit: number): void {
		var scene: SceneBase = Servicer.Get(Servicer.Scene);
		
		this.lifespan -= timeSplit;
		if(this.lifespan < 0)
			scene.Remove(this)
		
		if(this.tween) {
			this.Element.position.copy(this.tween.value);
			if(this.tween.complete) {
				this.tween = null;
			}
		}
		
		var fish = scene.SceneMeshes.filter(x=>x.name.startsWith("Fish"))
		
		var isEaten = this.Collide(fish);
		if(isEaten) {
			scene.Remove(this);
		}
	}
}
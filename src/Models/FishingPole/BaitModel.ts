import { KeyController } from "../../Services/KeyController";
import { Tween } from "../../Services/TweenService";
import { Asset } from "../Asset";
import * as three from "three";

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
	
	Interval(keyController: KeyController, timeSplit: number): void {
		this.Element.position.copy(this.tween.value);
	}
}
import { Asset } from "./Asset";
import * as three from "three";
import { Sun } from "./Sun";
import { KeyController } from "../Services/KeyController";


export class Car extends Asset {
	private leftLight: Sun;
	private rightLight: Sun;
	
	constructor(scene:three.Scene) {
		super();
		var geo = new three.BoxGeometry(4,2,4);
		var mat = new three.MeshPhongMaterial();
		this.element = new three.Mesh(geo, mat);
		this.element.castShadow = true;
		this.element.receiveShadow = true;
		this.element.position.x = 4;
		this.element.position.y = 1;
		this.element.position.z = -20;
		
		this.leftLight = new Sun(scene,
			this.element.position.x - 2.05,
			this.element.position.y,
			this.element.position.z - 1.5,
			.125
		);
		this.rightLight = new Sun(scene,
			this.element.position.x - 2.05,
			this.element.position.y,
			this.element.position.z + 1.5,
			.125
		);
		scene.add(this.leftLight.Element);
		scene.add(this.rightLight.Element);
	}
	
	public Interval(keyController:KeyController,timeSplit:number) {
		this.leftLight.Interval(keyController,timeSplit);
		this.rightLight.Interval(keyController, timeSplit);
	}
}
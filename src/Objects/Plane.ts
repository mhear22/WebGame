import { Asset } from "./Asset";
import * as three from "three";

export class Plane extends Asset {
	constructor(height:number = 0) {
		super();
		var mat = new three.MeshPhongMaterial({
			color:0x6C6C6C
		});
		this.element = new three.Mesh(new three.PlaneGeometry(10000,10000), mat);
		this.element.receiveShadow = true;
		this.element.rotation.x = -Math.PI / 2;
		this.element.position.y = height;
	}
	Interval() {
		
	}
}
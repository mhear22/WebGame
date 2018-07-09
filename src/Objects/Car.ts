import { Asset } from "./Asset";
import * as three from "three";


export class Car extends Asset {
	private leftLight: three.PointLight;
	
	constructor(scene:three.Scene) {
		super();
		var geo = new three.BoxGeometry(2,2,2);
		var mat = new three.MeshPhongMaterial();
		this.element = new three.Mesh(geo, mat);
		this.element.castShadow = true;
		this.element.receiveShadow = true;
		this.element.position.x = 4;
		this.element.position.y = 1;
		this.element.position.z = -20;
		
		var light = new three.PointLight(0xFFFFFF, 0.5, 100000000, 0);
		light.position.x = this.element.position.x
		light.position.y = this.element.position.y + 1.5
		light.position.z = this.element.position.z
		light.castShadow = true;
		
		light.shadow.camera.far = 10000;
		light.shadow.camera.near = 1;
		light.shadow.mapSize.height = 256;
		light.shadow.mapSize.width = 256;
		
		this.leftLight = light;
		scene.add(this.leftLight);
	}
	
	public Interval() {
		
	}
}
import { Asset } from "./Asset";
import * as three from "three";

export class Sun extends Asset {
	constructor(
		Scene:three.Scene,
		X:number = 0,
		Y:number = 0,
		Z:number = 0,
		radius:number = 2
	) {
		super();
		
		var sunMesh = new three.MeshBasicMaterial();
		var sunGeo = new three.SphereGeometry(radius, 100, 100);
		this.element = new three.Mesh(sunGeo, sunMesh);
		
		this.element.position.x = X;
		this.element.position.y = Y;
		this.element.position.z = Z;
		
		var light = new three.PointLight(0xFFFFFF, 1, 1000, 0);
		light.position.y = Y;
		light.position.x = X;
		light.position.z = Z;
		
		light.castShadow = true;
		light.shadowCameraFar = 10000;
		light.shadowCameraNear = 1;
		light.shadowMapHeight = 2048;
		light.shadowMapWidth = 2048;
		
		Scene.add(light);
	}
	
	Interval(keyMap:any, timeSplit:number) {
		
	}
}
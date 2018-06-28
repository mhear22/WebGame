import { Asset } from "./Asset";
import * as three from "three";

export class Sun extends Asset {
	private light:three.PointLight;
	
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
		
		this.light = new three.PointLight(0xFFFFFF, 0.5, 100000000, 0);
		this.light.position.y = Y;
		this.light.position.x = X;
		this.light.position.z = Z;
		
		this.light.castShadow = true;
		this.light.shadowCameraFar = 10000;
		this.light.shadowCameraNear = 1;
		this.light.shadowMapHeight = 2048;
		this.light.shadowMapWidth = 2048;
		
		Scene.add(this.light);
	}
	
	Interval(keyMap:any, timeSplit:number) {
	}
}
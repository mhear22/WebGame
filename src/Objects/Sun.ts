import { Asset } from "./Asset";
import * as three from "three";
import { KeyController } from "../Services/KeyController";

export class Sun extends Asset {
	private light:three.PointLight;
	
	constructor(
		Scene:three.Scene,
		X:number = 0,
		Y:number = 0,
		Z:number = 0,
		radius:number = 2,
		color:number = 0xFFFFFF,
		intensity:number = 0.5
	) {
		super();
		this.canCollide = false;
		var sunMesh = new three.MeshBasicMaterial({color:color});
		var sunGeo = new three.SphereGeometry(radius, 100, 100);
		this.element = new three.Mesh(sunGeo, sunMesh);
		
		this.element.position.x = X;
		this.element.position.y = Y;
		this.element.position.z = Z;
		
		this.light = new three.PointLight(color, 0.5, 100000000, 0);
		this.light.position.y = Y;
		this.light.position.x = X;
		this.light.position.z = Z;
		
		this.light.castShadow = true;
		this.light.shadow.camera.far = 10000;
		this.light.shadow.camera.near = 1;
		this.light.shadow.mapSize.height = Math.pow(64,2);
		this.light.shadow.mapSize.width = Math.pow(64,2);
		this.light.intensity = intensity;
		
		Scene.add(this.light);
	}
	
	Interval(keyController:KeyController,timeSplit:number) {
		this.light.position.x = this.element.position.x;
		this.light.position.y = this.element.position.y;
		this.light.position.z = this.element.position.z;
	}
}
import { SceneBase } from "./SceneBase";
import { KeyController } from "../Services/KeyController";
import { CameraController } from "../Services/CameraController";
import { Injector } from "@angular/core";
import { BankModel } from "../Models/BankTerrain/Bank";
import { Sun } from "../Objects/Sun";
import { Skybox } from "../Objects/Skybox";
import * as three from 'three';
import { Rain } from "../Objects/Rain";
import { CrateModel } from "../Models/Crate/Crate";


export class BankScene extends SceneBase {
	public Iterate(keyController: KeyController, Step: number): void {
		this.ColideIterate(keyController, Step);
		this.rain.Element.position.copy(this.Camera.camera.position);
		this.sun.Element.position.x = this.Camera.camera.position.x;
		this.sun.Element.position.z = this.Camera.camera.position.z;
		
		if(!this.isComplete && this.crates.every(x=>x.IsCollected)) {
			this.isComplete = true;
			
			console.log("Complete")
		}
	}
	
	private isComplete = false;
	
	private rain:Rain;
	private sun:Sun;
	
	private crates:CrateModel[] = []
	
	constructor(
		cam:CameraController,
		key:KeyController,
		injector: Injector
	) {
		super(cam,injector);
		
		this.sun = new Sun(this.Scene,0,100,0,null,null, 2);
		
		this.Add(new BankModel(60, new three.Vector3(0,-11,100)));
		
		this.crates = [
			new CrateModel(this.Camera,100,5,0),
			new CrateModel(this.Camera,-50,5,0),
			new CrateModel(this.Camera,40,35,246)
		]
		
		this.crates.map(x=> { this.Add(x)})
		
		
		this.Add(this.sun)
		this.Add(new Skybox(cam));
		this.rain = new Rain(
			new three.Vector3(0,30,0),
			new three.Vector3(50,100,50),
			200);
		this.Add(this.rain);
	}
}
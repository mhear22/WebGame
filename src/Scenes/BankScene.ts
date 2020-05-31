import { SceneBase } from "./SceneBase";
import { KeyController } from "../Services/KeyController";
import { CameraController } from "../Services/CameraController";
import { Injector } from "@angular/core";
import { BankModel } from "../Models/BankTerrain/Bank";
import { Sun } from "../Objects/Sun";
import { Skybox } from "../Objects/Skybox";
import * as three from 'three';
import { Rain } from "../Objects/Rain";


export class BankScene extends SceneBase {
	public Iterate(keyController: KeyController, Step: number): void {
		this.ColideIterate(keyController, Step);
		this.rain.Element.position.copy(this.Camera.camera.position);
		this.sun.Element.position.x = this.Camera.camera.position.x
		this.sun.Element.position.z = this.Camera.camera.position.z
	}
	
	private rain:Rain;
	private sun:Sun;
	
	constructor(
		cam:CameraController,
		key:KeyController,
		injector: Injector
	) {
		super(cam,injector);
		
		this.sun = new Sun(this.Scene,0,100,0,null,null, 2);
		
		this.Add(new BankModel(60, new three.Vector3(0,-10,100)));
		this.Add(this.sun)
		this.Add(new Skybox(cam));
		this.rain = new Rain(
			new three.Vector3(0,30,0),
			new three.Vector3(50,100,50),
			200);
		this.Add(this.rain);
	}
}
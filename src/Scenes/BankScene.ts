import { SceneBase } from "./SceneBase";
import { KeyController } from "../Services/KeyController";
import { CameraController } from "../Services/CameraController";
import { Injector } from "@angular/core";
import { BankModel } from "../Models/BankTerrain/Bank";
import { Sun } from "../Objects/Sun";
import { Skybox } from "../Objects/Skybox";
import * as three from 'three';


export class BankScene extends SceneBase {
	public Iterate = this.ColideIterate
	
	constructor(
		cam:CameraController,
		key:KeyController,
		injector: Injector
	) {
		super(cam,injector);
		
		this.Add(new BankModel(60, new three.Vector3(0,-10,100)));
		this.Add(new Sun(this.Scene,0,100,0,null,null, 2));
		this.Add(new Skybox(cam));
	}
}
import { SceneBase } from "./SceneBase";
import { KeyController } from "../Services/KeyController";
import { CameraController } from "../Services/CameraController";
import { Injector } from "@angular/core";
import { BankModel } from "../Models/BankTerrain/Bank";
import { Sun } from "../Models/Sun";
import { Skybox } from "../Models/Skybox/Skybox";
import * as three from 'three';
import { Rain } from "../Models/Rain";
import { CrateModel } from "../Models/Crate/Crate";
import { DebugService } from "../Services/DebugService";
import { BankWater } from "../Models/BankWater/BankWater";
import { CarModel } from "../Models/Car/Car";
import { Tween, TweenMethod } from "../Services/TweenService";
import { Fish } from "../Models/Fish/Fish";


export class BankScene extends SceneBase {
	private isComplete = false;
	private rain:Rain;
	private sun:Sun;
	private crates:CrateModel[] = []
	private car: CarModel;
	private carTween: Tween;
	private Fish: Fish[] = [];
	
	
	public Iterate(keyController: KeyController, Step: number): void {
		this.ColideIterate(keyController, Step);
		this.rain.Element.position.copy(this.Camera.camera.position);
		this.sun.Element.position.x = this.Camera.camera.position.x;
		this.sun.Element.position.z = this.Camera.camera.position.z;
		
		if(!this.isComplete && this.crates.every(x=>x.IsCollected)) {
			this.isComplete = true;
			DebugService.Message("Complete");
		}
		
		//Car starts at X46, Y38, Z-385
		//Car ends at X50, Y31.6, Z570
		
		if(this.carTween) {
			this.car.Element.position.copy(this.carTween.value);
		}
		this.Fish.map(x=> x.Interval(keyController, Step));
	}
	
	constructor(
		cam:CameraController,
		key:KeyController,
		injector: Injector
	) {
		super(cam,injector);
		
		this.sun = new Sun(this.Scene,0,100,0,null,null, 2);
		
		this.Add(new BankModel(60, new three.Vector3(0,-11,100)));
		//this.Add(new BankWater(60, new three.Vector3(0,-11,100)));
		
		this.crates = [
			new CrateModel(this.Camera,100,5,0),
			new CrateModel(this.Camera,-50,5,0),
			new CrateModel(this.Camera,40,35,246)
		]
		
		this.crates.map(x=>this.Add(x));
		
		this.Fish = [
			new Fish(new three.Vector3(-90, -40, 175), 90),
			new Fish(new three.Vector3(-35, -40, 125), 270),
			new Fish(new three.Vector3(-20, -40, 175), 45)
		]
		this.Fish.map(x=>this.Add(x));
		
		
		this.car = new CarModel(
			key,
			cam,
			new three.Vector3(46, 38, -385),
			0,
			false
		)
		this.carTween = new Tween(
			new three.Vector3(46, 32, -385),
			new three.Vector3(50, 25, 570),
			TweenMethod.Linear,
			5
		)
		
		this.Add(this.car);
		this.Add(this.sun)
		this.Add(new Skybox(cam));
		this.rain = new Rain(
			new three.Vector3(0,30,0),
			new three.Vector3(50,100,50),
			200);
		this.Add(this.rain);
	}
}
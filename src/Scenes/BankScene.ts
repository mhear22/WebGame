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
import { range } from "rxjs";
import { FishingPole } from "../Models/FishingPole/FishingPole";
import { Vector3 } from "three";


export class BankScene extends SceneBase {
	private isComplete = false;
	private rain:Rain;
	private sun:Sun;
	private crates:CrateModel[] = []
	private car: CarModel;
	private carTween: Tween;
	private Fish: Fish[] = [];
	private Pole: FishingPole;
	
	public Iterate(keyController: KeyController, Step: number): void {
		this.ColideIterate(keyController, Step);
		
		this.sun.Element.position.x = this.Camera.camera.position.x;
		this.sun.Element.position.z = this.Camera.camera.position.z;
		
		if(!this.isComplete && this.crates.every(x=>x.IsCollected)) {
			this.isComplete = true;
			DebugService.Message("Complete");
		}
		
		if(this.car.Element && this.car.Element.position) {
			this.car.Element.position.copy(this.carTween.value);
		}
	}
	
	constructor(
		cam:CameraController,
		key:KeyController,
		injector: Injector
	) {
		super(cam,injector);
		
		this.sun = new Sun(this.Scene,0,100,0,null,null, 2);
		
		this.Add(new BankModel(60, new three.Vector3(0,-11,100)));
		this.Add(new BankWater(200, new three.Vector3(0,-11,100)));
		
		this.crates = [
			new CrateModel(this.Camera,100,5,0),
			new CrateModel(this.Camera,-50,5,0),
			new CrateModel(this.Camera,40,35,246)
		]
		
		
		this.crates.map(x=>this.Add(x));
		
		this.Fish = [1,2,3,4,5].map(x=> new Fish(new three.Vector3(-90, -40, 175), 0))
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
		
		this.Pole = new FishingPole(this.Camera,1, new Vector3(-50,0,20));
		this.Add(this.Pole);
		this.Add(this.car);
		this.Add(this.sun)
		this.Add(new Skybox(cam));
		//this.rain = new Rain(
		//	new three.Vector3(0,30,0),
		//	new three.Vector3(50,100,50),
		//	200);
		//this.Add(this.rain);
	}
}
import { KeyController } from "../../Services/KeyController";
import * as three from "three";
import { FileAsset } from "../FileAsset";
import { ConfTween, Tween, TweenMethod } from "../../Services/TweenService";
import { Servicer } from "../../Services/Servicer";
import { SceneBase } from "../../Scenes/SceneBase";
import { Scene } from "three";
import { MathService } from "../../Services/MathService";
import { DebugService } from "../../Services/DebugService";

export class Fish extends FileAsset {
	private tween: Tween;
	private rotationTween: Tween;
	private static Agressions:number[] = [];
	private agression = Math.random() * 100;
	private quality = Math.random() * 100;
	//private hunger = Math.random() * 100;
	private hunger = 0;
	private thinkingFrequency = Math.random() + 1;
	private nextThought = this.thinkingFrequency;
	private Task: string;
	
	private get isKingFish() {
		return Math.max(...Fish.Agressions) == this.agression;
	}
	
	public constructor(
		private position: three.Vector3,
		private rotation: number
	) {
		super(require("./fish.obj"));
		Fish.Agressions.push(this.agression);
	}
	
	OnLoaded() {
		this.element.position.copy(this.position);
		this.element.rotation.y = this.rotation;
	}
	
	Interval(keyController: KeyController, timeSplit: number): void {
		this.hunger -= timeSplit;
		this.nextThought += timeSplit;
		
		var checkingFrequency = this.thinkingFrequency;
		if(this.Task == "Food")
			checkingFrequency = checkingFrequency/2
		
		if(this.nextThought > checkingFrequency) {
			this.nextThought = 0;
			this.Think();
		}
		
		this.ExecuteTween(timeSplit);
	}
	
	private ExecuteTween(timeSplit: number) {
		if(this.tween) {
			var tweenLocation = this.tween.value.clone()
			tweenLocation.y = this.element.position.y;
			this.element.position.copy(tweenLocation);
		}
	}
	
	private Think() {
		var current = this.element.position.clone();
		var target: three.Vector3 = null;
		
		//Check Area, flee if more than one other fish
		var data = this.ClosestFish(10);
		if(data.count > 1) {
			this.Task = "Avoid";
			target = this.AvoidLocalFish(10);
		}
		
		//Am I hungry, if so, respond to bait
		if(!target && this.hunger < 80) {
			this.Task = "Food";
			var food = this.ClosestFood(this.agression * 10);
			if(food) {
				var steps = current.distanceTo(food) / this.agression;
				if(steps > 1) {
					var delta = current.clone().sub(food.clone());
					
					target = current.clone()
					target.x -= (delta.x/steps)
					target.z -= (delta.z/steps)
				}
				else {
					target = food
				}
			}
		}
		
		//No plans, random point and move
		if(!target) {
			this.Task = "Wander";
			target = this.RandomLocation(current);
		}
		
		
		if(this.IntersectsWithWorld(current, target)) {
			target = null;
		}

		if(!target)
			target = current;
		
		this.tween = new ConfTween({
			initalValue: current,
			targetValue: target,
			duration: this.thinkingFrequency,
			loop: false
		});
		this.RotateToDirection(current, target)
		DebugService.Message(`${this.element.name} is ${this.Task}ing`);
	}
	
	private IntersectsWithWorld(current: three.Vector3, target: three.Vector3):boolean {
		
		var dir = MathService.DirectionTo(current, target)
		var scene: SceneBase = Servicer.Get(Servicer.Scene);
		var distance = current.distanceTo(target);
		
		var objectsToIntersect = scene.SceneMeshes.filter(x=>
			x.name.startsWith("Bank") ||
			x.name.startsWith("Fish")
		);
		
		var intersections = MathService.RayCast({
			point: current,
			direction: dir,
			objects: objectsToIntersect})
		
		
			
		return intersections.some((x)=>x.distance < distance)
	}
	
	private RotateToDirection(current: three.Vector3, target: three.Vector3) {
		if(target.distanceTo(current) > 3) {
			var rot = new three.Vector3(target.x - current.x, 0, target.z - current.z);
			var angle = rot.angleTo(new three.Vector3(1,0,0))
			this.element.rotation.y = angle;
		}
	}
	
	private RandomLocation(current: three.Vector3):three.Vector3 {
		var max = this.agression;
		var newX = current.x + ((Math.random() * max) - max/2);
		var newZ = current.z + ((Math.random() * max) - max/2);
		return new three.Vector3(newX, current.y, newZ);
	}
	
	private AvoidLocalFish(localArea: number): three.Vector3 {
		return null;
	}
	
	private ClosestFish(localArea: number):any {
		var scene: SceneBase = Servicer.Get(Servicer.Scene);
		var currentPos = this.element.position;
		
		var allFish = scene.SceneMeshes
			.filter(x =>x.name.startsWith("Fish"))
			.map(x=> x.position.distanceTo(currentPos))
			.filter(x=>x < localArea);
		
		
		return {
			count: allFish.length,
			nearest: allFish.sort(x=>x)[0]
		};
	}
	
	private ClosestFood(MaximumDistance: number):three.Vector3 {
		var scene: SceneBase = Servicer.Get(Servicer.Scene);
		var currentPos = this.element.position;

		var baits = scene.SceneMeshes.filter(x=>x.name.startsWith("Bait"));
		if(baits.length > 0) {
			var targets = baits.map(x=> {
				return {
					"distance": x.position.distanceTo(currentPos),
					"point": x.position.clone()
				}
			}).filter(x=>x.distance<MaximumDistance);
			if(targets.length == 0)
				return null;
			
			var closest = targets.sort(x=>x.distance)[0];
			
			return closest.point;
		}
		else {
			return null;
		}
	}
}
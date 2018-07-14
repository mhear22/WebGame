import { Asset } from "./Asset";
import { Cube } from "./Cube";
import { Vector3, CubeCamera } from "three";
import { KeyController } from "../Services/KeyController";
import * as three from "three";

export class PhysicsCube extends Cube {
	constructor(
		KeyController:KeyController,
		width: number = 1,
		height: number = 1,
		depth: number = 1,
		x:number = 0,
		y:number = 0,
		z:number = 0
	) {
		super(width, height, depth,x,y,z);
		this.Momentum = new Vector3(0,0,0);
	}
	
	protected Momentum:Vector3;
	
	public Interval(keyMap:any, timeSplit:number) {
		var grav = (9.6/1000)*timeSplit;
		
		var newMomentum:number = this.Momentum.y - grav;
		
		newMomentum = (1-(timeSplit * 0.01)) * newMomentum;
		
		if(this.Element.position.y >= (this.height/2)) {
			this.Momentum.y = newMomentum;
			this.Element.position.add(this.Momentum);
		}
		else {
			if(this.Momentum.y < 0) {
				this.Momentum.y = -this.Momentum.y;
			}
			this.Element.position.add(this.Momentum);
		}
	}
}
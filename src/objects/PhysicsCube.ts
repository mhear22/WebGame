import { Asset } from "./asset";
import { Cube } from "./cube";
import { Vector3 } from "three";

export class PhysicsCube extends Cube {
	constructor(
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
		
		newMomentum = (1+(timeSplit * 0.0001)) * newMomentum;
		
		if(this.Element.position.y >= -9) {
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
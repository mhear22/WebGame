import * as three from 'three';
import * as moment from 'moment';
import { DebugService } from './DebugService';

export enum TweenMethod {
	Linear
}

export class Tween {
	private startTime: moment.Moment;
	private endTime: moment.Moment;
	private _currentTime: moment.Moment;
	
	public constructor(
		private InitalValue: three.Vector3,
		private TargetValue: three.Vector3,
		private Method: TweenMethod,
		private Duration: number,
		private Loop= true
	) {
		this.startTime = moment();
		this.endTime = moment();
		this.endTime.add(Duration, "s");
	}
	
	public set currentTime(value: moment.Moment) {
		this._currentTime = value;
	}
	
	public get currentTime() {
		if(this._currentTime) {
			return this._currentTime;
		}
		return moment();
	}
	
	public get value() {
		var total = this.endTime.diff(this.startTime);
		var elapsed = this.currentTime.diff(this.startTime);
		var target = this.TargetValue.clone();
		var inital = this.InitalValue.clone();
		
		
		var split = (elapsed % total)/total
		
		if(!this.Loop && this.complete)
			return target;
		
		var result = {
			x:0,
			y:0,
			z:0
		};
		
		["x", "y", "z"].map(prop=> {
			var travel = (target as any)[prop] - (inital as any)[prop];
			var adjustedTravel = travel * split;
			(result as any)[prop] = (inital as any)[prop] + adjustedTravel;
		});
		
		return new three.Vector3(result.x, result.y, result.z);
	}
	
	public get complete() {
		if (this.Loop)
			return false;
		var total = this.endTime.diff(this.startTime);
		var elapsed = this.currentTime.diff(this.startTime);
		
		var result = elapsed >= total;
		return result;
	}
}
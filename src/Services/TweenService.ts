import * as three from 'three';
import * as moment from 'moment';

export enum TweenMethod {
	Linear
}

export class Tween {
	private startTime = moment();
	private endTime: moment.Moment;
	public constructor(
		private InitalValue: three.Vector3,
		private TargetValue: three.Vector3,
		private Method: TweenMethod,
		private Duration: number,
		private Loop= true
	) {
		this.endTime = moment();
		this.endTime.add(Duration, "s");
	}
	
	public get value() {
		var total = this.startTime.diff(this.endTime);
		var elapsed = moment().diff(this.startTime);
		
		var split = (elapsed % total)/total
		
		if(!this.Loop && this.complete)
			return this.TargetValue;
		
		var x = ((this.InitalValue.x - this.TargetValue.x) * split) + this.InitalValue.x
		var y = ((this.InitalValue.y - this.TargetValue.y) * split) + this.InitalValue.y
		var z = ((this.InitalValue.z - this.TargetValue.z) * split) + this.InitalValue.z
		
		return new three.Vector3(x, y, z);
	}
	
	public get complete() {
		if (this.Loop)
			return false;
		var total = Math.abs(this.startTime.diff(this.endTime));
		var elapsed = moment().diff(this.startTime);
		return elapsed > total;
	}
}
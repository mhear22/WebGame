import { Object3D } from "three";

export abstract class Asset {
	abstract Interval(keyMap:any,timeSplit:number):void;
	protected element:Object3D;
	get Element():Object3D {
		return this.element;
	}
}
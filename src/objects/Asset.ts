import { Object3D } from "three";
import { KeyController } from "../Services/KeyController";

export abstract class Asset {
	abstract Interval(keyController:KeyController,timeSplit:number):void;
	protected element:Object3D;
	get Element():Object3D {
		return this.element;
	}
}
import { Object3D } from "three";

export abstract class Asset {
	abstract Interval(keyMap:any,timeSplit:Number):void;
	Element:Object3D;
}
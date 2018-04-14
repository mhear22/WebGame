import { Object3D } from "three";

export abstract class Asset {
	abstract Interval(keyMap:any,timeSplit:number):void;
	Element:Object3D;
}
import { Object3D } from "three";

export interface Asset {
	KeyUp(key:KeyboardEvent):void;
	KeyDown(key:KeyboardEvent):void;
	Interval():void;
	Element:Object3D;
}
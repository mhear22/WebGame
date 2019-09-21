import { KeyController } from "../Services/KeyController";
import * as three from "./node_modules/three";

export abstract class Asset {
	abstract Interval(keyController:KeyController,timeSplit:number):void;
	protected element:three.Object3D;
	get Element():three.Object3D {
		return this.element;
	}
	
	public AddElement(scene: three.Scene) {
		scene.add(this.Element);
	}
	
}
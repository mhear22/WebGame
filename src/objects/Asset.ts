import { KeyController } from "../Services/KeyController";
import * as three from "three";

export abstract class Asset {
	abstract Interval(keyController: KeyController, timeSplit: number): void;
	protected element: three.Object3D;
	get Element(): three.Object3D {
		return this.element;
	}

	protected ray: three.Raycaster;
	protected box: three.Box3;
	get Ray(): three.Raycaster { return this.ray; }
	get Box(): three.Box3 {
		return null;
	}


	public AddElement(scene: three.Scene) {
		scene.add(this.Element);
		this.ray = new three.Raycaster(this.element.position)
	}
}
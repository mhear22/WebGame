import { Asset } from "./Asset";
import { Object3D } from "three";
import * as three from "three";

export class Cube implements Asset {

	private UpPressed: boolean;
	private DownPressed: boolean;

	private element:Object3D;
	constructor() {
		var geo = new three.BoxGeometry(1, 1, 1);
		var mat = new three.MeshBasicMaterial({ color: 'red' });
		this.element = new three.Mesh(geo, mat);
	}

	public KeyUp(key: KeyboardEvent) {
		if (key.key == "w") {
			this.UpPressed = true;
		}
		else if (key.key == "s") {
			this.DownPressed = true;
		}
	}
	
	public KeyDown(key: KeyboardEvent) {
		if (key.key == "w") {
			this.UpPressed = false;
		}
		else if (key.key == "s") {
			this.DownPressed = false;
		}
	}

	public Interval() {
		var mov = 0.1;
		if(this.UpPressed) {
			this.element.translateX(mov);
		}
		if(this.DownPressed) {
			this.element.translateX(-mov);
		}
	}

	get Element() {
		return this.element;
	}
}
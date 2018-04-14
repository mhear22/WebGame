import { Asset } from "./Asset";
import { Object3D } from "three";
import * as three from "three";

export class Cube implements Asset {

	private UpPressed: boolean;
	private DownPressed: boolean;
	private LeftPressed: boolean;
	private RightPressed: boolean;

	private element: Object3D;
	constructor() {
		var geo = new three.BoxGeometry(1, 1, 1);
		var mat = new three.MeshBasicMaterial({ color: 'red' });
		this.element = new three.Mesh(geo, mat);
	}

	public KeyUp(key: KeyboardEvent) {
		if (key.key == "w")
			this.UpPressed = true;
		else if (key.key == "s")
			this.DownPressed = true;
		else if (key.key == "a")
			this.LeftPressed = true;
		else if (key.key == "d")
			this.RightPressed = true;
	}

	public KeyDown(key: KeyboardEvent) {
		if (key.key == "w")
			this.UpPressed = false;
		else if (key.key == "s")
			this.DownPressed = false;
		else if (key.key == "a")
			this.LeftPressed = false;
		else if (key.key == "d")
			this.RightPressed = false;
	}

	public Interval() {
		var mov = 0.1;
		if (this.UpPressed)
			this.element.translateY(mov);
		if (this.DownPressed)
			this.element.translateY(-mov);
		if (this.LeftPressed)
			this.element.translateX(-mov);
		if(this.RightPressed)
			this.element.translateX(mov);
	}

	get Element() {
		return this.element;
	}
}
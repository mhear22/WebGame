import { Asset } from "./Asset";
import { Object3D } from "three";
import * as three from "three";

export class Cube extends Asset {

	private UpPressed: boolean;
	private DownPressed: boolean;
	private LeftPressed: boolean;
	private RightPressed: boolean;

	private element: Object3D;
	constructor(width:number = 1, height:number = 1,depth:number = 1) {
		super();
		var geo = new three.BoxGeometry(width, height, depth);
		var mat = new three.MeshBasicMaterial({ color: 'red' });
		this.element = new three.Mesh(geo, mat);
	}

	public Interval(keyMap:any) {
		var mov = 0.1;
		if (keyMap["w"])
			this.element.translateY(mov);
		if (keyMap["s"])
			this.element.translateY(-mov);
		if (keyMap["a"])
			this.element.translateX(-mov);
		if (keyMap["d"])
			this.element.translateX(mov);
	}

	get Element() {
		return this.element;
	}
}
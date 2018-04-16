import { Asset } from "./Asset";
import { Object3D } from "three";
import * as three from "three";

export class Cube extends Asset {
	private UpPressed: boolean;
	private DownPressed: boolean;
	private LeftPressed: boolean;
	private RightPressed: boolean;

	constructor(width: number = 1, height: number = 1, depth: number = 1, x:number = 0, y:number = 0, z:number = 0) {
		super();
		var geo = new three.BoxGeometry(width, height, depth);
		var mat = new three.MeshBasicMaterial({ color: 'red' });
		this.element = new three.Mesh(geo, mat);
		this.element.position.x = x;
		this.element.position.y = y;
		this.element.position.z = z;
	}

	public Interval(keyMap: any,timeSplit:number) {
		var mov = timeSplit;
		if (keyMap["w"])
			this.element.translateZ(mov);
		if (keyMap["s"])
			this.element.translateZ(-mov);
		if (keyMap["d"])
			this.element.translateX(mov);
		if (keyMap["a"])
			this.element.translateX(-mov);
		if (keyMap["e"])
			this.element.translateY(mov);
		if (keyMap["q"])
			this.element.translateY(-mov);
	}
}
import { Asset } from "./Asset";
import { Object3D } from "three";
import * as three from "three";

export class Cube extends Asset {
	private UpPressed: boolean;
	private DownPressed: boolean;
	private LeftPressed: boolean;
	private RightPressed: boolean;

	constructor(
		public width: number = 1,
		public height: number = 1,
		public depth: number = 1,
		x:number = 0,
		y:number = 0,
		z:number = 0
	) {
		super();
		var geo = new three.BoxGeometry(width, height, depth);
		
		var colors = [
			//'red',
			//'green',
			//'blue',
			//'white',
			'#BBBBBB',
			'#BBBBBB'
		]
		
		var random = Math.floor((Math.random()*(colors.length-1))+1);
		
		var mat = new three.MeshBasicMaterial({ color: colors[random] });
		this.element = new three.Mesh(geo, mat);
		this.element.position.x = x;
		this.element.position.y = y;
		this.element.position.z = z;
	}

	public Interval(keyMap: any,timeSplit:number) {
		
	}
}
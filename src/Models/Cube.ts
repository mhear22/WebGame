import { Asset } from "./Asset";
import { Object3D } from "three";
import * as three from "three";

export class Cube extends Asset {
	constructor(
		public width: number = 1,
		public height: number = 1,
		public depth: number = 1,
		x:number = 0,
		y:number = 0,
		z:number = 0,
		collide:boolean = true
	) {
		super();
		var geo = new three.BoxBufferGeometry(width, height, depth);
		var colors = [
			'#BBBBBB',
			'#BEEEEF'
		];
		this.canCollide = collide;
		
		var random = Math.floor(Math.random()*colors.length)+1;
		var mat = new three.MeshPhongMaterial({ color: colors[random-1] });
		this.element = new three.Mesh(geo, mat);
		this.element.position.x = x;
		this.element.position.y = y;
		this.element.position.z = z;
		this.element.castShadow = true;
		this.element.receiveShadow = true;
	}

	public Interval(keyMap: any,timeSplit:number) { }
}
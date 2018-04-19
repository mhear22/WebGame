import { CameraController } from "./Camera";
import { Asset } from "../../objects/asset";
import { Vector2 } from "three";
import { Cube } from "../../objects/cube";
import * as three from "three";

export class PathMapper {
	constructor(
		private Camera:CameraController,
		private Meshes:Asset[],
		private Scene:three.Scene
	) {
		
	}
	
	private floor:boolean[][] = [];
	
	private ElementAt(x:number, y:number):boolean {
		var normalX = Math.floor((x/10));
		var normalY = Math.floor((y/10));
		
		if(this.floor[normalX]) {
			var point = this.floor[normalX][normalY];
			return point;
		}
		else {
			this.floor[normalX] = [];
		}
		return false;
	}
	
	public Iterate(Step:Number):void {
		var cam = this.Camera.camera.position;
		var CamX = cam.z;
		var CamY = cam.x;
		var positions:Vector2[] = [
			new Vector2(CamX+10,CamY),
			new Vector2(CamX-10,CamY),
			new Vector2(CamX,CamY-10),
			new Vector2(CamX,CamY+10),
			new Vector2(CamX+10,CamY+10),
			new Vector2(CamX-10,CamY+10),
			new Vector2(CamX-10,CamY-10),
			new Vector2(CamX+10,CamY-10)
		];
		
		positions.forEach(pos=> {
			var posHasMesh = this.ElementAt(pos.x,pos.y);
			if(!posHasMesh) {
				var X = Math.floor(pos.x/10);
				var Y = Math.floor(pos.y/10);
				this.floor[X][Y] = true;
				
				var cube = new Cube(10,2,10,Y*10, -10,X*10);
				this.Meshes.push(cube);
				this.Scene.add(cube.Element);
			}
		});
	}
}
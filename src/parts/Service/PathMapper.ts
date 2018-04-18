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
	
	private ElementAt(x:number, y:number):boolean {
		return this.Meshes.some(element => {
			var mesh = element as Cube;
			var pos = mesh.Element.position;
			if(mesh.width && mesh.depth) {
				var maxX = pos.x + (mesh.depth/2)
				var minX = pos.x - (mesh.depth/2)
				if(x > minX && x < maxX) {
					var maxY = pos.x + (mesh.width/2)
					var minY = pos.x - (mesh.width/2)
					return y>minY && y<maxY;
				}
			}
			return false;
		});
	}
	
	public Iterate(Step:Number):void {
		var cam = this.Camera.camera.position;
		var CamX = cam.z;
		var CamY = cam.x;
		var positions:Vector2[] = [
			new Vector2(CamX+10,CamY),
			new Vector2(CamX-10,CamY),
			new Vector2(CamX,CamY-10),
			new Vector2(CamX,CamY+10)
		];
		
		positions.forEach(pos=> {
			var posHasMesh = this.ElementAt(pos.x,pos.y);
			if(!posHasMesh) {
				var X = (Math.floor(cam.z/10)*10);
				var Y = (Math.floor(cam.x/10)*10);
				var cube = new Cube(10,2,10,Y, -10,X);
				this.Meshes.push(cube);
				this.Scene.add(cube.Element);
			}
		});
	}
}
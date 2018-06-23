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
		
		var forWidth = (width:number, position:number):Vector2[] => {
			var offsetLeft=0;
			var offsetRight=1;
			
			var result:Vector2[] = Array.apply(null, {length:width}).map(Number.call, Number)
			.map((x:number)=> {
				var isOdd = (x%2) == 1;
				if(isOdd) {
					return new Vector2(CamX+(offsetLeft++)*10, CamY+position)
				}
				else {
					return new Vector2(CamX+(offsetRight--)*10, CamY+position)
				}
			})
			return result;
		}
		
		var grid = (height:number, width:number):Vector2[] => {
			var baseline = Math.floor(height/2);
			var result:Vector2[][] = Array.apply(null, {length:width}).map(Number.call, Number).map((x:number) => {
				return forWidth(width, (x-baseline)*10);
			});
			var flattened = result.reduce((x:Vector2[],y:Vector2[]) => {
				return x.concat(y);
			});
			return flattened;
		}
		
		var positions:Vector2[] = grid(10,10);
		
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
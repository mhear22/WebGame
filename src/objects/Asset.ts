import { KeyController } from "../Services/KeyController";
import * as three from "three";
import { DebugService } from "../Services/DebugService";

export abstract class Asset {
	abstract Interval(keyController: KeyController, timeSplit: number): void;
	protected element: three.Object3D;
	get Element(): three.Object3D {
		return this.element;
	}

	protected canCollide = true;
	get CanCollide():boolean { return this.canCollide}
	
	protected geo: three.Geometry;
	get Geo(): three.Geometry { return this.geo; }

	protected box: three.Box3;
	get Box(): three.Box3 { return null; }

	private static Index = 0;
	private colidedDirs:three.Vector3[] = []
	public IsCollided = false;
	
	public AddElement(scene: three.Scene) {
		var geometry = (this.Element as three.Mesh).geometry
		if (geometry instanceof three.BufferGeometry)
			this.geo = new three.Geometry().fromBufferGeometry(geometry)
		else
			this.geo = geometry
		this.Element.name = this.constructor.name.toString() + Asset.Index++;
		scene.add(this.Element);
	}
	
	public UnCollide() {
		if(this.IsCollided) {
			var average = new three.Vector3()
			this.colidedDirs.forEach(element => {
				average.x -= element.x;
				average.y -= element.y;
				average.z -= element.z;
			});
			var result = average.clone().divideScalar(this.colidedDirs.length/1).normalize()
			this.colidedDirs = []
			return result
		}
		return new three.Vector3()
	}
	
	public Collide(elements: three.Object3D[]) {
		if(!this.element || !this.canCollide)
			return;
		var elementMesh = (this.Element as three.Mesh)
		
		var first = true;
		this.colidedDirs = []
		this.IsCollided = false;
		
		var results = this.Geo.vertices.map(x=> {
			var name = this.Element.name;
			var glob = x.clone()
				.multiply(this.element.scale)
				.applyMatrix4(elementMesh.matrix)
			var dir = glob.sub(elementMesh.position)
			var dirNorm = dir.clone().normalize()
			var ray = new three.Raycaster(elementMesh.position,dirNorm);
			var objects = elements.filter(x=>x.name != name)
			var max = x.clone().multiply(this.element.scale).distanceTo(new three.Vector3)
			var result = ray.intersectObjects(objects).filter(obj=>obj.distance <= max)
			
			if(result.length > 0) {
				this.IsCollided = true
				this.colidedDirs.push(dirNorm.clone())
				result.forEach(colided => {
					var str = `${colided.object.name} collided with ${name}`
					DebugService.AdditionalText.push(str)
				})
				
			}
		});

		return this.IsCollided
	}
}
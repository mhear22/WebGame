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
	
	public AddElement(scene: three.Scene) {
		var geometry = (this.Element as three.Mesh).geometry
		if (geometry instanceof three.BufferGeometry)
			this.geo = new three.Geometry().fromBufferGeometry(geometry)
		else
			this.geo = geometry
		this.Element.name = this.constructor.name.toString() + Asset.Index++;
		scene.add(this.Element);
	}
	
	public Collide(elements: three.Object3D[]) {
		if(!this.element || !this.canCollide)
			return;
		var elementMesh = (this.Element as three.Mesh)
		
		var isCollided = false;
		var first = true;
		this.Geo.vertices.map(x=> {
			var name = this.Element.name;
			var glob = x.clone().applyMatrix4(elementMesh.matrix)
			var dir = glob.sub(elementMesh.position)
			var dirNorm = dir.clone().normalize()
			var ray = new three.Raycaster(elementMesh.position,dirNorm);
			var objects = elements.filter(x=>x.name != name)
			
			var result = ray.intersectObjects(objects)
			
			if(result.length > 0) {
				isCollided = true
				result.forEach(colided => {
					var str = `${colided.object.name} collided with ${name}`
					DebugService.AdditionalText.push(str)
				})
			}
		})
		
		return isCollided
	}
}
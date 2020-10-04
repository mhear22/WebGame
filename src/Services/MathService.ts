import * as three from "three";

export class MathService {
	public static DirectionTo(point: three.Vector3, target: three.Vector3): three.Vector3 {
		var vec = new three.Vector3(
			target.x - point.x,
			target.y - point.y,
			target.z - point.z,
		)
		vec = vec.normalize();
		return vec;
	}
	
	public static RayCast(options: {
		point: three.Vector3,
		direction: three.Vector3,
		objects: three.Object3D[],
		far?: number
	}) {
		var caster = new three.Raycaster(options.point, options.direction, 0, options.far || 1000)
		return caster.intersectObjects(options.objects);
	}
}
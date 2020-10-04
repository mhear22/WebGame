import * as three from "three";

export class MathService {
	public static DirectionTo(point: three.Vector3, target: three.Vector3): three.Vector3 {
		return target.clone().sub(point.clone()).normalize();
	}
	
	public static RayCast(options: {
		point: three.Vector3,
		direction: three.Vector3,
		objects: three.Object3D[],
		far?: number
	}) {
		var caster = new three.Raycaster(options.point.clone(), options.direction, 0, options.far || 1000)
		return caster.intersectObjects(options.objects);
	}
}
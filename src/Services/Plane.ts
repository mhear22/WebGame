import { CameraController } from "./CameraController";
import * as three from "three";

export class PlaneMapper {
	constructor(
		private Camera:CameraController,
		private Scene:three.Scene
	) {
		var mat = new three.MeshPhongMaterial({
			color:0x6C6C6C
		});
		var plane = new three.Mesh(new three.PlaneGeometry(10000,10000), mat);
		plane.receiveShadow = true;
		plane.rotation.x = -Math.PI / 2;
		plane.position.y = -9
		Scene.add(plane);
	}
}
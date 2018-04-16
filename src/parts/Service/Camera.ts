import * as three from "three";
import { Vector3 } from "three";

export class CameraController {
	private perspectiveCamera: three.PerspectiveCamera;
	private mouseLocked: boolean;
	private FOV: number = 75;

	constructor(private canvas: HTMLCanvasElement) {
		this.perspectiveCamera = new three.PerspectiveCamera(this.FOV, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.UpdateCamera();
	}

	public UpdateCamera(): void {
		var changed = false;
		if (this.camera.fov != this.FOV) {
			this.camera.fov = this.FOV;
			changed = true;
		}


		if (changed)
			this.camera.updateProjectionMatrix();
	}

	public Interval(keyMap: any, timeSplit: number): void {
		if (keyMap["+"]) {
			if (this.FOV < 179)
				this.FOV += 1;
		}
		if (keyMap["-"]) {
			if (this.FOV > 1)
				this.FOV -= 1;
		}
		if (keyMap["-"] || keyMap["+"]) {
			console.log(this.FOV);
		}
		this.UpdateCamera();
	}

	public Rotate(x: number, y: number): void {
		this.camera.rotateOnWorldAxis(new Vector3(0, 1, 0), x);
		this.camera.rotateOnWorldAxis(new Vector3(1, 0, 0), y);

		this.camera.rotation.z = 0;
		if (this.camera.rotation.x > 1.8)
			this.camera.rotation.x = 1.8;
		else if (this.camera.rotation.x < -1.8)
			this.camera.rotation.x = -1.8;
		if (this.camera.rotation.y > 1.8)
			this.camera.rotation.y = 1.8;
		else if (this.camera.rotation.y < -1.8)
			this.camera.rotation.y = -1.8;
	}

	public MouseEvent(mouse: MouseEvent, mouseKey: number = 0) {
		this.mouseLocked = !(document.pointerLockElement !== this.canvas)

		if (this.mouseLocked) {
			var sen = 1000;
			this.Rotate(mouse.movementX / sen, mouse.movementY / sen);
		}
		if (!this.mouseLocked && mouseKey > 0)
			this.canvas.requestPointerLock();
	}

	get camera(): three.PerspectiveCamera {
		return this.perspectiveCamera;
	}
}
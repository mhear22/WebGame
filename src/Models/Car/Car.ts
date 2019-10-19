import { FileAsset } from "../../Objects/FileAsset";
import { KeyController } from "../../Services/KeyController";
import { CameraController } from "../../Services/CameraController";
import { Vector3 } from "three";
import { PlayerService } from "../../Services/PlayerService";
import * as three from "three"


export class CarModel extends FileAsset {
	constructor(
		private keyController: KeyController,
		private Camera: CameraController,
		private position: three.Vector3 = new three.Vector3(),
		private rotation: number = 0,
		private bricked = false
	) {
		super(require("./Car.obj"), require("./Car.mtl"));
	}

	OnLoaded() {
		this.element.scale.addScalar(2);
		this.element.position.copy(this.position);
		this.keyController.WaitFor("f", () => {
			var dist = this.element.position.distanceTo(this.Camera.camera.position)
			if (dist <= 20) {
				PlayerService.WalkingControls = this.isBeingUsed;
				this.isBeingUsed = !this.isBeingUsed;
			}
		})
	}
	private isBeingUsed = false;
	private momentum: three.Vector3 = new three.Vector3()
	private speed = 0;

	Interval(keyController: KeyController, timeSplit: number): void {

		if (this.isBeingUsed) {
			if (keyController.KeyMap["w"])
				this.momentum.z += timeSplit;
			if (keyController.KeyMap["s"])
				this.momentum.z -= timeSplit;

			if (this.momentum.z >= -0.1) {
				if (keyController.KeyMap["a"])
					this.rotation += timeSplit;
				if (keyController.KeyMap["d"])
					this.rotation -= timeSplit;
			}
			else {
				if (keyController.KeyMap["a"])
					this.rotation -= timeSplit;
				if (keyController.KeyMap["d"])
					this.rotation += timeSplit;
			}
		}
		else if (this.bricked) {
			this.momentum.z += timeSplit;
		}

		if (!this.IsCollided) {
			this.momentum.z = this.momentum.z * (1 - timeSplit);
			this.Move(this.momentum.clone());
		}
		else {
			var escapeDir = this.UnCollide()
			escapeDir.y = 0;
			escapeDir.normalize()
			var mentum = (this.momentum.clone()).applyAxisAngle(this.Camera.camera.up, this.rotation).normalize()
			if((mentum.z + mentum.x + mentum.y) != 0) {
				var angle = three.Math.radToDeg(mentum.angleTo(escapeDir))
				if(!isNaN(angle)) {
					if (angle < 90) {
						this.Move(this.momentum.clone())
					}
					else {
						this.momentum.setZ(0).setX(0)
					}
				}
			}
		}

		this.element.rotation.y = this.rotation;
		if (this.isBeingUsed) {
			this.Camera.camera.position.copy(this.element.position)
			this.Camera.camera.position.y = this.element.position.y + 5;
		}
	}

	private Move(vector: Vector3) {
		if (this.element) {
			vector.applyAxisAngle(this.Camera.camera.up, this.rotation);
			this.element.position.add(vector);
		}
	}
}
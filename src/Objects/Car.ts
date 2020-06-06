import { Asset } from "./Asset";
import * as three from "three";
import { Sun } from "./Sun";
import { KeyController } from "../Services/KeyController";
import { CameraController } from "../Services/CameraController";
import { Vector3 } from "three";
import { BodyItem } from "./BodyItem";
import { PlayerService } from "../Services/PlayerService";


export class Car extends Asset {
	private BodyItems: BodyItem[] = [];
	public IsDriving: boolean = false;
	constructor(
		scene: three.Scene,
		private camera: CameraController,
		keyController: KeyController
	) {
		super();
		
		var geo = new three.BoxBufferGeometry(4, 2, 4);
		var mat = new three.MeshPhongMaterial();
		this.element = new three.Mesh(geo, mat);
		this.element.castShadow = true;
		this.element.receiveShadow = true;
		this.element.position.x = 4;
		this.element.position.y = 1;
		this.element.position.z = -20;

		var lightRecess = -1.80;
		this.BodyItems.push({
			Item: new Sun(scene, 0, 0, 0, .25),
			positionOffset: new three.Vector3(lightRecess, 0, -1.5)
		});

		this.BodyItems.push({
			Item: new Sun(scene, 0, 0, 0, .25),
			positionOffset: new three.Vector3(lightRecess, 0, +1.5)
		});


		this.BodyItems.push({
			Item: new Sun(scene, 0, 0, 0, .25, 0xFF0000, 0.1),
			positionOffset: new three.Vector3(-lightRecess, 0, -1.5)
		})

		this.BodyItems.push({
			Item: new Sun(scene, 0, 0, 0, .25, 0xFF0000, 0.1),
			positionOffset: new three.Vector3(-lightRecess, 0, +1.5)
		})

		this.BodyItems.forEach(x => {
			scene.add(x.Item.Element);
		})

		keyController.WaitFor("enter", () => {
			if (this.camera.camera.position.distanceTo(this.element.position) < 10) {
				this.ToggleDrivingMode();
			}
		}, 100);
	}

	private ToggleDrivingMode() {
		if (this.IsDriving) {
			this.camera.camera.position.y = 8;
			PlayerService.WalkingControls = true;
		}
		else {
			PlayerService.WalkingControls = false;
		}
		this.IsDriving = !this.IsDriving;
	}

	private UpdatePositions() {
		this.BodyItems.forEach(x => {
			x.Item.Element.position.copy(this.element.position);
			var pos = new three.Vector3().copy(x.positionOffset);
			
			pos.applyAxisAngle(this.element.up,this.element.rotation.y);
			
			x.Item.Element.position.x += pos.x
			x.Item.Element.position.y += pos.y
			x.Item.Element.position.z += pos.z
		});

		if (this.IsDriving) {
			this.camera.camera.position.copy(this.element.position);
			this.camera.camera.position.y += 2;
		}
	}

	private Momentum: Vector3 = new three.Vector3();
	public Interval(keyController: KeyController, timeSplit: number) {
		if (this.IsDriving) {
			var mod = 0.1;
			if (keyController.KeyMap["w"]) {
				this.Momentum.x -= timeSplit*mod;
			}

			if (keyController.KeyMap["s"]) {
				this.Momentum.x += timeSplit*mod;
			}

			if(keyController.KeyMap["a"]) {
				this.element.rotation.y += 0.01;
			}

			if(keyController.KeyMap["d"]) {
				this.element.rotation.y -= 0.01;
			}
		}

		this.element.position.add(new three.Vector3().copy(this.Momentum).applyAxisAngle(this.element.up,this.element.rotation.y));
		this.Momentum.x = (this.Momentum.x * ((-timeSplit * 0.01) + 1));
		this.UpdatePositions();
		this.BodyItems.forEach(x => {
			x.Item.Interval(keyController, timeSplit);
		})
	}
}
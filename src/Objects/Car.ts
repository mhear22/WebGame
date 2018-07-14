import { Asset } from "./Asset";
import * as three from "three";
import { Sun } from "./Sun";
import { KeyController } from "../Services/KeyController";
import { CameraController } from "../Services/CameraController";
import { Vector3 } from "three";


export class Car extends Asset {
	private leftLight: Sun;
	private rightLight: Sun;
	
	private driving:boolean = false;
	constructor(
		scene:three.Scene,
		private camera:CameraController,
		keyController:KeyController
	) {
		super();
		var geo = new three.BoxGeometry(4,2,4);
		var mat = new three.MeshPhongMaterial();
		this.element = new three.Mesh(geo, mat);
		this.element.castShadow = true;
		this.element.receiveShadow = true;
		this.element.position.x = 4;
		this.element.position.y = 1;
		this.element.position.z = -20;
		
		this.leftLight = new Sun(scene,
			this.element.position.x - 2.05,
			this.element.position.y,
			this.element.position.z - 1.5,
			.125
		);
		this.rightLight = new Sun(scene,
			this.element.position.x - 2.05,
			this.element.position.y,
			this.element.position.z + 1.5,
			.125
		);
		scene.add(this.leftLight.Element);
		scene.add(this.rightLight.Element);
		
		keyController.WaitFor("enter", () => {
			if(this.camera.camera.position.distanceTo(this.element.position) < 10) {
				this.ToggleDrivingMode();
			}
		},100);
	}
	
	private ToggleDrivingMode() {
		if(this.driving) {
			this.camera.ToggleMaps();
			this.camera.camera.position.y = 8;
		}
		else {
			this.camera.ToggleMaps();
		}
		this.driving = !this.driving;
	}
	
	private UpdatePositions() {
		this.leftLight.Element.position.copy(this.element.position);
		this.leftLight.Element.position.x -= 2.05;
		this.leftLight.Element.position.z -= 1.5;
		
		this.rightLight.Element.position.copy(this.element.position);
		this.rightLight.Element.position.x -= 2.05;
		this.rightLight.Element.position.z += 1.5;
		
		if(this.driving) {
			this.camera.camera.position.copy(this.element.position);
			this.camera.camera.position.y +=2;
		}
	}
	
	private Momentum:Vector3 = new three.Vector3();
	public Interval(keyController:KeyController,timeSplit:number) {
		this.leftLight.Interval(keyController,timeSplit);
		this.rightLight.Interval(keyController, timeSplit);
		
		if(this.driving) {
			if(keyController.KeyMap["w"]) {
				this.Momentum.x -= 0.01;
			}
			if (keyController.KeyMap["s"]) {
				this.Momentum.x += 0.01;
			}
			
			//if(keyController.KeyMap["a"]) {
			//	this.element.rotation.y += 0.01;
			//}
			//
			//if(keyController.KeyMap["d"]) {
			//	this.element.rotation.y -= 0.01;
			//}
			
		}
		
		this.element.position.add(this.Momentum);
		this.Momentum.x = (this.Momentum.x * ((-timeSplit * 0.01) + 1));
		this.UpdatePositions();
	}
}
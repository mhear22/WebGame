import { SceneBase } from "./SceneBase";
import { CameraController } from "../Services/CameraController";
import { KeyController } from "../Services/KeyController";
import { Sun } from "../Objects/Sun";
import { Cube } from "../Objects/Cube";
import { Skybox } from "../Objects/Skybox";
import * as three from 'three';
import { Injector } from "@angular/core";

export class TestScene extends SceneBase {
	public Iterate(keyController: KeyController, Step: number): void {
		this.Meshes.forEach(element => {
			try {
				element.Collide(this.CollideMeshes)
				element.Interval(keyController, Step);
			}
			catch {}
		});
	}

	constructor(
		protected Camera: CameraController,
		keyController: KeyController,
		injector: Injector
	) {
		super(Camera, injector);
		//this.Scene.add(new three.AmbientLight("0x404040"))
		this.Add(new Sun(this.Scene, 0, 80, 0));
		this.Add(new Cube(100, 1, 100, 0, -2, 0));
		this.Add(new Skybox(this.Camera));
	}
}
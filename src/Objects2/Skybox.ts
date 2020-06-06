import { Asset } from "./Asset";
import { KeyController } from "../Services/KeyController";
import * as three from "three";
import { CameraController } from "../Services/CameraController";
const imageSrc = require("../Assets/skybox.jpg")

export class Skybox extends Asset {
	Interval(key: KeyController, split: number) {
		this.element.position.x = this.camera.camera.position.x
		this.element.position.y = this.camera.camera.position.y
		this.element.position.z = this.camera.camera.position.z
	}
	constructor(private camera:CameraController) {
		super();
		
		this.canCollide = false;
		var texture = new three.TextureLoader().load(imageSrc)
		texture.magFilter = three.LinearFilter;
		texture.minFilter = three.LinearFilter;
		
		var shader = three.ShaderLib.equirect;
		var material = new three.ShaderMaterial({
			fragmentShader: shader.fragmentShader,
			vertexShader: shader.vertexShader,
			uniforms: shader.uniforms,
			depthWrite: false,
			side: three.BackSide,
		});
		material.uniforms.tEquirect.value = texture;
		
		var dist = CameraController.Far * 0.99;
		var geo = new three.BoxBufferGeometry(dist,dist,dist)
		this.element = new three.Mesh(geo,material)
		
		this.element.receiveShadow = true;
	}
}
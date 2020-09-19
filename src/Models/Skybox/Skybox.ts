import { Asset } from "../Asset";
import { KeyController } from "../../Services/KeyController";
import * as three from "three";
import { CameraController } from "../../Services/CameraController";
const imageSrc = require("./tim-barton-3.jpg")

export class Skybox extends Asset {
	Interval(key: KeyController, split: number) {
		this.element.position.x = this.camera.camera.position.x
		this.element.position.y = this.camera.camera.position.y
		this.element.position.z = this.camera.camera.position.z
	}
	constructor(private camera:CameraController) {
		super();
		var daytime = false;
		
		if(daytime) {
			var box = [
				require("./Daylight Box_Right.bmp"),
				require("./Daylight Box_Left.bmp"),
				require("./Daylight Box_Top.bmp"),
				require("./Daylight Box_Bottom.bmp"),
				require("./Daylight Box_Front.bmp"),
				require("./Daylight Box_Back.bmp"),
			];
			
			var results = box.map(x=> {
				var result = new three.MeshBasicMaterial({
					map:new three.TextureLoader().load(x)
				});
				result.side = three.BackSide;
				return result;
			});
			
			
			var dist = CameraController.Far * 0.99;
			var geo = new three.BoxBufferGeometry(dist,dist,dist)
			this.element = new three.Mesh(geo,results)
			
			this.element.receiveShadow = true;
		}
		else {
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
			
		}
	}
}
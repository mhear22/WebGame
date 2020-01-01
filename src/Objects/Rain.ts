import { Asset } from "./Asset";
import { KeyController } from "../Services/KeyController";
import * as three from 'three';

export class Rain extends Asset {
	private flicked = false;
	Interval(keyController: KeyController, timeSplit: number): void {
		//https://gpfault.net/posts/webgl2-particles.txt.html
		var loadedUniforms = ((this.element as three.Points).material as three.ShaderMaterial).uniforms
		var color = loadedUniforms.color.value
		if(this.flicked)
			loadedUniforms.color.value = new three.Color(0xff0000)
		else
			loadedUniforms.color.value = new three.Color(0xffffff)
		this.flicked = !this.flicked;
		
		loadedUniforms.i_Velocity.value;
	}

	constructor() {
		super();

		var geo = new three.Geometry();
		for (var i = 0; i < 1000; i++) {
			var vect = new three.Vector3(
				three.Math.randFloatSpread(20),
				three.Math.randFloatSpread(20) + 10,
				three.Math.randFloatSpread(20) - 10
			);

			geo.vertices.push(vect);
		}

		
		
		var uniforms = {
			color: { value: new three.Color(0xff0000) }
		};

		var vert = require("../Shaders/Rain/vertex.vert");
		var frag = require("../Shaders/Rain/fragment.frag");
		var shad = new three.ShaderMaterial({
			uniforms: uniforms,
			vertexShader: vert,
			fragmentShader: frag,
			
		});

		this.element = new three.Points(geo, shad)
	}
}
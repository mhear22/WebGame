import { Asset } from "./Asset";
import { KeyController } from "../Services/KeyController";
import * as three from 'three';

export class Rain extends Asset {
	Interval(keyController: KeyController, timeSplit: number): void {
		//https://gpfault.net/posts/webgl2-particles.txt.html
		var loadedUniforms = ((this.element as three.Points).material as three.ShaderMaterial).uniforms
		
		loadedUniforms.age.value = (loadedUniforms.age.value + timeSplit);
	}

	constructor(
		pos:three.Vector3 = new three.Vector3(0,0,-10),
		scale:three.Vector3 = new three.Vector3(50,50,20),
		intensity=2000
	) {
		super();

		var geo = new three.Geometry();
		for (var i = 0; i < intensity; i++) {
			var vect = new three.Vector3(
				three.Math.randFloatSpread(scale.x),
				three.Math.randFloatSpread(scale.y),
				three.Math.randFloatSpread(scale.z)
			);

			geo.vertices.push(vect);
		}
		
		
		var uniforms = {
			color: { value: new three.Color(0xffffff) },
			height: {value: scale.y},
			age: { value: 0.0 }
		};

		var vert = require("../Shaders/Rain/vertex.vert");
		var frag = require("../Shaders/Rain/fragment.frag");
		var shad = new three.ShaderMaterial({
			uniforms: uniforms,
			vertexShader: vert,
			fragmentShader: frag,
			
		});

		this.element = new three.Points(geo, shad);
		if(pos)
			this.element.position.copy(pos);
	}
}
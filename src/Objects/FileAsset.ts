import { Asset } from "./Asset";
import { KeyController } from "../Services/KeyController";
import * as objloader from "webgl-obj-loader"
import * as three from "three";
import { MTLLoader } from "../Services/MTLLoader";
require('three-obj-loader')(three);


export abstract class FileAsset extends Asset {
	constructor(private mesh:string, private mat?:string) {
		super();
	}
	
	public AddElement(scene: three.Scene) {
		var requests = [];
		requests.push(this.download(this.mesh));
		if(this.mat)
			requests.push(this.download(this.mat))
		Promise.all(requests).then((data) => {
			var mesh = data[0];
			var loader = new three.OBJLoader();
			
			if(data[1]) {
				var material = data[1];
				var mtl = new MTLLoader();
				var parsedMaterial = mtl.parse(material)
				loader.setMaterials(parsedMaterial)
			}
			
			var group = loader.parse(mesh);
			this.element = group.children[0]
			this.element.castShadow = true;
			this.element.receiveShadow = true;
			this.OnLoaded();
			scene.add(this.element);
		});
	}
	
	
	protected abstract OnLoaded(): void;
	
	private download(url:string): Promise<string> {
		return new Promise(function (resolve:any, reject:any) {
			var xhr = new XMLHttpRequest();
			xhr.onload = () => { resolve(xhr); }
			xhr.onerror = reject
			xhr.open('GET', url)
			xhr.send()
		}).then((x:any)=> {
			return x.response;
		});
	}
}
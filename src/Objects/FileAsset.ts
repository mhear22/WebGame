import { Asset } from "./Asset";
import { KeyController } from "../Services/KeyController";
import * as objloader from "webgl-obj-loader"
import * as three from "three";
require('three-obj-loader')(three);

export abstract class FileAsset extends Asset {
	constructor(private file:string) {
		super();
	}
	
	public AddElement(scene: three.Scene) {
		this.download(this.file).then(x=> {
			var loader = new three.OBJLoader();
			var group = loader.parse(x);
			this.element = group.children[0]
			if(this.element instanceof three.Mesh) {
				var mat = new three.MeshPhongMaterial({
					side:three.FrontSide,
					color: "#BBBBBB",
					transparent: true
				})
				
				this.element.material = mat;
			}
			this.element.castShadow = true;
			this.element.receiveShadow = true;
			this.OnLoaded();
			scene.add(this.element);
		})
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
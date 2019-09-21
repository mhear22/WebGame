import { Asset } from "./Asset";
import { KeyController } from "../Services/KeyController";
import * as objloader from "webgl-obj-loader"
import * as three from "three";
require('three-obj-loader')(three);

export class FileAsset extends Asset {
	constructor(private file:string) {
		super();
	}
	
	public AddElement(scene: three.Scene) {
		this.download(this.file).then(x=> {
			var loader = new three.OBJLoader();
			var group = loader.parse(x);
			this.element = group.children[0]
			this.element.castShadow = true;
			this.element.receiveShadow = true;
			scene.add(this.Element);
		})
	}
	
	
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
	
	
	Interval(keyController: KeyController, timeSplit: number): void {
	}
	
}
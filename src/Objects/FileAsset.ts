import { Asset } from "./Asset";
import { KeyController } from "../Services/KeyController";
const car = require('../Models/Car.obj')
import * as objloader from "webgl-obj-loader"
import * as three from "three";
require('three-obj-loader')(three);

export class FileAsset extends Asset {
	constructor(file:string) {
		super();
		
		this.download(car).then(x=> {
			var loader = new three.OBJLoader();
			
			var group = loader.parse(x);
			
			this.element = group.children[0]
			this.element.castShadow = true;
			this.element.receiveShadow = true;
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
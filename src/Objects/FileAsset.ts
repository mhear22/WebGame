import { Asset } from "./Asset";
import { KeyController } from "../Services/KeyController";
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
			var loader = new (three as any).OBJLoader();
			
			if(data[1]) {
				var material = data[1];
				var mtl = new MTLLoader();
				var parsedMaterial = mtl.parse(material)
				loader.setMaterials(parsedMaterial)
			}
			
			var group = loader.parse(mesh);
			var meshData = (group.children[0] as three.Mesh);
			this.element = meshData;
			meshData.geometry.computeBoundingBox()
			this.box = meshData.geometry.boundingBox;
			this.element.castShadow = true;
			this.element.receiveShadow = true;
			
			var geometry = (this.Element as three.Mesh).geometry
			if (geometry instanceof three.BufferGeometry)
				this.geo = new three.Geometry().fromBufferGeometry(geometry)
			else
				this.geo = geometry
			this.Element.name = this.constructor.name.toString()
			
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
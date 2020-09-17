import { ServiceBase } from "./ServiceBase";
import { CameraController } from "./CameraController";
import { KeyController } from "./KeyController";
import { Injector, inject } from "@angular/core";
import { SceneBase } from "../Scenes/SceneBase";
import { Servicer } from "./Servicer";

export class HtmlModel {
	public html: string;
	public name: string;
}

export class ServiceManager {
	
	private Iterators:ServiceBase[]=[];
	private DrawsHtml:ServiceBase[]=[];
	
	public Iterate(split:number) {
		this.Iterators.forEach(element => {
			element.Iterate(split)
		});
	}
	
	public ActiveScene: SceneBase;
	
	public Htmls():HtmlModel[] {
		return this.DrawsHtml.map(x=> {
			var name = x.constructor.name;
			var html = x.GetHtml();
			return { name: name, html: html};
		})
	}
	
	public constructor(
		services: any[],
		cam: CameraController,
		key: KeyController,
		injector: Injector
	) {
		services.map(x=>{
			var obj = new x(cam, key, injector)
			if(obj instanceof ServiceBase) {
				if(obj.Iterates)
					this.Iterators.push(obj);
				if(obj.DrawsHtml)
					this.DrawsHtml.push(obj)
				obj.GetScene = () => this.ActiveScene;
			}
			Servicer.Provide(obj, x.name)
		})
	}
}
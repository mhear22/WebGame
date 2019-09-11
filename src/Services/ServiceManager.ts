import { ServiceBase } from "./ServiceBase";
import { CameraController } from "./CameraController";
import { KeyController } from "./KeyController";

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
		key: KeyController
	) {
		services.map(x=>{
			var obj = new x(cam, key)
			if(obj instanceof ServiceBase) {
				if(obj.Iterates)
					this.Iterators.push(obj);
				if(obj.DrawsHtml)
					this.DrawsHtml.push(obj)
			}
		})
	}
}
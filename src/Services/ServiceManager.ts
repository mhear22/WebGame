import { ServiceBase } from "./ServiceBase";

export class ServiceManager {
	
	private Iterators:any[]=[];
	
	public Iterate(split:number) {
		this.Iterators.forEach(element => {
			element(split)
		});
	}
	
	public constructor(services:any[]) {
		services.map(x=>{
			if(x.Iterates)
				this.Iterators.push(x.Iterate);
		})
	}
}
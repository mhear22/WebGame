import { Injector } from "@angular/core";
import { SettingItem } from "../Parts/Inventory/SettingItem";

var images:any = {
	"cube": require("../Parts/Inventory/cube.png"),
	"default": require("../Parts/Inventory/default.png")
}

export class InventoryItem {
	constructor(
		public Name:string,
		public Data?:object,
		public Action?: (self?:InventoryItem) => InventoryItem|void,
		public Interact?: (self?:InventoryItem) => InventoryItem|void
	) {
		this.BaseClass = this.constructor.name;
	}
	
	public BaseClass: string;
	
	public get ImageUrl():string {
		return images[this.Name];
	}
	
	public get Html():string {
		if(this.ImageUrl) {
			return `<img src="${this.ImageUrl}">`
		}
		
		return `<div>
			${this.Name}
		</div>`;
	}
}

export class II extends InventoryItem { }
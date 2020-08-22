import { SettingItem } from "../Parts/Inventory/SettingItem";

var images:any = {
	"cube": require("../Parts/Inventory/cube.png")
}

export class InventoryItem {
	constructor(
		public Name:string,
		public Data?:object,
		public Action?: (self?:InventoryItem) => InventoryItem|void
	) { }
	
	public get ImageUrl():string {
		return images[this.Name]
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
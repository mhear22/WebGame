var images:any = {
	"cube": require("../Parts/Inventory/cube.png")
}

export class InventoryItem {
	public name: string;
	public get imageUrl():string {
		return images[this.name]
	}
}
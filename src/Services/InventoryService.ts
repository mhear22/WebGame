import { InventoryItem } from "../DataModels/InventoryItem";
import { ServiceBase } from "./ServiceBase";

export class InventoryService extends ServiceBase {
	public DrawsHtml: boolean = false;
	public Iterates: boolean = false;
	
	private static inventoryItems: InventoryItem[] = []
	
	public static get Inventory():InventoryItem[] {
		return this.inventoryItems;
	}
	
	public static AddItem(name: string) {
		var item = new InventoryItem(name);
		this.inventoryItems.push(item);
	}
}
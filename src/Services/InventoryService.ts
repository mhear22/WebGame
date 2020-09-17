import { InventoryItem } from "../DataModels/InventoryItem";
import { ServiceBase } from "./ServiceBase";

export class InventoryService extends ServiceBase {
	public DrawsHtml: boolean = false;
	public Iterates: boolean = false;
	
	private static inventoryItems: InventoryItem[] = []
	private static equiped?: number = null;
	
	public static get Inventory():InventoryItem[] {
		return this.inventoryItems;
	}
	
	public static AddItem(name: string) {
		var item = new InventoryItem(name);
		this.inventoryItems.push(item);
	}
	
	public static AddInventoryItem(item: InventoryItem) {
		this.inventoryItems.push(item);
	}
	
	public static SetEquipedItem(item: InventoryItem) {
		this.equiped = this.inventoryItems.indexOf(item);
	}
	
	public static get EquipedItem():InventoryItem {
		if(this.equiped != null) {
			return this.inventoryItems[this.equiped]
		}
		return null;
	}
}
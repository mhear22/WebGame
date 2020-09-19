import { ThrowStmt } from "@angular/compiler";
import { InventoryItem } from "../DataModels/InventoryItem";
import { FishingPoleItem } from "../Models/FishingPole/FishingPoleItem";
import { DebugService } from "./DebugService";
import { ServiceBase } from "./ServiceBase";

export class InventoryService extends ServiceBase {
	private static ExampleItems =  [
		() => new FishingPoleItem({})
	].map(x=> {
		var inst = x();
		return {
			Name: inst.constructor.name,
			Example: inst
		}
	})
	
	public DrawsHtml: boolean = false;
	public Iterates: boolean = false;
	
	private static inventoryItems: InventoryItem[] = []
	private static equiped: number = 0;
	
	public static get Inventory():InventoryItem[] {
		return this.inventoryItems;
	}
	
	public static AddItem(name: string) {
		var item = new InventoryItem(name);
		this.inventoryItems.push(item);
	}
	
	public static AddInventoryItem(item: InventoryItem) {
		var baseline = this.ExampleItems.filter(x=>x.Name == item.BaseClass)[0];
		if(baseline) {
			var obj = baseline.Example;
			obj.Data = item.Data;
			this.inventoryItems.push(obj);
		}
		else {
			DebugService.Message(`Cant find baseline for ${item.BaseClass}`);
			this.inventoryItems.push(item);
		}
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
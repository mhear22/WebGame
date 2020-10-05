import { InventoryItem } from "../../DataModels/InventoryItem";
import { Fish } from "./Fish";

export class FishItem extends InventoryItem {
	constructor(
		private original: Fish
	) {
		super("Fish", null,null, () => {})
	}
}
import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { KeyController } from "../../Services/KeyController";
import { SettingItem } from "./SettingItem"
import { SceneLoader } from "../../Scenes/SceneLoader";


@Component({
	selector: 'InventoryDialog',
	template: require('./Inventory.html'),
})


export class InventoryDialog {
	private Options: SettingItem[] = [];
	private Selected: number = 0;
	private isClosed = false;

	constructor(
		@Inject(MAT_DIALOG_DATA) private keyController: KeyController,
		@Inject(MatDialogRef) private dialogRef:MatDialogRef<any>
	) {
		dialogRef.beforeClose().subscribe(() => {
			this.isClosed = true;
		});
		
		
		this.Options = [
			{
				Name: "Do 1 thing",
				Data: { setting: true },
				Action: (self) => {
					var data: any = self.Data
					data.setting = !data.setting
					if (data.setting)
						self.Name = "Do 1 thing"
					else
						self.Name = "Dont 1 thing"
					self.Data = data;
					return self;
				}
			},
			{
				Name: "Do Another thing", Action: () => {},
			},
			{
				Name: "Load Sandbox World", Action: () => {
					SceneLoader.LoadLevel("Sandbox")
				}
			},
			{
				Name:"Quit",
				Action: () => {
					SceneLoader.LoadLevel("MainMenu")
					//Go to a home screen
				}
			}
		]

		keyController.WaitFor("w", () => {
			this.Selected--;
			if (this.Selected < 0)
				this.Selected = 0;
		}, 100)

		keyController.WaitFor("s", () => {
			this.Selected++;
			if (this.Selected >= this.Options.length)
				this.Selected = this.Options.length - 1
		}, 100)

		keyController.WaitFor(" ", () => {
			if(this.isClosed)
				return;
			var option = this.Options[this.Selected]
			var response = option.Action(option)
			if (response)
				this.Options[this.Selected] = response
			
		}, 100)
	}
}
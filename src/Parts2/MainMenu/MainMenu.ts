import { Component, Inject, Injector } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material";
import { KeyController } from "../../Services/KeyController";
import { MenuItem } from "../../Objects/MenuItem";
import { DebugService } from "../../Services/DebugService";
import { SceneLoader } from "../../Scenes/SceneLoader";

@Component({
	template: require("./MainMenu.html")
})
export class MainMenuDialog {
	private selected = 0;
	private closed = false;

	private MenuRoot: MenuItem =
		new MenuItem("Root", [
			new MenuItem("Continue"),
			new MenuItem("Level Select", SceneLoader.Levels
			.filter(x=>x.display)
			.map(x=>{
				return new MenuItem(x.name, null, () => { SceneLoader.LoadLevel(x.name) })
			})),
			new MenuItem("Settings", [
				new MenuItem("Shadow Quality"),
				new MenuItem("Debug Settings", null, () => {
					DebugService.DebugMode = !DebugService.DebugMode;
				})
			])
		]);

	private displayedMenu: MenuItem[];

	constructor(
		@Inject(MAT_DIALOG_DATA) private key: KeyController,
		@Inject(MatDialogRef) private ref: MatDialogRef<any>
	) {
		ref.beforeClose().subscribe(() => {
			this.closed = true
		})
		this.displayedMenu = this.MenuRoot.Children;

		setTimeout(() => {
			this.key.WaitFor("w", () => {
				this.selected--
				this.checkSelected()
			});
	
			this.key.WaitFor("s", () => {
				this.selected++
				this.checkSelected()
			});
	
			this.key.WaitFor(` `, () => {
				if(this.closed)
					return;
				var item = this.displayedMenu[this.selected];
	
				if (item.Name == "Back") {
					this.displayedMenu = item.Parent.Parent.Children
				}
				else if (item.Action) {
					item.Action();
				}
				else if (item.Children) {
					this.selected = 0;
					this.displayedMenu = item.Children.filter(x => x.Name != "Back")
					this.displayedMenu.push(new MenuItem("Back", null, null, item))
				}
			})
		},10)
	}

	private checkSelected() {
		if (this.selected >= this.displayedMenu.length)
			this.selected = 0
		else if (this.selected < 0)
			this.selected = this.displayedMenu.length - 1
	}
}
export class SettingItem {
	Name: string = "";
	Data?:object;
	Action: (self?:SettingItem)=>SettingItem|void;
}
export class MenuItem {
	constructor(
		public Name:string,
		public Children: MenuItem[] = null,
		public Action?:()=>void,
		public Parent: MenuItem = null,
	) {
		if(Children)
			Children.forEach(x=> x.Parent = this)
	}
}
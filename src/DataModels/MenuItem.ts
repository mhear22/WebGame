export class MenuItem {
	constructor(
		public Name:string,
		public Children: MenuItem[] = null,
		public Action?:(item?:MenuItem)=>void,
		public Parent: MenuItem = null,
	) {
		if(Children)
			Children.forEach(x=> x.Parent = this)
	}
}
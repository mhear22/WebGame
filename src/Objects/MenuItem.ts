export class MenuItem {
	constructor(
		private Name:string,
		private Children: MenuItem[] = null
	) { }
}
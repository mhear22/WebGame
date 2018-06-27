import { defer, fromEvent, fromEventPattern, bindCallback, Observable } from "rxjs";

export class KeyController {
	public KeyMap:any = {};
	protected ObservableMap:any = {};
	
	public KeyPress(press:KeyboardEvent, isPressed:boolean) {
		var key = press.key.toLowerCase();
		this.KeyMap[key] = isPressed;
		this.KeyMap["shift"] = press.shiftKey;
		this.KeyMap["ctrl"] = press.ctrlKey;
		this.KeyMap["alt"] = press.altKey;
		
		var observe = this.ObservableMap[key];
		if(observe) {
			observe();
		}
		
	}
	
	public WaitFor(key:string, debounce:number=0):Observable<void> {
		var response = bindCallback<void>(callback => {
			var obj = this.ObservableMap[key];
			if(obj) {
				
			}
			else {
				this.ObservableMap[key] = callback;
			}
		})();
		return response;
	}
}
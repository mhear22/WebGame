import { defer, fromEvent, fromEventPattern, bindCallback, Observable } from "rxjs";
import * as moment from "moment";


export class KeyController {
	public KeyMap:any = {};
	protected ObservableMap:any = {};
	
	public KeyPress(press:KeyboardEvent|any, isPressed:boolean) {
		var key = press.key.toLowerCase();
		this.KeyMap[key] = isPressed;
		this.KeyMap["shift"] = press.shiftKey;
		this.KeyMap["ctrl"] = press.ctrlKey;
		this.KeyMap["alt"] = press.altKey;
		
		var observe = this.ObservableMap[key] as CallbackModel;
		if(observe && isPressed == true) {
			if(observe.lastCall < moment().add(-observe.timeout,"ms")) {
				observe.callback();
				observe.lastCall = moment();
				this.ObservableMap[key] = observe;
			}
		}
		
	}
	
	public WaitFor(key:string, callback:() => void, debounce:number=0) {
		var model = new CallbackModel();
		model.callback = callback;
		model.timeout = debounce;
		model.lastCall = moment().add(-1,"d");
		this.ObservableMap[key.toLowerCase()] = model;
	}
}

export class CallbackModel {
	callback:()=>void;
	timeout:number;
	lastCall:moment.Moment;
}
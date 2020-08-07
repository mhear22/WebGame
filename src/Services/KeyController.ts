import { defer, fromEvent, fromEventPattern, bindCallback, Observable, interval } from "rxjs";
import * as moment from "moment";
import { DebugService } from "./DebugService";


export class KeyController {
	public KeyMap:any = {};
	protected ObservableMap:any = {};
	
	private mapping = {
		"button_0":" ",
		"button_12":"w",
		"button_13":"s",
		"button_14":"a",
		"button_15":"d"
	}
	
	public ControllerPress(press:any) {
		var buttonName = press.detail.buttonName;
		var isPressed = press.detail.button.pressed;
		DebugService.Message(`${buttonName} pressed`);
		
		var key = (this.mapping as any)[buttonName];
		this.KeyMap[key] = isPressed;
		
		var observe = this.ObservableMap[key] as CallbackModel;
		if(observe && isPressed == true) {
			if(observe.lastCall < moment().add(-observe.timeout,"ms")) {
				observe.callback();
				observe.lastCall = moment();
				this.ObservableMap[key] = observe;
			}
		}
		var debounce = () => {
			var pad = navigator.getGamepads()[press.detail.gamepad.index]
			var button = pad.buttons[press.detail.index]
			var isPressed = button.pressed;
			if(!isPressed) {
				this.KeyMap[key] = isPressed;
			}
			else {
				setTimeout(() => {debounce()}, 10)
			}
		}
		debounce();
	}
	
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
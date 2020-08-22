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
	
	private TriggerObservable(key: any, isPressed: boolean) {
		var observe = this.ObservableMap[key] as CallbackModel;
		if(observe && isPressed == true) {
			if(observe.lastCall < moment().add(-observe.timeout,"ms")) {
				observe.callback();
				observe.lastCall = moment();
				this.ObservableMap[key] = observe;
			}
		}
	}
	
	public ControllerPress(press:any) {
		var buttonName = press.detail.buttonName;
		var isPressed = press.detail.button.pressed;
		var key = (this.mapping as any)[buttonName];
		this.KeyMap[key] = isPressed;
		
		this.TriggerObservable(key, isPressed);
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
		
		this.TriggerObservable(key, isPressed);
	}
	
	public WaitFor(key:string, callback:() => void, debounce:number=0) {
		var model = new CallbackModel();
		model.callback = callback;
		model.timeout = debounce;
		model.lastCall = moment().add(-1,"d");
		this.ObservableMap[key.toLowerCase()] = model;
	}
	
	private getDir(x:number, y:number) {
		var absX = Math.abs(x)
		var absY = Math.abs(y)
		
		if (absY < 0.1 || absX < 0.1)
			return "none";
		
		if(absX > absY) {
			//X is bigger
			if(x > 0)
				return "right"
			else
				return "left"
		}
		else {
			//Y is bigger
			if(y > 0)
				return "bottom"
			else
				return "top"
		}
	}
	
	public HandleController(e:any) {
		var axes = e.detail.gamepad.axes;
		var dir = this.getDir(axes[0], axes[1]);
		
		var stickMapping:any = {
			"top":"w",
			"bottom":"s",
			"left":"a",
			"right":"d"
		}
		
		var key = stickMapping[dir];
		
		this.KeyMap[key] = true;
		this.TriggerObservable(key, true);
		
		var debounce = () => {
			var pad = navigator.getGamepads()[e.detail.gamepad.index]
			var newDir = this.getDir(pad.axes[0], pad.axes[1]);
			var newKey = stickMapping[newDir]
			
			if (newKey != key) {
				this.KeyMap[key] = false;
				this.TriggerObservable(key, false);
			}
		}
		setTimeout(debounce,100);
	}
}

export class CallbackModel {
	callback:()=>void;
	timeout:number;
	lastCall:moment.Moment;
}
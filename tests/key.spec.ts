import { KeyController } from "../src/Services/KeyController";


describe("keyController",() => {
	test("doublebinding space resets", () => {
		var key = new KeyController();
		var ran = ""
		key.WaitFor(" ",() => {ran = "original"},0);
		key.WaitFor(" ",() => {ran = "replacement"},0);
		
		var trigger  = {
			key: " ",
			shiftKey:false,
			ctrlKey:false,
			altKey:false
		};
		
		key.KeyPress(trigger,true)
		
		expect(ran).toBe("replacement")
	})
})
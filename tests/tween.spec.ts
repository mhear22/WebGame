import { Tween, TweenMethod } from "../src/Services/TweenService"
import * as three from "three";
import * as moment from 'moment';
import { exec } from "child_process";

describe("TweenService", () => {
	test("Correctly ends", () => {
		var now = moment();
		var complete = now.add(2, 's');

		var tween = new Tween(
			new three.Vector3(0, 0, 0),
			new three.Vector3(1, 1, 1),
			TweenMethod.Linear,
			1
		)

		var val = tween.value.clone();

		tween.currentTime = complete;

		var end = tween.value.clone();

		expect(end).not.toBe(val);
	});
	
	test("Correctly tweens", () => {
		var now = moment();
		var complete = now.add(500, 'ms');

		var tween = new Tween(
			new three.Vector3(0, 0, 0),
			new three.Vector3(1, 1, 1),
			TweenMethod.Linear,
			1
		)

		var val = tween.value.clone();

		tween.currentTime = complete;

		var end = tween.value.clone();

		expect(end).not.toBe(val);
		expect(end.x).toBeGreaterThan(0.4);
		expect(end.y).toBeGreaterThan(0.4);
		expect(end.z).toBeGreaterThan(0.4);
	});
	
	test("Correctly avoids looping", () => {
		var now = moment();
		var complete = now.add(10, 's');

		var tween = new Tween(
			new three.Vector3(0, 0, 0),
			new three.Vector3(1, 1, 1),
			TweenMethod.Linear,
			1,
			false
		)

		var val = tween.value.clone();

		tween.currentTime = complete;

		var end = tween.value.clone();

		expect(end).not.toBe(val);
		expect(end.x).toBe(1);
		expect(end.y).toBe(1);
		expect(end.z).toBe(1);
	});
	
	test("Correctly tweens", () => {
		var now = moment();
		var complete = now.add(17, 'ms');

		var tween = new Tween(
			new three.Vector3(0, 0, 0),
			new three.Vector3(1, 1, 1),
			TweenMethod.Linear,
			1
		)

		var val = tween.value.clone();

		tween.currentTime = complete;

		var end = tween.value.clone();

		expect(end).not.toBe(val);
	});
	
	test("Correctly tweens linearly", () => {
		var now = moment();
		var tween = new Tween(
			new three.Vector3(0, 0, 0),
			new three.Vector3(1, 1, 1),
			TweenMethod.Linear,
			1,
			false
		)
		
		
		var times = [1,2,3,4,5,6,7,8,9, 10].map(x=> {
			return {
				offset: x,
				time: now.clone().add(x * 100, 'ms')
			}
		}).map(x=> {
			tween.currentTime = x.time;
			return {
				offset: x.offset,
				time: x.time.milliseconds(),
				value: tween.value.clone()
			};
		});
		
		times.forEach(element => {
			expect(element.value.x).toBeGreaterThan(element.offset * 0.09);
		});
		
	});
});
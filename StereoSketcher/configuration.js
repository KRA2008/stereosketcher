'use strict';

var frames = 120
var frameTime = 0.04;
var shiftSpeed = 0.5;
var axisVisible = false;
var framesInput, frameTimeInput, shiftSpeedInput, axisVisibleInput;

function openConfiguration() {
	showLoading(true);
	framesInput.value = frames;
	frameTimeInput.value = frameTime;
	shiftSpeedInput.value = shiftSpeed;
	axisVisibleInput.checked = axisVisible;
	configurationPopup.style.display = "";
}

function closeConfiguration() {
	hideLoading(true);
	configurationPopup.style.display = "none";
	frames = framesInput.value;
	frameTime = frameTimeInput.value;
	shiftSpeed = shiftSpeedInput.value;
	axisVisible = axisVisibleInput.checked;
	snapDots(getDots(),true);
}
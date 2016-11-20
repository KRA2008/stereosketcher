'use strict';

var frames = 120
var frameTime = 0.04;
var shiftSpeed = 0.5;
var axisVisible = false;
var numberOfPreviewLoops = 1;
var framesInput, frameTimeInput, shiftSpeedInput, axisVisibleInput, numberOfPreviewLoops;

function openConfiguration() {
	showLoading(true);
	framesInput.value = frames;
	frameTimeInput.value = frameTime;
	shiftSpeedInput.value = shiftSpeed;
	axisVisibleInput.checked = axisVisible;
	numberOfPreviewLoopsInput.value = numberOfPreviewLoops;
	configurationPopup.style.display = "";
}

function closeConfiguration() {
	hideLoading();
	configurationPopup.style.display = "none";
	frames = framesInput.value;
	frameTime = frameTimeInput.value;
	shiftSpeed = shiftSpeedInput.value;
	axisVisible = axisVisibleInput.checked;
	numberOfPreviewLoops = numberOfPreviewLoopsInput.value;
	snapDots(getDots(),true);
}
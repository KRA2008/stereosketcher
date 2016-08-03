'use strict';

var frames = 60;
var equivalence = 4;
var frameTime = 0.07
var loopFrames;

function uploadGif() {
	var axisDot = findAxisDot();
	if(axisDot == null) {
		alert("Please create/select one dot to indicate the position of the axis of rotation.");
		return;
	}
	setDisplay("Gathering frames...");
	hideToolbar();
	showLoading();
	addWatermark();
	assignDistances(axisDot);
	viewMode();
	loopFrames = 0;
	while (gifFrames.firstChild) {
	    gifFrames.removeChild(gifFrames.firstChild);
	}
	loopFrameSave(axisDot);
}

function loopFrameSave(axisDot) {
	if(loopFrames >= frames) {
		setTimeout(function() {
			showToolbar();
			hideLoading();
			hideWatermark();
			rotate3d(axisDot,0);
			fixPrecisionErrors();
			makeGif();
		},500);
		return;
	}
	rotate3d(axisDot,loopFrames);
	setTimeout(function() {
		var innerLoop = loopFrames;
		saveSvgAsPng(document.getElementById("svg"), 1,gifFrameSaveCallback,innerLoop);
		loopFrames++;
		loopFrameSave(axisDot);
	},500);
}

function fixPrecisionErrors() {
	var dots = getDots();
	var dot;
	for (var ii=0;ii<dots.length;ii++) {
		dot = dots[ii];
		if(dot.getShift() >= 0) {
			dot.setShift(Math.trunc(dot.getShift()+0.5));
		} else {
			dot.setShift(Math.trunc(dot.getShift()-0.5));
		}
	}
}

function gifFrameSaveCallback(imageToSend,counter) {
	var image = document.createElement('img');
	image.src = imageToSend;
	gifFrames.appendChild(image);
}

function makeGif() {
	setDisplay("Stitching frames...(can take a minute)");
	var children = Array.prototype.slice.call(gifFrames.childNodes);
	gifshot.createGIF({
		gifWidth: window.innerWidth,
		gifHeight: window.innerHeight,
		images: children,
		interval: frameTime,
		numFrames: frames
	}, function (obj) {
		if (!obj.error) {
			setDisplay("Uploading gif...");
			uploadToImgur(obj.image,setSuccessDisplay,setSuccessDisplay,"MciDbSPWF44zMaA");
		} else {
			setDisplay(obj.error);
		}
	});
}

function findAxisDot() {
	var dots = getDots();
	var axisDot;
	var selectedDots = [];
	for(var ii=0;ii<dots.length;ii++) {
		if(dots[ii].isSelected()) {
			selectedDots.push(dots[ii]);
		}
	}
	if(selectedDots.length != 1) {
		return null;
	}
	return selectedDots[0];
}

function assignDistances(axis) {
	var dots = getDots();
	var dot;
	var axisX = parseFloat(axis.getAttribute("cx"));
	var axisZ = parseFloat(axis.getShift()*equivalence);
	var a;
	var b;
	for(var ii=0;ii<dots.length;ii++) {
		dot = dots[ii];
		if(dot != axis) {
			a = axisX-parseFloat(dot.getAttribute("cx"));
			b = parseFloat(dot.getShift()*equivalence)-axisZ;
			dot.seedDistance = magnitude(a,b);
			var tempAngle = Math.acos(a/dot.seedDistance);
			dot.seedAngle = b >= 0 ? tempAngle : 2*Math.PI-tempAngle;
		}
	}
}

function rotate3d(axisDot,frame) {
	var rotInc = 2*Math.PI*frame/(frames+1);
	var dots = getDots();
	var dot;
	var cx = parseFloat(axisDot.getAttribute("cx"));
	var cz = axisDot.getShift()*equivalence;
	for(var ii=0;ii<dots.length;ii++) {
		dot = dots[ii];
		if(dot != axisDot) {
			dot.setAttribute("cx",cx-dot.seedDistance*Math.cos(rotInc+dot.seedAngle));
			dot.setShift((cz+dot.seedDistance*Math.sin(rotInc+dot.seedAngle))/equivalence);
		}
	}
	snapDots(dots,false);
}

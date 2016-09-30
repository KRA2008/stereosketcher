'use strict';

var frames = 60
var equivalence = 4;
var frameTime = 0.08
var loopFrames;
var axis;

function uploadGif() {
	axis = findAxis();
	if(axis == null) {
		alert("Please create/select two dots to indicate the axis of rotation.");
		return;
	}
	setDisplay("Doing some math...");
	hideToolbar();
	showLoading();
	addWatermark();
	assignDistances();
	setDisplay("Gathering frames...");
	viewMode();
	loopFrames = 0;
	while (gifFrames.firstChild) {
	    gifFrames.removeChild(gifFrames.firstChild);
	}
	loopFrameSave();
}

function loopFrameSave() {
	if(loopFrames >= frames) {
		showToolbar();
		hideLoading();
		hideWatermark();
		rotate3d(loopFrames);
		fixPrecisionErrors();
		makeGif();
		return;
	}
	rotate3d(loopFrames);
	saveSvgAsPng(document.getElementById("svg"), 1,gifFrameSaveCallback);
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

function gifFrameSaveCallback(imageToSend) {
	var image = document.createElement('img');
	image.src = imageToSend;
	gifFrames.appendChild(image);
	loopFrames++;
	loopFrameSave();
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

function findAxis() {
	var dots = getDots();
	var selectedDots = [];
	for(var ii=0;ii<dots.length;ii++) {
		if(dots[ii].isSelected()) {
			selectedDots.push(dots[ii]);
		}
	}
	if(selectedDots.length != 2) {
		return null;
	}
	return selectedDots;
}

function assignDistances() {
	var dot1 = axis[0];
	var dot2 = axis[1];
	var x1 = dot1.getX();
	var y1 = dot1.getY();
	var z1 = dot1.getZ();
	var x2 = dot2.getX();
	var y2 = dot2.getY();
	var z2 = dot2.getZ();
	
	var spanX = x2-x1;
	var spanY = y2-y1;
	var spanZ = z2-z1;
	var spanMagnitude = magnitude([spanX,spanY,spanZ]);
	
	var dirX = spanX/spanMagnitude;
	var dirY = spanY/spanMagnitude;
	var dirZ = spanZ/spanMagnitude;
	
	var a = x1;
	var b = y1;
	var c = z1;
	
	var u = dirX;
	var v = dirY;
	var w = dirZ;
	
	var v2 = square(v);
	var u2 = square(u);
	var w2 = square(w);
	
	var avwSq = a*(v2+w2);
	var buwSq = b*(u2+w2);
	var cuvSq = c*(u2+v2);
	
	var bv = b*v;
	var cw = c*w;
	var au = a*u;
	
	var cv = c*v;
	var bw = b*w;
	var cu = c*u;
	var aw = a*w;
	var bu = b*u;
	var av = a*v;
	
	var uStuff;
	var vStuff;
	var wStuff;
	
	var x;
	var y;
	var z;
	
	var uxvywz;

	var dots = getDots();
	var dot;
	for(var ii=0;ii<dots.length;ii++) {
		dot = dots[ii];
		if(dot != axis[0] && dot != axis[1]) {
			x = dot.getX();
			y = dot.getY();
			z = dot.getZ();
			
			uxvywz = -1*u*x-v*y-w*z;
			
			uStuff = u*(bv+cw+uxvywz);
			vStuff = v*(au+cw+uxvywz);
			wStuff = w*(au+bv+uxvywz);
			
			dot.originalX = x;
			dot.originalY = y;
			dot.originalZ = z;
			
			dot.xMult1 = avwSq - uStuff;
			dot.yMult1 = buwSq - vStuff;
			dot.zMult1 = cuvSq - wStuff;
			
			dot.xMult2 = -1*cv+bw-w*y+v*z;
			dot.yMult2 = cu-aw+w*x-u*z;
			dot.zMult2 = -1*bu+av-v*x+u*y;
		}
	}
}

function rotate3d(frame) {
	var rotInc = 2*Math.PI*frame/frames;
	var dots = getDots();
	var dot;
	var cosTheta = Math.cos(rotInc);
	var sinTheta = Math.sin(rotInc);
	var minusCosTheta = 1-cosTheta;
	for(var ii=0;ii<dots.length;ii++) {
		dot = dots[ii];
		if(dot != axis[0] && dot != axis[1]) {
			dot.setAttribute("cx", dot.xMult1 * minusCosTheta + dot.originalX * cosTheta + dot.xMult2 * sinTheta);
			dot.setAttribute("cy", dot.yMult1 * minusCosTheta + dot.originalY * cosTheta + dot.yMult2 * sinTheta);
			dot.setShift((dot.zMult1 * minusCosTheta + dot.originalZ * cosTheta + dot.zMult2 * sinTheta)/equivalence);
		}
	}
	snapDots(dots,false);
}
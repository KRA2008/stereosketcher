'use strict';

var loopFrames;
var axis;
var stitchingMessage = "Stitching frames...";
var stitched = 0;
var equivalence = 8;

function uploadGif(onlyPreview) {
	axis = findAxis();
	if(axis == null) {
		alert("Please create/select one line to indicate the axis of rotation. The axis will "+ (axisVisible ? "" : "NOT ") + "be visible in the image. This can be changed in the configuration options.");
		return;
	}
	if(!validateLinesAndFacesOnly()) {
		alert("Only lines and faces are currently supported by rotation because the layering is merely an illusion. Please remove the other stuff.")
		return;
	}
	if(!validateColors()) {
		alert("Please only use one color for all the lines and faces in your drawing because the layering is merely an illusion.")
		return;
	}
	if(!onlyPreview) setDisplay("Doing some math...");
	if(!axisVisible) {
		hideAxis();
	}
	axis.deselect();
	hideToolbar();
	showLoading(onlyPreview);
	addWatermark();
	assignDistances();
	if(!onlyPreview) setDisplay("Gathering frames...");
	viewMode(true);
	loopFrames = 0;
	stitched = 0;
	cleanUpFrames();
	loopFrameSave(onlyPreview);
}

function incrementPercentDone() {
	stitched++;
	setDisplay(stitchingMessage+" "+Math.trunc((stitched/frames)*100)+"%");
}

function validateLinesAndFacesOnly() {
	var images = getImages();
	if(images.length > 0) {
		return false;
	}
	var bases = getBases();
	if(bases.length > 0) {
		return false;
	}
	return true;
}

function validateColors() {
	var faces = getFaces();
	var faceColor;
	if(faces.length>0) {
		faceColor = faces[0].color;
		for(var ii=1;ii<faces.length;ii++) {
			if(faces[ii].color != faceColor) {
				return false;
			}
		}
	}
	var lines = getLines();
	var lineColor;
	if(lines.length>0) {
		lineColor = lines[0].color;
		for(var ii=1;ii<lines.length;ii++) {
			if(lines[ii].color != lineColor) {
				return false;
			}
		}
	}
	if(lineColor && faceColor) {
		return lineColor === faceColor;
	}
	return true;
}

function loopFrameSave(onlyPreview) {
	if((!onlyPreview && loopFrames >= frames) || (onlyPreview && loopFrames>=frames*numberOfPreviewLoops)) {
		showToolbar();
		hideLoading();
		hideWatermark();
		rotate3d(loopFrames);
		if(!axisVisible) {
			showAxis();
		}
		axis.select();
		fixPrecisionErrors();
		if(!onlyPreview) {
			makeGif();
		}
		return;
	}
	rotate3d(loopFrames);
	
	if(!onlyPreview) {
		saveSvgAsPng(document.getElementById("svg"), 1,gifFrameSaveCallback);
	} else {
		setTimeout(function() {
			loopFrames++;
			loopFrameSave(onlyPreview);
		},frameTime*1000);
	}
}

function hideAxis() {
	addClassToElement(axis,"hidden");
	addClassToElement(axis.clone,"hidden");
}

function showAxis() {
	removeClassFromElement(axis,"hidden");
	removeClassFromElement(axis.clone,"hidden");
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
	setDisplay(stitchingMessage);
	setTimeout(function() {
		var children = Array.prototype.slice.call(gifFrames.childNodes);
		cleanUpFrames();
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
	},1000);
}

function cleanUpFrames() {
	while (gifFrames.firstChild) {
	    gifFrames.removeChild(gifFrames.firstChild);
	}
}

function findAxis() {
	var lines = getLines();
	var selectedLines = [];
	var line;
	for(var ii=0;ii<lines.length;ii++) {
		line = lines[ii];
		if(line.isSelected()) {
			selectedLines.push(line);
		}
	}
	if(selectedLines.length != 1) {
		return null;
	}
	return selectedLines[0];
}

function assignDistances() {
	var dot1 = axis.dot1;
	var dot2 = axis.dot2;
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
		if(dot != axis.dot1 && dot != axis.dot2) {
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
	if(mode == 3) {
		removeOverlapsNoLoading();
	}
	var rotInc = 2*Math.PI*frame/frames;
	var dots = getDots();
	var dot;
	var cosTheta = Math.cos(rotInc);
	var sinTheta = Math.sin(rotInc);
	var minusCosTheta = 1-cosTheta;
	for(var ii=0;ii<dots.length;ii++) {
		dot = dots[ii];
		if(dot != axis.dot1 && dot != axis.dot2) {
			dot.setAttribute("cx", dot.xMult1 * minusCosTheta + dot.originalX * cosTheta + dot.xMult2 * sinTheta);
			dot.setAttribute("cy", dot.yMult1 * minusCosTheta + dot.originalY * cosTheta + dot.yMult2 * sinTheta);
			dot.setShift((dot.zMult1 * minusCosTheta + dot.originalZ * cosTheta + dot.zMult2 * sinTheta)/(equivalence*shiftSpeed));
		}
	}
	snapDots(dots,false);
	if(mode == 3) {
		addOverlapsNoLoading();
	}
}
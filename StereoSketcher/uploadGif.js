'use strict';

var frames = 60;
var equivalence = 4;
var frameTime = 0.07
var gifFrames;
var deletes;
var loopFrames;
var uploadedFramesCount;

function uploadGif() {
	var axisDot = findAxisDot();
	if(axisDot == null) {
		alert("Please create/select one dot to indicate the position of the axis of rotation.");
		return;
	}
	setDisplay("Gathering and uploading frames...");
	hideToolbar();
	showLoading();
	addWatermark(true);
	assignDistances(axisDot);
	viewMode();
	gifFrames = [];
	deletes = [];
	uploadedFramesCount = 0;
	loopFrames = 0;
	loopFrameUpload(axisDot);
}

function loopFrameUpload(axisDot) {
	if(loopFrames >= frames) {
		rotate3d(axisDot,0);
		return;
	}
	rotate3d(axisDot,loopFrames);
	setTimeout(function() {
		var innerLoop = loopFrames;
		saveSvgAsPng(document.getElementById("svg"), 1,gifFrameUploadCallback,innerLoop);
		loopFrames++;
		loopFrameUpload(axisDot);
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

function gifFrameUploadCallback(imageToSend,counter) {
	uploadToImgur(imageToSend,gifFrameSuccess,gifFrameSuccess,null,counter);
}

function gifFrameSuccess(id,counter,deleteHash) {
	gifFrames[counter]='http://i.imgur.com/'+id+'.png';
	deletes[counter]=deleteHash;
	uploadedFramesCount++;
	if(uploadedFramesCount >= frames) {
		showToolbar();
		hideLoading();
		hideWatermark();
		fixPrecisionErrors();
		makeGif();
	}
}

function makeGif() {
	setDisplay("Stitching frames...");
	gifshot.createGIF({
		gifWidth: window.innerWidth,
		gifHeight: window.innerHeight,
		images: gifFrames,
		interval: frameTime,
		numFrames: frames
	}, function (obj) {
		if (!obj.error) {
			setDisplay("Uploading gif...");
			uploadToImgur(obj.image,setSuccessDisplay,setSuccessDisplay,"MciDbSPWF44zMaA");
			for(var ii=0;ii<deletes.length;ii++) {
				deleteImage(deletes[ii]);
			}
		}
	});
}

function deleteImage(deleteHash) {
	var ajax = new XMLHttpRequest();
	ajax.open("DELETE","https://api.imgur.com/3/image/"+deleteHash,true);
	ajax.setRequestHeader("Authorization", "Client-ID aa408da70b6d569");
	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	ajax.send();
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

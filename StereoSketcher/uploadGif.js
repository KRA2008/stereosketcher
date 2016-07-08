'use strict';

var frames = 40;
var equivalence = 4;
var gifFrames = [];
var imagesToSend = [];
var loopFrames;
var uploadedFrames;

function uploadGif() {
	var axisDot = findAxisDot();
	if(axisDot == null) {
		alert("Please create/select one dot to indicate the position of the axis of rotation.");
		return;
	}
	assignDistances(axisDot);
	viewMode();
	uploadedFrames = 0;
	loopFrames = 0;
	loopFrameUpload(axisDot);
}

function loopFrameUpload(axisDot) {
	if(loopFrames >= frames) {
		fixPrecisionErrors();
		uploadFrames();
		return;
	}
	rotate(axisDot,loopFrames);
	setTimeout(function() {
		var innerLoop = loopFrames;
		saveSvgAsPng(document.getElementById("svg"), 1,gifFrameUploadCallback,innerLoop);
		loopFrames++;
		loopFrameUpload(axisDot);
	},200);
}

function fixPrecisionErrors() {
	var dots = getDots();
	var dot;
	for (var ii=0;ii<dots.length;ii++) {
		dot = dots[ii];
		dot.setShift(Math.trunc(dot.getShift()+0.5));
	}
}

function gifFrameUploadCallback(imageToSend,counter) {
	imagesToSend[counter]=imageToSend;
}

function uploadFrames() {
	for(var ii=0;ii<imagesToSend.length;ii++) {
		uploadToImgur(imagesToSend[ii],gifFrameSuccess,gifFrameFailure,null,ii);
	}
}

function gifFrameSuccess(id,counter) {
	gifFrames[counter]='http://i.imgur.com/'+id;
	uploadedFrames++;
	if(uploadedFrames >= frames) {
		makeGif();
	}
}

function makeGif() {
	gifshot.createGIF({
	    gifWidth: window.innerWidth,
	    gifHeight: window.innerHeight,
	    images: gifFrames,
	    interval: 0.025,
	    numFrames: frames
	}, function (obj) {
	    if (!obj.error) {
	        uploadToImgur(obj.image,setSuccessDisplay,setSuccessDisplay,"MciDbSPWF44zMaA");
	    }
	});
}

function gifFrameFailure() {
	alert('poo.');
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

function rotate(axisDot,frame) {
	var rotInc = (2*Math.PI*frame+1)/frames;
	var dots = getDots();
	var dot;
	var cx;
	var cz;
	for(var ii=0;ii<dots.length;ii++) {
		dot = dots[ii];
		if(dot != axisDot) {
			cx = parseFloat(axisDot.getAttribute("cx"));
			cz = axisDot.getShift()*equivalence;
			dot.setAttribute("cx",cx-dot.seedDistance*Math.cos(rotInc+dot.seedAngle));
			dot.setShift((cz+dot.seedDistance*Math.sin(rotInc+dot.seedAngle))/equivalence);
		}
	}
	snapDots(dots,false);
}

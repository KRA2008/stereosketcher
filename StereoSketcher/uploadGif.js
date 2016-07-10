'use strict';

var frames = 30;
var equivalence = 4;
var frameTime = 0.2
var gifFrames;
var loopFrames;
var uploadedFramesCount;

//TODO: apply circular correction

function uploadGif() {
	var axisDot = findAxisDot();
	if(axisDot == null) {
		alert("Please create/select one dot to indicate the position of the axis of rotation.");
		return;
	}
	setDisplay("Gathering and uploading frames...");
	hideToolbar();
	assignDistances(axisDot);
	viewMode();
	gifFrames = [];
	uploadedFramesCount = 0;
	loopFrames = 0;
	loopFrameUpload(axisDot);
}

function loopFrameUpload(axisDot) {
	if(loopFrames >= frames) {
		return;
	}
	rotate(axisDot,loopFrames);
	setTimeout(function() {
		var innerLoop = loopFrames;
		saveSvgAsPng(document.getElementById("svg"), 1,gifFrameUploadCallback,innerLoop);
		loopFrames++;
		loopFrameUpload(axisDot);
	},1000);
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
	uploadToImgur(imageToSend,gifFrameSuccess,gifFrameFailure,null,counter);
}

function gifFrameSuccess(id,counter) {
	gifFrames[counter]='http://i.imgur.com/'+id+'.png';
	uploadedFramesCount++;
	if(uploadedFramesCount >= frames) {
		showToolbar();
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
		}
	});
}

function postToiBacor() {

    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "http://ibacor.com/bcr_panels/gif/maker.php");

	var bacor = {
		
	};
    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
         }
    }

    document.body.appendChild(form);
    form.submit();
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
	var rotInc = 2*Math.PI*frame/frames;
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

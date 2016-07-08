'use strict';
var imageToSend;

function upload() {
	showLoading();
	setTimeout(function() {
		deselectAll();
		lowlightAll();
		setSuccessDisplay("Converting SVG to PNG...");
		hideToolbar();
		if(isEditMode) {
			viewMode();
		}
		setTimeout(function() {
			addWatermark();
			saveSvgAsPng(document.getElementById("svg"), 1,standaloneUploadCallback);
			setSuccessDisplay("Uploading image...");
		},200);
	},200);
}

function standaloneUploadCallback(imageToSend) {
	hideWatermark();
	showToolbar();
	uploadToImgur(imageToSend,setSuccessDisplay,setSuccessDisplay,"MciDbSPWF44zMaA");
}

function uploadToImgur(imageToSend,success,failure,album,counter) {
	var params="image="+encodeURIComponent(imageToSend);
	if(album) {
		params+="&album="+album;
	}
	var ajax = new XMLHttpRequest();
	ajax.open("POST","https://api.imgur.com/3/image",true);
	ajax.setRequestHeader("Authorization", "Client-ID aa408da70b6d569");
	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	ajax.onload = function(e) {
		if(ajax.readyState === 4) {
			if(ajax.status === 200) {
				var response = JSON.parse(ajax.responseText);
				success(response.data.id,counter)
			} else {
				failure();
			}
		}
	}
	ajax.onerror = function (e) {
		failure();
	}
	ajax.send(params);
}

function setSuccessDisplay(id) {
	var resultDisplay = document.getElementById("uploadResult");
	if(id) {
		resultDisplay.innerHTML = "<a target='none' href='http://imgur.com/"+id+"'>Success!</a>"
		hideLoading();
	} else {
		resultDisplay.innerHTML = "Upload failed.";
	}
}

function addWatermark() {
	var watermarkContent = "Sketch free @ StereoSketcher.com"
	var size = 15
	var height = 10;
	var width = 220;
	var rightest = findRightMostPosition();
	var back = findBackMostShift();
	var watermark = document.createElementNS("http://www.w3.org/2000/svg", "text");
	watermark.setAttribute("id", "waterMark");
	watermark.setAttribute("y", window.innerHeight-height);
	watermark.setAttribute("x", rightest-width);
	watermark.setAttribute("font-size",size);
	watermark.setAttribute("font-family","Arial");
	var watermarkClone = document.createElementNS("http://www.w3.org/2000/svg", "text");
	watermarkClone.setAttribute("id", "waterMarkClone");
	watermarkClone.setAttribute("y", window.innerHeight-height);
	watermarkClone.setAttribute("x", rightest+back*shiftSpeed+IPD-width);
	watermarkClone.setAttribute("font-size",size);
	watermarkClone.setAttribute("font-family","Arial");
	var backgroundColor = parseInt("0x"+getBackgroundColor().substr(1,6));
	var chunk1 = backgroundColor&0xff;
	var chunk2 = (backgroundColor&0xff00)>>8;
	var chunk3 = (backgroundColor&0xff0000)>>16;
	var backgroundSum = chunk1+chunk2+chunk3;
	if(backgroundSum>382) {
		watermark.setAttribute("fill", "black");
		watermarkClone.setAttribute("fill", "black");
	} else {
		watermark.setAttribute("fill", "white");
		watermarkClone.setAttribute("fill", "white");
	}
	watermark.textContent=watermarkContent;
	watermarkClone.textContent=watermarkContent;
	svg.appendChild(watermark);
	if(mode==1) {
		svg.appendChild(watermarkClone);
	}
}

function findBackMostShift() {
	var dots = getDots();
	var targetDot = dots[0];
	for(var ii=1;ii<dots.length;ii++) {
		if(dots[ii].getShift()<targetDot.getShift()) {
			targetDot = dots[ii];
		}
	}
	return targetDot.getShift();
}

function findRightMostPosition() {
	var dots = getDots();
	var targetDot = dots[0];
	for(var jj=1;jj<dots.length;jj++) {
		if(parseFloat(dots[jj].getAttribute("cx"))>parseFloat(targetDot.getAttribute("cx"))) {
			targetDot = dots[jj];
		}
	}
	return parseFloat(targetDot.getAttribute("cx"));
}

function hideWatermark() {
	var watermark = document.getElementById("waterMark");
	svg.removeChild(watermark);	
	if(mode==1) {
		var watermarkClone = document.getElementById("waterMarkClone");
		svg.removeChild(watermarkClone);
	}
}
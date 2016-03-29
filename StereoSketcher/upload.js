'use strict';
var imageToSend;

function upload() {
	showLoading();
	setTimeout(function() {
		setSuccessDisplay("Converting SVG to PNG...");
		hideToolbar();
		if(isEditMode) {
			viewMode();
		}
		setTimeout(function() {
			addWatermark();
			saveSvgAsPng(document.getElementById("svg"), 1);
			setSuccessDisplay("Uploading image...");
		},200);
	},200);
}

function sendToImgur() {
	hideWatermark();
	showToolbar();
	var params="image="+encodeURIComponent(imageToSend)+"&album=MciDbSPWF44zMaA";
	
	var ajax = new XMLHttpRequest();
	ajax.open("POST","https://api.imgur.com/3/image",true);
	ajax.setRequestHeader("Authorization", "Client-ID aa408da70b6d569");
	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	ajax.onload = function(e) {
		if(ajax.readyState === 4) {
			if(ajax.status === 200) {
				var response = JSON.parse(ajax.responseText);
				setSuccessDisplay("Success!",response.data.id);
			} else {
				setSuccessDisplay("Upload failed.");
			}
		}
	}
	ajax.onerror = function (e) {
		setSuccessDisplay("Upload failed.");
	}
	ajax.send(params);
}

function setSuccessDisplay(text,id) {
	var resultDisplay = document.getElementById("uploadResult");
	if(id) {
		resultDisplay.innerHTML = "<a target='none' href='http://imgur.com/"+id+"'>"+text+"</a>"
		hideLoading();
	} else {
		resultDisplay.innerHTML = text;
	}
}

function addWatermark() {
	var size = 15
	var height = 10;
	var width = 145;
	var destinationDot = calculateWatermarkDot();
	var watermark = document.createElementNS("http://www.w3.org/2000/svg", "text");
	watermark.setAttribute("id", "waterMark");
	watermark.setAttribute("y", window.innerHeight-height);
	watermark.setAttribute("x", destinationDot.getAttribute("cx")-width);
	watermark.setAttribute("font-size",size);
	watermark.setAttribute("font-family","Arial");
	var watermarkClone = document.createElementNS("http://www.w3.org/2000/svg", "text");
	watermarkClone.setAttribute("id", "waterMarkClone");
	watermarkClone.setAttribute("y", window.innerHeight-height);
	watermarkClone.setAttribute("x", parseFloat(destinationDot.getAttribute("cx"))+destinationDot.getShift()*shiftSpeed+IPD-width);
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
	watermark.textContent="StereoSketcher.com";
	watermarkClone.textContent="StereoSketcher.com";
	svg.appendChild(watermark);
	svg.appendChild(watermarkClone);
}

function calculateWatermarkDot() {
	var dots = getDots();
	var targetDot = dots[0];
	for(var ii=1;ii<dots.length;ii++) {
		if(dots[ii].getShift()<targetDot.getShift()) {
			targetDot = dots[ii];
		}
	}
	for(var jj=0;jj<dots.length;jj++) {
		if(dots[jj].getShift() == targetDot.getShift() && dots[jj].getAttribute("cx")>targetDot.getAttribute("cx")) {
			targetDot = dots[jj];
		}
	}
	return targetDot;
}

function hideWatermark() {
	var watermark = document.getElementById("waterMark");
	svg.removeChild(watermark);
	var watermarkClone = document.getElementById("waterMarkClone");
	svg.removeChild(watermarkClone);
}
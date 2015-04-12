'use strict';
var imageToSend;

function upload() {
	setSuccessDisplay("Uploading image...");
	hideToolbar();
	if(isEditMode) {
		viewMode();
	}
	setTimeout(function() {
		addWatermark();
		saveSvgAsPng(document.getElementById("svg"), 1);
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
	} else {
		resultDisplay.innerHTML = text;
	}
}

function addWatermark() {
	var size = 15
	var height = 10;
	var width = 145;
	var watermark = document.createElementNS("http://www.w3.org/2000/svg", "text");
	watermark.setAttribute("id", "waterMark");
	watermark.setAttribute("y", window.innerHeight-height);
	watermark.setAttribute("x", window.innerWidth-width);
	watermark.setAttribute("font-size",size);
	watermark.setAttribute("font-family","Arial");
	watermark.setAttribute("fill", "black");
	watermark.textContent="StereoSketcher.com";
	svg.appendChild(watermark);
}

function hideWatermark() {
	var watermark = document.getElementById("waterMark");
	svg.removeChild(watermark);
}
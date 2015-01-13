'use strict';
var imageToSend;

function upload() {
	viewMode();
	setTimeout(function() { 
		addWatermark();
		saveSvgAsPng(document.getElementById("svg"), 1);
		hideWatermark();
	},0);
}

function sendToImgur() {
	setSuccessDisplay("Uploading image...");
	var params="image="+encodeURIComponent(imageToSend)+"&album=HTD2v8UUS3zApIz";
	
	var ajax = new XMLHttpRequest();
	ajax.open("POST","https://api.imgur.com/3/image",true);
	ajax.setRequestHeader("Authorization", "Client-ID 1070461d2c44f9f");
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
	var watermark = document.createElementNS("http://www.w3.org/2000/svg", "text");
	watermark.setAttribute("id", "waterMark");
	watermark.setAttribute("y", window.innerHeight-10);
	watermark.setAttribute("fill", "black");
	watermark.textContent="StereoSketcher.com";
	switch(mode) {
		case 1:
			watermark.textContent+=" X";
			watermark.setAttribute("x", window.innerWidth-155);
			break;
		case 2:
			watermark.textContent+=" ||";
			watermark.setAttribute("x", window.innerWidth-155);
			break;
		default:
			watermark.setAttribute("x", window.innerWidth-140);
			break;
	}
	svg.appendChild(watermark);
}

function hideWatermark() {
	var watermark = document.getElementById("waterMark");
	svg.removeChild(watermark);
}
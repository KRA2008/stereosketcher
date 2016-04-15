'use strict';

var zoomLevel = 0.0;
var zoomSpeed = 1.25;
var zoomLimit = 15.0;

function zoom(event) {
	editMode();
	var roll = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
	if(roll<0) {
		if(zoomLevel<=-1*zoomLimit) {
			return;
		}
		zoomOut(event.clientX,event.clientY);
	} else {
		if(zoomLevel>=zoomLimit) {
			return;
		}
		zoomIn(event.clientX,event.clientY);
	}
}

function setZoomLevel(newZoomLevel) {
	if(newZoomLevel > 0) {
		for(var ii = newZoomLevel;ii>0;ii--) {
			zoomIn(window.innerWidth/2,window.innerHeight/2);
		}
	} else {
		for(var ii = newZoomLevel;ii<0;ii++) {
			zoomOut(window.innerWidth/2,window.innerHeight/2);
		}
	}
}

function zoomIn(centerX,centerY) {
	zoomLevel++;
	applyZoom(zoomSpeed,centerX,centerY);
}

function zoomOut(centerX,centerY) {
	zoomLevel--;
	applyZoom(1-((zoomSpeed-1)/zoomSpeed),centerX,centerY);
}

function applyZoom(zoom,centerX,centerY) {
	var dot;
	var dots = getDots();
	var diffX, diffY;
	var shiftX, shiftY;
	var oldX, oldY;
	IPD*=zoom;
	buffer*=zoom;
	shiftSpeed*=zoom;
	defaultLineThickness*=zoom;
	thickenRate*=zoom;
	for(var ii=0;ii<dots.length;ii++) {
		dot = dots[ii];
		oldX = parseFloat(dot.getAttribute("cx"));
		oldY = parseFloat(dot.getAttribute("cy"));
		diffX = centerX-oldX;
		diffY = centerY-oldY;
		shiftX = diffX-zoom*diffX;
		shiftY = diffY-zoom*diffY;
		moveDot(dot,shiftX,shiftY);
	}
	var line;
	var lines = getLines();
	for (var ii=0;ii<lines.length;ii++) {
		line = lines[ii];
		var thickness = parseFloat(line.getAttribute("stroke-width"));
		line.setAttribute("stroke-width",thickness*zoom);
		line.clone.setAttribute("stroke-width",thickness*zoom);
	}
	var face;
	var faces = getFaces();
	for (var ii=0;ii<faces.length;ii++) {
		face = faces[ii];
		face.under.setAttribute("stroke-width", faceSpaceCorrection);
		face.clone.under.setAttribute("stroke-width", faceSpaceCorrection);
	}
	snapDots(getDots(),true);
	document.getElementById("zoomLabel").innerHTML = zoomLevel;
}

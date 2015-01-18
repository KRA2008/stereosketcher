'use strict';

var zoomLevel = 0.0;
var zoomSpeed = 1.5;
var zoomLimit = 15.0;

function zoom(event) {
	editMode();
	var dot;
	var dots = getDots();
	var diffX, diffY;
	var shiftX, shiftY;
	var oldX, oldY;
	var eventX = event.clientX;
	var eventY = event.clientY;
	var roll = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
	var zoom = zoomSpeed;
	if(roll<0) {
		zoom = 1-((zoomSpeed-1)/zoomSpeed);
	}
	if(roll>0) {
		if(zoomLevel>=zoomLimit) {
			return;
		}
		zoomLevel++;
	} else {
		if(zoomLevel<=-1*zoomLimit) {
			return;
		}
		zoomLevel--;
	}		
	IPD*=zoom;
	shiftSpeed*=zoom;
	defaultLineThickness*=zoom;
	for(var ii=0;ii<dots.length;ii++) {
		dot = dots[ii];
		oldX = parseFloat(dot.getAttribute("cx"));
		oldY = parseFloat(dot.getAttribute("cy"));
		diffX = eventX-oldX;
		diffY = eventY-oldY;
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
	refresh();
}

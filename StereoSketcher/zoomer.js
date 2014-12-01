'use strict';

var zoomLevel = 0.0;
var zoomSpeed = 1.5;
var zoomLimit = 15.0;

function zoom(event)
{
	var dot;
	var dots = getDots();
	var diffX, diffY;
	var shiftX, shiftY;
	var oldX, oldY;
	var eventX = event.clientX;
	var eventY = event.clientY;
	var roll = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
	var up = zoomSpeed;
	var down = 1-((zoomSpeed-1)/zoomSpeed);
	if(roll>0) 
	{
		if(zoomLevel>=zoomLimit) return;
		IPD*=zoomSpeed;
		shiftSpeed*=up;
		lineThickness*=up;
		zoomLevel++;
		showDots();
	}
	else
	{
		if(zoomLevel<=-1*zoomLimit) return;
		IPD/=zoomSpeed;
		shiftSpeed*=down;
		lineThickness*=down;
		zoomLevel--;
		showDots();
	}
	for(var ii=0;ii<dots.length;ii++)
	{
		dot = dots[ii];
		oldX = parseFloat(dot.getAttribute("cx"));
		oldY = parseFloat(dot.getAttribute("cy"));
		diffX = eventX-oldX;
		diffY = eventY-oldY;
		if(roll>0)
		{
			shiftX = diffX-up*diffX;
			shiftY = diffY-up*diffY;
		}
		else
		{
			shiftX = diffX-diffX*down;
			shiftY = diffY-diffY*down;
		}
		moveDot(dot,shiftX,shiftY);
	}
	refresh();
}

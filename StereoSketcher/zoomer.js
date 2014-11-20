var zoomLevel = 0.0;
var zoomSpeed = 2.0;
var zoomLimit = 15.0;

function zoom(event)
{
	var dot;
	var dots = getDots();
	var diffX, diffY;
	var shiftX, shiftY;
	var eventX = event.clientX;
	var eventY = event.clientY;
	var roll = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
	if(roll>0) 
	{
		if(zoomLevel>=zoomLimit) return;
		//IPD*=zoomSpeed;
		shiftSpeed*=zoomSpeed;
		zoomLevel++;
	}
	else
	{
		if(zoomLevel<=-1*zoomLimit) return;
		//IPD/=zoomSpeed;
		shiftSpeed/=zoomSpeed;
		zoomLevel--;
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
			shiftX = (1-zoomSpeed)*diffX;
			shiftY = (1-zoomSpeed)*diffY;
		}
		else
		{
			shiftX = diffX/zoomSpeed;
			shiftY = diffY/zoomSpeed;
		}
		dragDot(dot,shiftX,shiftY);
	}
}

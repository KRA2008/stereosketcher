var zoomLevel = 0;
var zoomSpeed = 2;

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
		IPD*=zoomSpeed;
	}
	else
	{
		IPD/=zoomSpeed;
	}
	for(var ii=0;ii<dots.length;ii++)
	{
		dot = dots[ii];
		oldX = parseInt(dot.getAttribute("cx"));
		oldY = parseInt(dot.getAttribute("cy"));
		diffX = eventX-oldX;
		diffY = eventY-oldY;
		if(roll>0) //in
		{
			shiftX = (1-zoomSpeed)*diffX;
			shiftY = (1-zoomSpeed)*diffY;
		}
		else //out
		{
			shiftX = diffX/zoomSpeed;
			shiftY = diffY/zoomSpeed;
		}
		dragDot(dot,shiftX,shiftY);
	}
}

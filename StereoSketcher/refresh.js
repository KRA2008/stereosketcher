'use strict';

function refresh()
{
	var dot;
	var dots = getDots();
	for (var ii=0;ii<dots.length;ii++)
	{
		dot = dots[ii];
		moveDot(dot,0,0);
	}
	var line;
	var lines = getLines();
	for (var ii=0;ii<lines.length;ii++)
	{
		line = lines[ii];
		line.setAttribute("stroke-width",lineThickness);
		line.clone.setAttribute("stroke-width",lineThickness);
	}
	var face;
	var faces = getFaces();
	for (var ii=0;ii<faces.length;ii++)
	{
		face = faces[ii];
		face.under.setAttribute("stroke-width", faceSpaceCorrection+"px");
		face.clone.under.setAttribute("stroke-width", faceSpaceCorrection+"px");
	}
}
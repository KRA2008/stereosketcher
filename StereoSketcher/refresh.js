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
}
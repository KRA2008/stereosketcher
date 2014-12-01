'use strict';

function dragDots(event,dots) {
	var dx=event.clientX-prevX;
	var dy=event.clientY-prevY;
	var dot;
	for(var ii=0;ii<dots.length;ii++)
	{
		dot=dots[ii];
		moveDot(dot,dx,dy);
	}
	prevX=event.clientX;
	prevY=event.clientY;
}

function moveDot(dot,dx,dy)
{
	var line;
	var face;
	var x=0.0;
	var y=0.0;
	var lines = [];
	var faces = [];
	var facex1 = 0.0;
	var facey1 = 0.0;
	var facex2 = 0.0;
	var facey2 = 0.0;
	var facex3 = 0.0;
	var facey3 = 0.0;
	var faceCoord = "";
	var cloneCoord = "";
	x=parseFloat(dot.getAttribute("cx"))+dx;
	y=parseFloat(dot.getAttribute("cy"))+dy;
	dot.setAttribute("cx",x);
	dot.setAttribute("cy",y);
	lines=dot.lines;
	for(var ij=0;ij<lines.length;ij++)
	{
		line = lines[ij];
		if(line.dot1 == dot)
		{
			line.setAttribute("x1",x);
			line.setAttribute("y1",y);
			line.clone.setAttribute("x1",x+IPD+dot.shift*shiftSpeed);
			line.clone.setAttribute("y1",y);
		}
		else if(line.dot2 == dot)
		{
			line.setAttribute("x2",x);
			line.setAttribute("y2",y);
			line.clone.setAttribute("x2",x+IPD+dot.shift*shiftSpeed);
			line.clone.setAttribute("y2",y);
		}
	}
	faces = dot.faces;
	for(var ik=0;ik<faces.length;ik++)
	{
		face = faces[ik];
		if(face.dot1 == dot)
		{
			facex1 = x;
			facey1 = y;
			facex2 = face.dot2.getAttribute("cx");
			facey2 = face.dot2.getAttribute("cy");
			facex3 = face.dot3.getAttribute("cx");
			facey3 = face.dot3.getAttribute("cy");
			faceCoord = [facex1,",",facey1," ",facex2,",",facey2," ",facex3,",",facey3].join('');
			face.setAttribute("points",faceCoord);
			face.under.setAttribute("points",faceCoord);
			cloneCoord = [(x+IPD+face.dot1.shift*shiftSpeed),",",facey1," ",(parseFloat(facex2)+face.dot2.shift*shiftSpeed+IPD),",",facey2," ",(parseFloat(facex3)+face.dot3.shift*shiftSpeed+IPD),",",facey3].join('');
			face.clone.setAttribute("points",cloneCoord);
			face.clone.under.setAttribute("points",cloneCoord);
		}
		if(face.dot2 == dot)
		{
			facex1 = face.dot1.getAttribute("cx");
			facey1 = face.dot1.getAttribute("cy");
			facex2 = x;
			facey2 = y;
			facex3 = face.dot3.getAttribute("cx");
			facey3 = face.dot3.getAttribute("cy");
			faceCoord = [facex1,",",facey1," ",facex2,",",facey2," ",facex3,",",facey3].join('');
			face.setAttribute("points",faceCoord);
			face.under.setAttribute("points",faceCoord);
			cloneCoord = [(parseFloat(facex1)+IPD+face.dot1.shift*shiftSpeed),",",facey1," ",(x+face.dot2.shift*shiftSpeed+IPD),",",facey2," ",(parseFloat(facex3)+face.dot3.shift*shiftSpeed+IPD),",",facey3].join('');
			face.clone.setAttribute("points",cloneCoord);
			face.clone.under.setAttribute("points",cloneCoord);
		}
		if(face.dot3 == dot)
		{
			facex1 = face.dot1.getAttribute("cx");
			facey1 = face.dot1.getAttribute("cy");
			facex2 = face.dot2.getAttribute("cx");
			facey2 = face.dot2.getAttribute("cy");
			facex3 = x;
			facey3 = y;
			faceCoord = [facex1,",",facey1," ",facex2,",",facey2," ",facex3,",",facey3].join('');
			face.setAttribute("points",faceCoord);
			face.under.setAttribute("points",faceCoord);
			cloneCoord = [(parseFloat(facex1)+IPD+face.dot1.shift*shiftSpeed),",",facey1," ",(parseFloat(facex2)+face.dot2.shift*shiftSpeed+IPD),",",facey2," ",(x+face.dot3.shift*shiftSpeed+IPD),",",facey3].join('');
			face.clone.setAttribute("points",cloneCoord);
			face.clone.under.setAttribute("points",cloneCoord);
		}
	}
	dot.label.setAttribute("x",parseFloat(dot.getAttribute("cx"))+labelX);
	dot.label.setAttribute("y",parseFloat(dot.getAttribute("cy"))+labelY);
}

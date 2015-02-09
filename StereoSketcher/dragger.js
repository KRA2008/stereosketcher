'use strict';

function snapDots(dots,event) {
	var dx = 0;
	var dy = 0;
	if(event) {
		dx=event.clientX-prevX;
		dy=event.clientY-prevY;
	}
	var dot;
	for(var ii=0;ii<dots.length;ii++) {
		dot=dots[ii];
		moveDot(dot,dx,dy);
	}
	moveShapes();
	if(event) {
		prevX=event.clientX;
		prevY=event.clientY;
	}
}

function moveShapes() {
	var lines = getLines();
	var line;
	var faces = getFaces();
	var face;
	var x,y;
	var facex1 = 0.0;
	var facey1 = 0.0;
	var facex2 = 0.0;
	var facey2 = 0.0;
	var facex3 = 0.0;
	var facey3 = 0.0;
	var faceCoord = "";
	var cloneCoord = "";
	for(var ii=0;ii<lines.length;ii++) {
		line = lines[ii];
		if(doesElementHaveClass(line,"tempMoving")) {
			x=parseFloat(line.dot1.getAttribute("cx"));
			y=parseFloat(line.dot1.getAttribute("cy"));
			line.setAttribute("x1",x);
			line.setAttribute("y1",y);
			line.clone.setAttribute("x1",x+IPD+line.dot1.shift*shiftSpeed);
			line.clone.setAttribute("y1",y);
			
			x=parseFloat(line.dot2.getAttribute("cx"));
			y=parseFloat(line.dot2.getAttribute("cy"));
			line.setAttribute("x2",x);
			line.setAttribute("y2",y);
			line.clone.setAttribute("x2",x+IPD+line.dot2.shift*shiftSpeed);
			line.clone.setAttribute("y2",y);
			
			removeClassFromElement(line,"tempMoving");
		}
	}
	for(var ii=0;ii<faces.length;ii++) {
		face = faces[ii];
		if(doesElementHaveClass(face,"tempMoving")) {
			facex1 = face.dot1.getAttribute("cx");
			facey1 = face.dot1.getAttribute("cy");
			facex2 = face.dot2.getAttribute("cx");
			facey2 = face.dot2.getAttribute("cy");
			facex3 = face.dot3.getAttribute("cx");
			facey3 = face.dot3.getAttribute("cy");
			
			faceCoord = [facex1,",",facey1," ",facex2,",",facey2," ",facex3,",",facey3].join('');
			face.setAttribute("points",faceCoord);
			face.under.setAttribute("points",faceCoord);
			
			cloneCoord = [
			(parseFloat(facex1)+face.dot1.shift*shiftSpeed+IPD),",",facey1," ",
			(parseFloat(facex2)+face.dot2.shift*shiftSpeed+IPD),",",facey2," ",
			(parseFloat(facex3)+face.dot3.shift*shiftSpeed+IPD),",",facey3].join('');
			face.clone.setAttribute("points",cloneCoord);
			face.clone.under.setAttribute("points",cloneCoord);
			
			removeClassFromElement(face,"tempMoving");
		}
	}
}

function moveDot(dot,dx,dy) {
	var x=parseFloat(dot.getAttribute("cx"))+dx;
	var y=parseFloat(dot.getAttribute("cy"))+dy;
	dot.setAttribute("cx",x);
	dot.setAttribute("cy",y);
	dot.label.setAttribute("x",parseFloat(dot.getAttribute("cx"))+labelX);
	dot.label.setAttribute("y",parseFloat(dot.getAttribute("cy"))+labelY);
	for(var ii=0;ii<dot.lines.length;ii++) {
		addClassToElement(dot.lines[ii],"tempMoving");
	}
	for(var ii=0;ii<dot.faces.length;ii++) {
		addClassToElement(dot.faces[ii],"tempMoving");
	}
}
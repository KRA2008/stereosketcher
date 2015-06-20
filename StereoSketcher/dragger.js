'use strict';

var cx, cy, transmogrifyMarker;
var anchorX, anchorY;

function snapDots(dots,IPDchanging,event,button) {
	var dx = 0;
	var dy = 0;
	if(event) {
		dx=event.clientX-prevX;
		dy=event.clientY-prevY;
		if(button == 0 ) {
			if(event.ctrlKey) {
				//rotate(dots,event,dx,dy);
			} else {
				var dot;
				for (var ii = 0; ii < dots.length; ii++) {
					dot = dots[ii];
					moveDot(dot, dx, dy);
				}
			}
		} else if (button == 2) {
			stretch(dots,event,dx,dy);
		}
	}
	if(IPDchanging) {
		findIPD();
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
	for(var ii=0;ii<lines.length;ii++) {
		line = lines[ii];
		if(doesElementHaveClass(line,"tempMoving")) {
			snapLine(line);			
			removeClassFromElement(line,"tempMoving");
		}
	}
	for(var ii=0;ii<faces.length;ii++) {
		face = faces[ii];
		if(doesElementHaveClass(face,"tempMoving")) {
			snapFace(face);			
			removeClassFromElement(face,"tempMoving");
		}
	}
}

function snapFace(face) {
	var facex1 = face.dot1.getAttribute("cx");
	var facey1 = face.dot1.getAttribute("cy");
	var facex2 = face.dot2.getAttribute("cx");
	var facey2 = face.dot2.getAttribute("cy");
	var facex3 = face.dot3.getAttribute("cx");
	var facey3 = face.dot3.getAttribute("cy");
	
	var faceCoord = [facex1,",",facey1," ",facex2,",",facey2," ",facex3,",",facey3].join('');
	face.setAttribute("points",faceCoord);
	face.under.setAttribute("points",faceCoord);
	
	var cloneCoord = [
	(parseFloat(facex1)+face.dot1.getShift()*shiftSpeed+IPD),",",facey1," ",
	(parseFloat(facex2)+face.dot2.getShift()*shiftSpeed+IPD),",",facey2," ",
	(parseFloat(facex3)+face.dot3.getShift()*shiftSpeed+IPD),",",facey3].join('');
	face.clone.setAttribute("points",cloneCoord);
	face.clone.under.setAttribute("points",cloneCoord);
}

function snapLine(line) {
	var x=parseFloat(line.dot1.getAttribute("cx"));
	var y=parseFloat(line.dot1.getAttribute("cy"));
	line.setAttribute("x1",x);
	line.setAttribute("y1",y);
	line.clone.setAttribute("x1",x+IPD+line.dot1.getShift()*shiftSpeed);
	line.clone.setAttribute("y1",y);
	
	x=parseFloat(line.dot2.getAttribute("cx"));
	y=parseFloat(line.dot2.getAttribute("cy"));
	line.setAttribute("x2",x);
	line.setAttribute("y2",y);
	line.clone.setAttribute("x2",x+IPD+line.dot2.getShift()*shiftSpeed);
	line.clone.setAttribute("y2",y);
}

function moveDot(dot,dx,dy) {
	var x=parseFloat(dot.getAttribute("cx"))+dx;
	var y=parseFloat(dot.getAttribute("cy"))+dy;
	dot.setAttribute("cx",x);
	dot.setAttribute("cy",y);
	dot.label.setAttribute("x",x+labelX);
	dot.label.setAttribute("y",y+labelY);
	for(var ii=0;ii<dot.lines.length;ii++) {
		addClassToElement(dot.lines[ii],"tempMoving");
	}
	for(var ii=0;ii<dot.faces.length;ii++) {
		addClassToElement(dot.faces[ii],"tempMoving");
	}
}

function stretch(dots,event,dx,dy) {
	if(dx !=0 && !anchorX) {
		assignAnchorX(dots,event,dx,dy);
	}
	if(dy !=0 && !anchorY) {
		assignAnchorY(dots,event,dx,dy);
	}
	var dot;
	for (var ii = 0; ii < dots.length; ii++) {
		dot = dots[ii];
		stretchDot(dot, event, dx, dy);
	}
}

function stretchDot(dot,event,dx,dy) {
	var cx=parseFloat(dot.getAttribute("cx"));
	var cy=parseFloat(dot.getAttribute("cy"));
	var dxScaled = ((anchorX-cx)/(event.clientX-dx))*dx;
	var dyScaled = ((anchorY-cy)/(event.clientY-dy))*dy;
	var x=cx+dxScaled;
	var y=cy+dyScaled;
	dot.setAttribute("cx",x);
	dot.setAttribute("cy",y);
	dot.label.setAttribute("x",x+labelX);
	dot.label.setAttribute("y",y+labelY);
	for(var ii=0;ii<dot.lines.length;ii++) {
		addClassToElement(dot.lines[ii],"tempMoving");
	}
	for(var ii=0;ii<dot.faces.length;ii++) {
		addClassToElement(dot.faces[ii],"tempMoving");
	}
}

function assignAnchorX(dots,event,dx) {
	var spread=findSpread(dots);
	var maxXDiff=Math.abs(event.clientX-dx-spread.maxX);
	var minXDiff=Math.abs(event.clientX-dx-spread.minX);
	if(maxXDiff>minXDiff) {
		anchorX = spread.minX;
	} else {
		anchorX = spread.maxX;
	}
}

function assignAnchorY(dots,event,dy) {
	var spread=findSpread(dots);
	var maxYDiff=Math.abs(event.clientY-dy-spread.maxY);
	var minYDiff=Math.abs(event.clientY-dy-spread.minY);
	if(maxYDiff>minYDiff) {
		anchorY = spread.minY;
	} else {
		anchorY = spread.maxY;
	}
}

function removeAnchors() {
	anchorX=null;
	anchorY=null;
}

function findSpread(dots) {
	var dot=dots[0];
	var x, y;
	var spread = {};
	spread.maxX=parseFloat(dot.getAttribute("cx"));
	spread.maxXDot=dot;
	spread.minX=spread.maxX;
	spread.minXDot=dot;
	spread.maxY=parseFloat(dot.getAttribute("cy"));
	spread.maxYDot=dot;
	spread.minY=spread.maxY;
	spread.minYDot=dot;
	for(var ii=1;ii<dots.length;ii++) {
		dot = dots[ii];
		x = parseFloat(dot.getAttribute("cx"));
		y = parseFloat(dot.getAttribute("cy"));
		if(x>spread.maxX) {
			spread.maxX = x;
			spread.maxXDot = dot;
		} else if(x<spread.minX) {
			spread.minX = x;
			spread.minXDot = dot;
		}
		if(y>spread.maxY) {
			spread.maxY = y;
			spread.maxYDot = dot;
		} else if(y<spread.minY) {
			spread.minY = y;
			spread.minYDot = dot;
		}
	}
	return spread;
}

function transmogrify(dots,event,dx,dy) {
	if(!transmogrifyMarker) {
		addMarker(dots);	
	}
	
	var x,y;
	var dot;
	var ax = event.clientX-cx-dx;
	var ay = event.clientY-cy-dy;
	var magA = magnitude(ax,ay);
	var magD = magnitude(dx,dy);
	var arctanA = Math.atan2(ay,ax);
	var arctanADeg = (arctanA*180)/Math.PI;
	var arctanD = Math.atan2(dy,dx);
	var arctanDDeg = (arctanD*180)/Math.PI;
	var arcsum1 = arctanD-arctanA;
	
	var oldX, oldY, newX, newY, bx, by, magRatio, arctanB, arcsum2;
	for(var ii=0;ii<dots.length;ii++) {
		dot = dots[ii];
		oldX=parseFloat(dot.getAttribute("cx"));
		oldY=parseFloat(dot.getAttribute("cy"));
		
		bx = oldX-cx;
		by = oldY-cy;
		
		arctanB = Math.atan2(by,bx);
		var arctanBDeg = (arctanB*180)/Math.PI;
		arcsum2 = arcsum1+arctanB;
		
		var magB = magnitude(bx,by);
		magRatio = magB/magA;
		
		newX = oldX+magRatio*magD*Math.cos(arcsum2);
		newY = oldY+magRatio*magD*Math.sin(arcsum2);
		
		dot.setAttribute("cx",newX);
		dot.setAttribute("cy",newY);
		dot.label.setAttribute("x",newX+labelX);
		dot.label.setAttribute("y",newY+labelY);
		for(var jj=0;jj<dot.lines.length;jj++) {
			addClassToElement(dot.lines[jj],"tempMoving");
		}
		for(var jj=0;jj<dot.faces.length;jj++) {
			addClassToElement(dot.faces[jj],"tempMoving");
		}
	}
}

function magnitude(x,y) {
	return Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
}

function addMarker(dots) {
	var spread = findSpread(dots);
	cx = (spread.maxX + spread.minX) / 2;
	cy = (spread.maxY + spread.minY) / 2;
	transmogrifyMarker = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	var r = 5;
	transmogrifyMarker.setAttribute("cx",cx-r);
	transmogrifyMarker.setAttribute("cy",cy-r);
	transmogrifyMarker.setAttribute("r", r);
	transmogrifyMarker.setAttribute("stroke", "green");
	transmogrifyMarker.setAttribute("stroke-width", 5.0);
	transmogrifyMarker.setAttribute("fill", "red");
	transmogrifyMarker.setAttribute("fill-opacity", 1);
	transmogrifyMarker.setAttribute("id","transmogrifyMarker");
	shapeGroup.appendChild(transmogrifyMarker);
}

function removeMarker() {
	if(transmogrifyMarker) {
		transmogrifyMarker = null;
		shapeGroup.removeChild(document.getElementById("transmogrifyMarker"));
	}
}

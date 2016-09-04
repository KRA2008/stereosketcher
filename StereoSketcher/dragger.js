'use strict';

var cx, cy, rotateMarker;
var anchorX, anchorY;
var tempMoving = "tempMoving";

function snapDots(dots,IPDchanging,event,button) {
	var dx = 0;
	var dy = 0;
	if(event) {
		dx=event.clientX-prevX;
		dy=event.clientY-prevY;
		if(button == 0 ) {
			if(event.ctrlKey) {
				rotate(dots,event,dx,dy);
			} else {
			    removeMarker();
				var dot;
				for (var ii = 0; ii < dots.length; ii++) {
					dot = dots[ii];
					moveDot(dot, dx, dy);
				}
			}
		} else if (button == 2) {
			stretch(dots,event,dx,dy);
		}
	} else {
	    var shapes = getShapes();
	    var shape;
	    for (var ii = 0; ii < shapes.length; ii++) {
	        addClassToElement(shapes[ii], tempMoving);
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
	var images = getImages();
	var image;
	var bases = getBases();
	var base;
	for(var ii=0;ii<lines.length;ii++) {
		line = lines[ii];
		if(doesElementHaveClass(line,tempMoving)) {
			snapLine(line);			
			removeClassFromElement(line,tempMoving);
		}
	}
	for(var ii=0;ii<faces.length;ii++) {
		face = faces[ii];
		if(doesElementHaveClass(face,tempMoving)) {
			snapFace(face);			
			removeClassFromElement(face,tempMoving);
		}
	}
	for(var ii=0;ii<images.length;ii++) {
		image = images[ii];
		if(doesElementHaveClass(image,tempMoving)) {
			snapImage(image);
			removeClassFromElement(image,tempMoving);
		}
	}
	for(var ii=0;ii<bases.length;ii++) {
		base = bases[ii];
		if(doesElementHaveClass(base,tempMoving)) {
			snapBase(base);
			removeClassFromElement(base,tempMoving);
		}
	}
}

function snapFace(face) {
	
	var dotsString = makePolygonPointString(face.dots,false);
	
	face.setAttribute("points",dotsString);
	face.under.setAttribute("points",dotsString);
	
	var cloneDotsString = makePolygonPointString(face.dots,true);
	
	face.clone.setAttribute("points",cloneDotsString);
	face.clone.under.setAttribute("points",cloneDotsString);
}

function makePolygonPointString(dots,isClone) {
	var pointString = "";
	var dot;
	for(var ii=0;ii<dots.length;ii++) {
		dot = dots[ii];
		if(isClone) {
			pointString+=(parseFloat(dot.getAttribute("cx"))+dot.getShift()*shiftSpeed+IPD);
		} else {
			pointString+=dot.getAttribute("cx");
		}
		pointString+=",";
		pointString+=dot.getAttribute("cy");
		pointString+=" ";
	}
	return pointString;
}

function makeBoxFromTwoPointsString(dots) {
	var pointString = "";
	pointString+=dots[0].getAttribute("cx");
	pointString+=",";
	pointString+=dots[0].getAttribute("cy");
	pointString+=" ";
	pointString+=dots[1].getAttribute("cx");
	pointString+=",";
	pointString+=dots[0].getAttribute("cy");
	pointString+=" ";
	pointString+=dots[1].getAttribute("cx");
	pointString+=",";
	pointString+=dots[1].getAttribute("cy");
	pointString+=" ";
	pointString+=dots[0].getAttribute("cx");
	pointString+=",";
	pointString+=dots[1].getAttribute("cy");
	pointString+=" ";
	return pointString;
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

function snapImage(image) {
	var sourcePoints = [[0,0],[parseFloat(image.getAttribute("width")),0],[parseFloat(image.getAttribute("width")),parseFloat(image.getAttribute("height"))],[0,parseFloat(image.getAttribute("height"))]];
	var targetPoints = [getDotPoint(image.dots[0]),getDotPoint(image.dots[1]),getDotPoint(image.dots[2]),getDotPoint(image.dots[3])];
	
	applyMatrix(image,sourcePoints,targetPoints);
	
	for(var ii=0;ii<4;ii++) {
		targetPoints[ii][0]+=IPD+image.dots[ii].getShift()*shiftSpeed;
	}
	applyMatrix(image.clone,sourcePoints,targetPoints);
	
	image.indicator.setAttribute("points",makePolygonPointString(image.dots,false));
}

function snapBase(base) {
	var sourcePoints = [[0,0],[parseFloat(base.getAttribute("width")),0],[parseFloat(base.getAttribute("width")),parseFloat(base.getAttribute("height"))],[0,parseFloat(base.getAttribute("height"))]];
	var point1 = getDotPoint(base.dots[0]);
	var point2 = getDotPoint(base.dots[1]);
	var targetPoints = [point1,[point2[0],point1[1]],point2,[point1[0],point2[1]]];
	
	applyMatrix(base,sourcePoints,targetPoints);
	
	base.indicator.setAttribute("points",makeBoxFromTwoPointsString(base.dots));
}

function applyMatrix(image,sourcePoints,targetPoints) {	
	for (var a = [], b = [], i = 0, n = sourcePoints.length; i < n; ++i) {
    	var s = sourcePoints[i], t = targetPoints[i];
    	a.push([s[0], s[1], 1, 0, 0, 0, -s[0] * t[0], -s[1] * t[0]]), b.push(t[0]);
    	a.push([0, 0, 0, s[0], s[1], 1, -s[0] * t[1], -s[1] * t[1]]), b.push(t[1]);
	}
	var X = solve(a, b, true), matrix = [
    X[0], X[3], 0, X[6],
    X[1], X[4], 0, X[7],
       0,    0, 1,    0,
    X[2], X[5], 0,    1
	];
	
	image.setAttribute("style", "transform: matrix3d(" + matrix + ");");
}

function getDotPoint(dot) {
	return [parseFloat(dot.getAttribute("cx")),parseFloat(dot.getAttribute("cy"))];
}

function moveDot(dot,dx,dy) {
	var x=parseFloat(dot.getAttribute("cx"))+dx;
	var y=parseFloat(dot.getAttribute("cy"))+dy;
	dot.setAttribute("cx",x);
	dot.setAttribute("cy",y);
	dot.label.setAttribute("x",x+labelX);
	dot.label.setAttribute("y",y+labelY);
	for(var ii=0;ii<dot.lines.length;ii++) {
		addClassToElement(dot.lines[ii],tempMoving);
	}
	for(var ii=0;ii<dot.faces.length;ii++) {
		addClassToElement(dot.faces[ii],tempMoving);
	}
	for(var ii=0;ii<dot.images.length;ii++) {
		addClassToElement(dot.images[ii],tempMoving);
	}
	for(var ii=0;ii<dot.bases.length;ii++) {
		addClassToElement(dot.bases[ii],tempMoving);
	}
}

function stretch(dots,event,dx,dy) {
	if(!anchorX) {
		assignAnchorX(dots,event,dx);
	}
	if(!anchorY) {
		assignAnchorY(dots,event,dy);
	}
	var magRatio;
	if(event.ctrlKey) {
		var ex = event.clientX-dx-anchorX;
		var ey = event.clientY-dy-anchorY;
		var magM = (dx*ex+dy*ey)/magnitude([ex,ey]);
		var magE = magnitude([ex,ey]);
		magRatio = magM/magE;
	}
	var dot;
	for (var ii = 0; ii < dots.length; ii++) {
		dot = dots[ii];
		stretchDot(dot, event, dx, dy, magRatio);
	}
}

function stretchDot(dot,event,dx,dy,magRatio) {
	var dxScaled=0,dyScaled=0;
	var oldX=parseFloat(dot.getAttribute("cx"));
	var oldY=parseFloat(dot.getAttribute("cy"));
	if(event.ctrlKey) {
		var magDel = magnitude([oldX-anchorX,oldY-anchorY])*magRatio;
		var cTan = Math.atan2(oldY-anchorY,oldX-anchorX);
		dxScaled = magDel*Math.cos(cTan);
		dyScaled = magDel*Math.sin(cTan);
	} else {
		var num = anchorX-oldX;
		var denom = anchorX-event.clientX+dx;
		if(denom==0) {
			dxScaled = dx;
		} else {
			dxScaled = (num/denom)*dx;
		}
		
		var num = anchorY-oldY;
		var denom = anchorY-event.clientY+dy;
		if(denom==0) {
			dyScaled = dy;
		} else {
			dyScaled = (num/denom)*dy;
		}
	}
	
	var newX=oldX+dxScaled;
	dot.setAttribute("cx",newX);
	dot.label.setAttribute("x",newX+labelX);
	
	var newY=oldY+dyScaled;
	dot.setAttribute("cy",newY);
	dot.label.setAttribute("y",newY+labelY);
	for(var ii=0;ii<dot.lines.length;ii++) {
		addClassToElement(dot.lines[ii],tempMoving);
	}
	for(var ii=0;ii<dot.faces.length;ii++) {
		addClassToElement(dot.faces[ii],tempMoving);
	}
	for(var ii=0;ii<dot.images.length;ii++) {
		addClassToElement(dot.images[ii],tempMoving);
	}
	for(var ii=0;ii<dot.bases.length;ii++) {
		addClassToElement(dot.bases[ii],tempMoving);
	}
}

function assignAnchorX(dots,event,dx) {
	var spread = findSpread(dots);
	var maxXDiff=Math.abs(event.clientX-dx-spread.maxX);
	var minXDiff=Math.abs(event.clientX-dx-spread.minX);
	if(maxXDiff<minXDiff) {
		anchorX = spread.minX;
	} else {
		anchorX = spread.maxX;
	}
}

function assignAnchorY(dots,event,dy) {
	var spread = findSpread(dots);
	var maxYDiff=Math.abs(event.clientY-dy-spread.maxY);
	var minYDiff=Math.abs(event.clientY-dy-spread.minY);
	if(maxYDiff<minYDiff) {
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

function rotate(dots,event,dx,dy) {
	if(!(cx && cy)) {
		addMarker(dots);	
	}
	
	var ax = event.clientX-cx+dx;
	var ay = event.clientY-cy+dy;
	
	var magA = magnitude([ax,ay]);
	var arctanA = Math.atan2(ay,ax);
	
	var magD = magnitude([dx,dy]);
	var arctanD = Math.atan2(dy,dx);
	var magN = magD*Math.sin(arctanA-arctanD);
	
	var dot;
	for(var ii=0;ii<dots.length;ii++) {
		dot = dots[ii];
		var oldX=parseFloat(dot.getAttribute("cx"));
		var oldY=parseFloat(dot.getAttribute("cy"));
		
		var bx = oldX-cx;
		var by = oldY-cy;
		
		var arctanB = Math.atan2(by,bx);
		
		var magB = magnitude([bx,by]);
		var magRatio = magB/magA;
		
		var proportionalDx = magRatio*magN*Math.sin(Math.PI-arctanB);
		var proportionalDy = magRatio*magN*Math.cos(Math.PI-arctanB);
		
		var straightNewX = oldX+proportionalDx;
		var straightNewY = oldY+proportionalDy;
		
		var newMagB = magnitude([straightNewX-cx,straightNewY-cy]);
		var curveError = newMagB-magB;
		
		var arctanNewB = Math.atan2(straightNewX-cx,straightNewY-cy);
		
		var curveDx = curveError*Math.cos(3*Math.PI/2-arctanNewB);
		var curveDy = curveError*Math.sin(3*Math.PI/2-arctanNewB);
		
		dot.setAttribute("cx",straightNewX+curveDx);
		dot.setAttribute("cy",straightNewY+curveDy);
		dot.label.setAttribute("x",straightNewX+curveDx+labelX);
		dot.label.setAttribute("y",straightNewY+curveDy+labelY);
		for(var jj=0;jj<dot.lines.length;jj++) {
			addClassToElement(dot.lines[jj],tempMoving);
		}
		for(var jj=0;jj<dot.faces.length;jj++) {
			addClassToElement(dot.faces[jj],tempMoving);
		}
		for(var jj=0;jj<dot.images.length;jj++) {
			addClassToElement(dot.images[jj],tempMoving);
		}
	}
}

function magnitude(components) {
	var squareSum = 0;
	for(var ii=0;ii<components.length;ii++) {
		squareSum+=square(components[ii]);
	}
	return Math.sqrt(squareSum);
}

function square(x) {
	return Math.pow(x,2);
}

function addMarker(dots) {
	var spread = findSpread(dots);
	cx = (spread.maxX + spread.minX) / 2;
	cy = (spread.maxY + spread.minY) / 2;
}

function removeMarker() {
	if(cx && cy) {
		cx = null;
		cy = null;
	}
}

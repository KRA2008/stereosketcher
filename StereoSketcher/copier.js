'use strict';

function copyAndPasteSelectedShapes(x,y) {
	var mid = findMiddleOfCopyableDots();
	doTheActualCopy(x,y,mid);
	restackCopies();
	cleanUpCopies();
}

function restackCopies() {
	var shapes = getLinesAndFaces();
	var shape;
	for(var ii=0;ii<shapes.length;ii++) {
		shape = shapes[ii];
		if(shape.copy) {
			shape.copy.remove();
			shape.copy.add();
		}
	}
}

function cleanUpCopies() {
	var dots = getDots();
	for(var ii=0;ii<dots.length;ii++) {
		dots[ii].copy = null;
	}
	var shapes = getLinesAndFaces();
	for(var ii=0;ii<shapes.length;ii++) {
		shapes[ii].copy = null;
	}
}

function findMiddleOfCopyableDots() {
	var dots = getDots();
	var dot;
	var shape;
	var shapes;
	var maxX;
	var maxY;
	var minX;
	var minY;
	for(var ii=0;ii<dots.length;ii++) {
		dot = dots[ii];
		shapes = dot.lines.concat(dot.faces);
		for(var jj=0;jj<shapes.length;jj++) {
			shape = shapes[jj];
			if(shape.isSelected()) {
				var x = parseFloat(dot.getAttribute("cx"));
				var y = parseFloat(dot.getAttribute("cy"));
				if(maxX == null) {
					maxX = x;
				}
				if(maxY == null) {
					maxY = y;
				}
				if(minX == null) {
					minX = x;
				}
				if(minY == null) {
					minY = y;
				}
				if(x>maxX) {
					maxX = x;
				} else if (x<minX) {
					minX = x;
				}
				if(y>maxY) {
					maxY = y;
				} else if (y<minY) {
					minY = y;
				}
			}
		}
	}
	return {
		midCopyX:(maxX+minX)/2,
		midCopyY:(maxY+minY)/2
	}
}

function doTheActualCopy(x,y,mid) {
	var lines = getLines();
	var line;
	for(var ii=0;ii<lines.length;ii++) {
		line = lines[ii];
		if(line.isSelected()) {
			if(!line.dot1.copy) {
				copyDot(line.dot1,x,y,mid);
			}
			if(!line.dot2.copy) {
				copyDot(line.dot2,x,y,mid);
			}
		}
	}
	for(var ii=0;ii<lines.length;ii++) {
		line = lines[ii];
		if(line.isSelected()) {
			copyLine(line);
		}
	}
	var faces = getFaces();
	var face;
	for(var ii=0;ii<faces.length;ii++) {
		face = faces[ii];
		if(face.isSelected()) {
			if(!face.dot1.copy) {
				copyDot(face.dot1,x,y,mid);
			}
			if(!face.dot2.copy) {
				copyDot(face.dot2,x,y,mid);
			}
			if(!face.dot3.copy) {
				copyDot(face.dot3,x,y,mid);
			}
		}
	}
	for(var ii=0;ii<faces.length;ii++) {
		face = faces[ii];
		if(face.isSelected()) {
			copyFace(face);
		}
	}
}


function copyDot(dot,x,y,mid) {
	var newX = x + parseFloat(dot.getAttribute("cx"))-mid.midCopyX;
	var newY = y + parseFloat(dot.getAttribute("cy"))-mid.midCopyY;
	var newDot = shapeFactory.createDot(newX,newY);
	dot.copy = newDot;
	newDot.lowlight();
}

function copyLine(line) {
	var newLine = shapeFactory.createLine(line.dot1.copy,line.dot2.copy);
	newLine.setThickness(parseFloat(line.getAttribute("stroke-width")));
	newLine.setColor(line.color);
	newLine.setOpacity(line.getOpacity());
	newLine.storedOpacity = line.storedOpacity;
	newLine.lowlight();
	line.copy = newLine;
}

function copyFace(face) {
	var newFace = shapeFactory.createFace(face.dot1.copy,face.dot2.copy,face.dot3.copy);
	newFace.setColor(face.color);
	newFace.setOpacity(face.getOpacity());
	newFace.storedOpacity = face.storedOpacity;
	newFace.lowlight();
	face.copy = newFace;
}

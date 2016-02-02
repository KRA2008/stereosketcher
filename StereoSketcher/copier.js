'use strict';

function copyAndPasteSelectedShapes(x,y,isExtrusion) {
	var mid = findMiddleOfCopyableDots();
	doTheActualCopy(x,y,mid,isExtrusion);
	restackCopies();
	cleanUpCopies(isExtrusion);
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

function cleanUpCopies(isExtrusion) {
	var dots = getDots();
	var dot;
	for(var ii=0;ii<dots.length;ii++) {
		dot = dots[ii];
		dot.copy = null;
		if(dot.isExtrusion) {
			dot.select();
			dot.isExtrusion = false;
		}
	}
	var shapes = getLinesAndFaces();
	var shape;
	for(var ii=0;ii<shapes.length;ii++) {
		shape = shapes[ii];
		shape.copy = null;
		if(isExtrusion) {
			shape.deselect();
		}
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

function doTheActualCopy(x,y,mid,isExtrusion) {
	var lines = getLines();
	var line;
	for(var ii=0;ii<lines.length;ii++) {
		line = lines[ii];
		if(line.isSelected()) {
			if(!line.dot1.copy) {
				copyDot(line.dot1,x,y,mid,isExtrusion);
			}
			if(!line.dot2.copy) {
				copyDot(line.dot2,x,y,mid,isExtrusion);
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
			var dots = face.dots;
			var dot;
			for(var jj=0;jj<dots.length;jj++) {
				if(!dot.copy) {
					copyDot(dot,x,y,mid,isExtrusion);
				}
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


function copyDot(dot,x,y,mid,isExtrusion) {
	var newX = x + parseFloat(dot.getAttribute("cx"))-mid.midCopyX;
	var newY = y + parseFloat(dot.getAttribute("cy"))-mid.midCopyY;
	var newDot = shapeFactory.createDot(newX,newY);
	dot.copy = newDot;
	newDot.setShift(dot.getShift());
	newDot.lowlight();
	if(isExtrusion) {
		shapeFactory.createLine(dot,newDot);
		newDot.select();
		newDot.isExtrusion = true;
	}
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
	var originalDots = face.dots;
	var copyDots;
	for(var ii=0;ii<originalDots.lengh;ii++) {
		copyDots.push(originalDots[ii].copy);
	}
	var newFace = shapeFactory.createFace(copyDots);
	newFace.setColor(face.color);
	newFace.setOpacity(face.getOpacity());
	newFace.storedOpacity = face.storedOpacity;
	newFace.lowlight();
	face.copy = newFace;
}

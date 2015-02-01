'use strict';


function lowlightAll() {
	var highlit = shapeGroup.getElementsByClassName("highlit");
	for (var ii=0;ii<highlit.length;ii++) {
		highlit[ii].lowlight();
	}
}

function selectDotsOfLine(line,event) {
	if(!event.shiftKey) {
		deselectAll();
	}
	line.dot1.select();
	line.dot2.select();
}

function selectDotsOfFace(face,event) {
	if(!event.shiftKey) {
		deselectAll();
	}
	face.dot1.select();
	face.dot2.select();
	face.dot3.select();
}

function selectShapesOfDot(dot,event) {
	if(!event.shiftKey) {
		deselectAll();
	}
	var lines = dot.lines;
	var faces = dot.faces;
	for(var ii=0;ii<lines.length;ii++) {
		lines[ii].select();
	}
	for(var ii=0;ii<faces.length;ii++) {
		faces[ii].select();
	}
}

function selectAllContiguousShapes(sourceShape,event) {
	var shapes = getLinesAndFaces();
	var shape;
	if(!event.shiftKey) {
		deselectAll();
	} else {
		for(var ii=0;ii<shapes.length;ii++) {
			shape = shapes[ii];
			if(shape.isSelected()) {
				shape.deselect();
				addClassToElement(shape,"tempSelect");
			}
		}
	}
	sourceShape.select();
	recursiveSelectShapes(sourceShape);
	for(var ii=0;ii<shapes.length;ii++) {
		shape = shapes[ii];
		if(doesElementHaveClass(shape,"tempSelect")) {
			shape.select();
			removeClassFromElement(shape,"tempSelect");
		}
	}
}

function recursiveSelectShapes(sourceShape) {
	recursiveSelectShapesDotStepper(sourceShape.dot1);
	recursiveSelectShapesDotStepper(sourceShape.dot2);
	if(doesElementHaveClass(sourceShape,"face")) {
		recursiveSelectShapesDotStepper(sourceShape.dot3);
	}
}

function recursiveSelectShapesDotStepper(dot) {
	var shape;
	for(var ii=0;ii<dot.lines.length;ii++) {
		shape = dot.lines[ii];
		if(shape.isSelected()) {
			continue;
		} else {
			shape.select();
			recursiveSelectShapes(shape);
		}
	}
	for(var jj=0;jj<dot.faces.length;jj++) {
		shape = dot.faces[jj];
		if(shape.isSelected()) {
			continue;
		} else {
			shape.select();
			recursiveSelectShapes(shape);
		}
	}
}

function selectAllContiguousDots(sourceDot,event) {
	var dots = getDots();
	var dot;
	if(!event.shiftKey) {
		deselectAll();
	} else {
		for(var ii=0;ii<dots.length;ii++) {
			dot = dots[ii];
			if(dot.isSelected()) {
				dot.deselect();
				addClassToElement(dot,"tempSelect");
			}
		}
	}
	sourceDot.select();
	recursiveSelectDots(sourceDot);
	for(var ii=0;ii<dots.length;ii++) {
		dot = dots[ii];
		if(doesElementHaveClass(dot,"tempSelect")) {
			dot.select();
			removeClassFromElement(dot,"tempSelect");
		}
	}
}

function recursiveSelectDots(dot) {
	var lines = dot.lines;
	var line;
	for(var ii=0;ii<lines.length;ii++) {
		line = lines[ii];
		if(line.dot1.isSelected() && line.dot2.isSelected()) {
			continue;
		}
		if(line.dot1 == dot) {
			line.dot2.select();
			recursiveSelectDots(line.dot2);
		} else if (line.dot2 == dot) {
			line.dot1.select();
			recursiveSelectDots(line.dot1);
		}
	}
	var faces = dot.faces;
	var face;
	for(var ii=0;ii<faces.length;ii++) {
		face = faces[ii];
		if(face.dot1.isSelected() && face.dot2.isSelected() && face.dot3.isSelected()) {
			continue;
		}
		if(face.dot1 == dot) {
			if(!face.dot2.isSelected()) {
				face.dot2.select();
				recursiveSelectDots(face.dot2);
			}
			if(!face.dot3.isSelected()) {
				face.dot3.select();
				recursiveSelectDots(face.dot3);
			}
		}
		if(face.dot2 == dot) {
			if(!face.dot1.isSelected()) {
				face.dot1.select();
				recursiveSelectDots(face.dot1);
			}
			if(!face.dot3.isSelected()) {
				face.dot3.select();
				recursiveSelectDots(face.dot3);
			}
		}
		if(face.dot3 == dot) {
			if(!face.dot2.isSelected()) {
				face.dot2.select();
				recursiveSelectDots(face.dot2);
			}
			if(!face.dot1.isSelected()) {
				face.dot1.select();
				recursiveSelectDots(face.dot1);
			}
		}
	}
}

function deselectAllDots() {
	var dot;
	var dots = getDots();
	for(var ii=0;ii<dots.length;ii++) {
		dot=dots[ii];
		dot.deselect();
	}
}

function deselectAll() {
	deselectAllDots();
	var line;
	var lines=getLines();
	for(var nn=0;nn<lines.length;nn++) {
		line=lines[nn];
		line.deselect();
	}
	var face;
	var faces=getFaces();
	for(var ii=0;ii<faces.length;ii++) {
		face=faces[ii];
		face.deselect();
	}
}
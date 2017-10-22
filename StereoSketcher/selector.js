'use strict';

function lowlightAll() {
	var highlit = shapeGroup.getElementsByClassName("highlit");
	for (var ii=0;ii<highlit.length;ii++) {
		highlit[ii].lowlight();
	}
}

function selectDotsOfLine(line,event) {
	line.dot1.select();
	line.dot2.select();
}

function selectDotsOfFaceImageOrBase(shape,event) {
	var dots = shape.dots;
	for(var ii=0;ii<dots.length;ii++) {
		dots[ii].select();
	}
}

function selectShapesOfDot(dot,event) {
	var lines = dot.lines;
	var faces = dot.faces;
	var images = dot.images;
	var bases = dot.bases;
	for(var ii=0;ii<lines.length;ii++) {
		lines[ii].select();
	}
	for(var ii=0;ii<faces.length;ii++) {
		faces[ii].select();
	}
	for(var ii=0;ii<images.length;ii++) {
		images[ii].select();
	}
	for(var ii=0;ii<bases.length;ii++) {
		bases[ii].select();
	}
}

function selectAllContiguousShapes(sourceShape,event) {
	var shapes = getShapes();
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
	if(doesElementHaveClass(sourceShape,"line")) {
		recursiveSelectShapesDotStepper(sourceShape.dot1);
		recursiveSelectShapesDotStepper(sourceShape.dot2);
	} else {
		var dots = sourceShape.dots;
		for(var ii=0;ii<dots.length;ii++) {
			recursiveSelectShapesDotStepper(dots[ii]);
		}
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
	recursiveSelectShapesFacesOrImages(dot.faces);
	recursiveSelectShapesFacesOrImages(dot.images);
	recursiveSelectShapesFacesOrImages(dot.bases);
}

function recursiveSelectShapesFacesOrImages(facesOrImages) {
	var shape;
	for(var jj=0;jj<facesOrImages.length;jj++) {
		shape = facesOrImages[jj];
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
	recursiveSelectDot(sourceDot);
	for(var ii=0;ii<dots.length;ii++) {
		dot = dots[ii];
		if(doesElementHaveClass(dot,"tempSelect")) {
			dot.select();
			removeClassFromElement(dot,"tempSelect");
		}
	}
}

function recursiveSelectDot(dot) {
	var lines = dot.lines;
	var line;
	for(var ii=0;ii<lines.length;ii++) {
		line = lines[ii];
		if(line.dot1.isSelected() && line.dot2.isSelected()) {
			continue;
		}
		if(line.dot1 == dot) {
			line.dot2.select();
			recursiveSelectDot(line.dot2);
		} else if (line.dot2 == dot) {
			line.dot1.select();
			recursiveSelectDot(line.dot1);
		}
	}
	recursiveSelectFacesOrImages(dot.faces,dot);
	recursiveSelectFacesOrImages(dot.images,dot);
	recursiveSelectFacesOrImages(dot.bases,dot);
}

function recursiveSelectFacesOrImages(facesOrImages,dot) {
	var shape;
	for(var ii=0;ii<facesOrImages.length;ii++) {
		shape = facesOrImages[ii];
		var allDone = true;
		for(var jj=0;jj<shape.dots.length;jj++) {
			if(!shape.dots[jj].isSelected()) {
				allDone = false;
			}
		}
		if(allDone) {
			continue;
		}
		for(var jj=0;jj<shape.dots.length;jj++) {
			if(shape.dots[jj] == dot) {
				for(var kk=0;kk<shape.dots.length;kk++) {
					if(shape.dots[jj] != shape.dots[kk] && !shape.dots[kk].isSelected()) {
						shape.dots[kk].select();
						recursiveSelectDot(shape.dots[kk]);
					}
				}
			}
		}
	}
}

function deselectAllDots() {
	var dots = getDots();
	for(var ii=0;ii<dots.length;ii++) {
		dots[ii].deselect();
	}
}

function deselectAll() {
	deselectAllDots();
	var lines=getLines();
	for(var nn=0;nn<lines.length;nn++) {
		lines[nn].deselect();
	}
	var faces=getFaces();
	for(var ii=0;ii<faces.length;ii++) {
		faces[ii].deselect();
	}
	var images=getImages();
	for(var ii=0;ii<images.length;ii++) {
		images[ii].deselect();
	}
	var bases=getBases();
	for(var ii=0;ii<bases.length;ii++) {
		bases[ii].deselect();
	}
}
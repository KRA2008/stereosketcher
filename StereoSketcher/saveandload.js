'use strict';

function warning() {
	alert("Loading StereoSketcher projects from other folks can harm your computer! Be careful!")
}

function save() {
	var stereosketch = collectDrawing();
	var blob = new Blob([JSON.stringify(stereosketch)], {type: "stereosketch;charset=utf-8"});
	saveAs(blob, Date.now()+".stereosketch");
}

function collectDrawing() {
	var stereosketch = {
		version:version,
		dots:[],
		shapes: [],
		background: getBackgroundColor(),
		buffer: buffer,
		mode: mode,
		zoomLevel: zoomLevel
	}
	var dot;
	var dots = getDots();
	for(var ii=0;ii<dots.length;ii++) {
		dot = dots[ii];
		dot.tempId = ii;
		stereosketch.dots.push(exportDot(dot));
	}
	var shapes = getLinesAndFaces();
	var shape;
	for(var ii=0;ii<shapes.length;ii++) {
		shape = shapes[ii];
		if(doesElementHaveClass(shape,"line")) {
			stereosketch.shapes.push(exportLine(shape));
		} else if(doesElementHaveClass(shape,"face")) {
			stereosketch.shapes.push(exportFace(shape));
		}
	}
	return stereosketch;
}

function exportDot(dot) {
	return {
		shift:dot.getShift(),
		cx:parseFloat(dot.getAttribute("cx")),
		cy:parseFloat(dot.getAttribute("cy"))
	}
}

function exportLine(line) {
	return {
		type:"line",
		dot1:line.dot1.tempId,
		dot2:line.dot2.tempId,
		thickness:line.getAttribute("stroke-width"),
		color:line.color,
		opacity:line.getOpacity()
	}
}

function exportFace(face) {
	var dotIds = [];
	for(var ii=0;ii<face.dots.length;ii++) {
		dotIds.push(face.dots[ii].tempId);
	}
	return {
		type:"face",
		dots:dotIds,
		color:face.color,
		opacity:face.getOpacity()
	}
}

function load() {
	var file = fileInput.files[0];
	var stereotype = /^.+\.stereosketch$/;
	if (file.name.match(stereotype)) {
		var reader = new FileReader();
		reader.onload = function(e) {
			var data = reader.result;
			var stereosketch = JSON.parse(data);
			loadSketch(stereosketch);
		}
		reader.readAsText(file);
  } else {
  	alert("That's not a stereosketch. :(")
  }
}

function loadSketch(sketch) {
	setMode(sketch.mode);
	setZoomLevel(sketch.zoomLevel);
	buffer = sketch.buffer;
	var loadedDots = sketch.dots;
	var dot;
	for(var ii=0;ii<loadedDots.length;ii++) {
		dot = loadedDots[ii];
		var newDot = shapeFactory.createDot(dot.cx,dot.cy);
		newDot.setShift(dot.shift);
		newDot.lowlight();
	}
	var dots = getDots();
	var shapes = sketch.shapes;
	var shape;
	for(var ii=0;ii<shapes.length;ii++) {
		shape = shapes[ii];
		if(shape.type == "line") {
			var newLine = shapeFactory.createLine(dots[(dots.length-loadedDots.length)+shape.dot1],dots[(dots.length-loadedDots.length)+shape.dot2]);
			newLine.setThickness(shape.thickness);
			newLine.setColor(shape.color);
			newLine.setOpacity(shape.opacity);
		} else if (shape.type == "face") {
			var faceDots = [];
			for(var jj=0;jj<shape.dots.length;jj++) {
				faceDots.push(dots[(dots.length-loadedDots.length)+shape.dots[jj]]);
			}
			var newFace = shapeFactory.createFace(faceDots);
			newFace.setColor(shape.color);
			newFace.setOpacity(shape.opacity);
		}
	}
	picker.color.fromString(sketch.background);
	setBackground();
}

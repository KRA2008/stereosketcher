'use strict';

function warning() {
	alert("Loading StereoSketcher projects from other folks can harm your computer! Be careful!")
}

function save() {
	showLoading();
	var stereosketch = collectDrawing();
	var blob = new Blob([JSON.stringify(stereosketch)], {type: "stereosketch;charset=utf-8"});
	var date = new Date();
	var formattedDate = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+"-"+date.getHours()+"-"+date.getMinutes()+"-"+date.getSeconds();
	saveAs(blob, formattedDate+".stereosketch");
	hideLoading();
}

function collectDrawing() {
	var stereosketch = {
		version:version,
		dots:[],
		shapes: [],
		background: getBackgroundColor(),
		buffer: buffer,
		mode: mode,
		zoomLevel: zoomLevel,
		frames: frames,
		frameTime: frameTime,
		shiftSpeed: shiftSpeed,
		numberOfPreviewLoops: numberOfPreviewLoops,
		axisVisible: axisVisible
	}
	var dot;
	var dots = getDots();
	for(var ii=0;ii<dots.length;ii++) {
		dot = dots[ii];
		dot.tempId = ii;
		stereosketch.dots.push(exportDot(dot));
	}
	var shapes = getShapes();
	var shape;
	for(var ii=0;ii<shapes.length;ii++) {
		shape = shapes[ii];
		if(doesElementHaveClass(shape,"line")) {
			stereosketch.shapes.push(exportLine(shape));
		} else if(doesElementHaveClass(shape,"face")) {
			stereosketch.shapes.push(exportFace(shape));
		} else if(doesElementHaveClass(shape,"image")) {
			stereosketch.shapes.push(exportImageOrBase(shape));
		} else if(doesElementHaveClass(shape,"base")) {
			stereosketch.shapes.push(exportImageOrBase(shape));
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

function exportImageOrBase(image) {
	var dotIds = [];
	for(var ii=0;ii<image.dots.length;ii++) {
		dotIds.push(image.dots[ii].tempId);
	}
	var type = doesElementHaveClass(image,"base") ? "base" : "image";
	return {
		type:type,
		dots:dotIds,
		href:image.getAttribute('xlink:href'),
		opacity:image.getOpacity()
	}
}

function load() {
	showLoading();
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
	if(sketch.mode) {
		setMode(sketch.mode);
	}
	if(sketch.zoomLevel) {
		if(sketch.zoomLevel < 0) {
			for(;zoomLevel > sketch.zoomLevel;) {
				zoomOut(0,0);
			}
		} else if(sketch.zoomLevel > 0) {
			for(;zoomLevel < sketch.zoomLevel;) {
				zoomIn(0,0);
			}
		}
	}
	if(sketch.buffer) {
		buffer = sketch.buffer;
	}
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
			shape.loaded = newLine;
		} else if (shape.type == "face") {
			var faceDots = [];
			for(var jj=0;jj<shape.dots.length;jj++) {
				faceDots.push(dots[(dots.length-loadedDots.length)+shape.dots[jj]]);
			}
			var newFace = shapeFactory.createFace(faceDots);
			newFace.setColor(shape.color);
			newFace.setOpacity(shape.opacity);
			shape.loaded = newFace;
		} else if (shape.type == "image" || shape.type == "base") {
			loadImage(shape,dots,loadedDots);
		}
	}
	if(sketch.background) {
		picker.color.fromString(sketch.background);
		setBackground();
		picker.color.fromString("#000000");
	}
	if(imagesWaitingToFinish===0) {
		finishLoadingSketch(sketch);
	} else {
		var interval = setInterval(function() {
			if(imagesWaitingToFinish===0) {
				finishLoadingSketch(sketch);
				clearInterval(interval);
			}
		},50);
	}
	if(sketch.frames) {
		frames = sketch.frames;
	}
	if(sketch.frameTime) {
		frameTime = sketch.frameTime;
	}
	if(sketch.shiftSpeed) {
		shiftSpeed = sketch.shiftSpeed;
	}
	if(sketch.axisVisible) {
		axisVisible = sketch.axisVisible;
	}
	if(sketch.numberOfPreviewLoops) {
		numberOfPreviewLoops = sketch.numberOfPreviewLoops;
	}
}

function finishLoadingSketch(sketch) {
	restackLoads(sketch);
	hideLoading();
}

function restackLoads(sketch) {
	var shapes = sketch.shapes;
	var newShape;
	for(var ii=0;ii<shapes.length;ii++) {
		newShape = shapes[ii].loaded;
		newShape.remove();
		newShape.add();
	}
}

function loadImage(image,sketchDots,loadedDots) {
	imagesWaitingToFinish++;
	var imageDots = [];
	for(var jj=0;jj<image.dots.length;jj++) {
		imageDots.push(sketchDots[(sketchDots.length-loadedDots.length)+image.dots[jj]]);
	}
	var imageObject = new Image();
	imageObject.onload = function(evt) {
		var newImage = shapeFactory.createImage(imageDots,this,imageDots.length == 2);
		newImage.setOpacity(image.opacity);
		imagesWaitingToFinish--;
		image.loaded = newImage;
	}
	imageObject.src = image.href;
}

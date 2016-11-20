'use strict';

var opacityStep=0.05;

function sampleColor() {
	var selectedItem = null;
	var items = getLinesAndFaces();
	var item;
	for(var ii=0;ii<items.length;ii++) {
		item = items[ii];
		if(item.isSelected()) {
			if(selectedItem) {
				return;
			} else {
				selectedItem = item;
			}
		}
	}
	if(selectedItem == null) {
		return;
	}
	picker.color.fromString(selectedItem.color);
}

function setColor() {			
	var color = picker.value;
	var faces = getFaces();
	var face;
	for(var ii = 0;ii<faces.length;ii++) {
		face = faces[ii];
		if(face.isSelected()) {
			face.setColor(color);
		}
	}
	var lines = getLines();
	var line;
	for(var ii=0;ii<lines.length;ii++) {
		line = lines[ii];
		if(line.isSelected()) {
			line.setColor(color);
		}
	}
}

function setBackground() {
	svg.setAttribute("style","background: "+picker.value);
}

function sampleBackground() {
	picker.color.fromString(getBackgroundColor());
}

function getBackgroundColor() {
	var style=svg.getAttribute("style");
	return style.substr(style.indexOf("#"));
}

function hideColorPicker() {
	picker.color.hidePicker();
	picker.blur();
}

function showColorPicker() {
	picker.color.showPicker();
}

function opace() {
	changeOpacity(true);
}

function transluce() {
	changeOpacity(false);
}

function changeOpacity(increase) {
	if(mode!==3) {
		var shape;
		var opacity;
		var shapes = getShapes();
		for(var ii=0;ii<shapes.length;ii++) {
			shape = shapes[ii];
			if(shape.isSelected()) {
				opacity = shape.getOpacity();
				opacity = Math.round((1/opacityStep)*opacity)*opacityStep;
				if(increase) {
					if(opacity<1.0)
					{
						opacity+=opacityStep;
					}
				} else {
					if(opacity>0+opacityStep)
					{
						opacity-=opacityStep;
					}
				}
				shape.storedOpacity = opacity;
				shape.setOpacity(opacity);
			}
		}
	}
}

function restoreAllOpacity() {
	var shape;
	var shapes = getShapes();
	for(var ii=0;ii<shapes.length;ii++) {
		shape = shapes[ii];
		shape.setOpacity(shape.storedOpacity);
	}
}

function stowAllOpacity() {
	var shapes = getShapes();
	for(var ii=0;ii<shapes.length;ii++) {
		shapes[ii].setOpacity(1.0);
	}
}

function stowImages() {
	var image;
	var images = getImages();
	for(var ii=0;ii<images.length;ii++) {
		image = images[ii];
		image.setAttribute("visibility","hidden");
		image.clone.setAttribute("visibility","hidden");
	}
	var base;
	var bases = getBases();
	for(var ii=0;ii<bases.length;ii++) {
		base = bases[ii];
		base.setAttribute("visibility","hidden");
		base.clone.setAttribute("visibility","hidden");
	}
}

function restoreImages() {
	var image;
	var images = getImages();
	for(var ii=0;ii<images.length;ii++) {
		image = images[ii];
		image.setAttribute("visibility","visible");
		image.clone.setAttribute("visibility","visible");
	}
	var base;
	var bases = getBases();
	for(var ii=0;ii<bases.length;ii++) {
		base = bases[ii];
		base.setAttribute("visibility","visible");
		base.clone.setAttribute("visibility","visible");
	}
}

function dragHover(e) {
	e.stopPropagation();
	e.preventDefault();
}

function imageButtonClick(e) {
	parseFile(imageButton.files[0],false);
}

function baseButtonClick(e) {
	parseFile(baseButton.files[0],true);
}

function imageDragHandler(e) {
	dragHandler(e,false);
}

function baseDragHandler(e) {
	dragHandler(e,true);
}

function dragHandler(e,asBase) {
	dragHover(e);

	if(mode == 3) {
		return;
	}
	
	var files = e.target.files || e.dataTransfer.files;

	for (var i = 0, f; f = files[i]; i++) {
		parseFile(f,asBase);
	}
}

function parseFile(file,asBase) {
	showLoading();
	var reader = new FileReader();
	reader.onloadend = function(evt) {
		var image = new Image();
		image.onload = function(evt) {
			createImage(this,asBase);
		};
		image.src = evt.target.result;
	}
	reader.readAsDataURL(file);
}

function createImage(image,asBase) {
	var requisiteDots = asBase ? 2 : 4;
	var dots = getDots();
	var dot;
	var selectedDots = [];
	for(var ii=0;ii<dots.length;ii++) {
		dot = dots[ii];
		if(dot.isSelected()) {
			selectedDots.push(dot);
		}
	}
	if(selectedDots.length != requisiteDots) {
		alert("Select "+requisiteDots+" dots first.");
	} else {
		shapeFactory.createImage(selectedDots,image,asBase);
	}
	hideLoading();
}
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
	document.getElementById('colorPicker').color.fromString(selectedItem.color);
}

function setColor() {			
	var color = document.getElementById('colorPicker').value;
	var faces = getFaces();
	var face;
	for(var ii = 0;ii<faces.length;ii++) {
		face = faces[ii];
		if(face.isSelected()) {
			face.color=color;
			face.setAttribute("fill",color);
			face.clone.setAttribute("fill",color);
			face.under.setAttribute("fill",color);
			face.clone.under.setAttribute("fill",color);
			face.under.setAttribute("stroke",color);
			face.clone.under.setAttribute("stroke",color);
		}
	}
	var lines = getLines();
	var line;
	for(var ii=0;ii<lines.length;ii++) {
		line = lines[ii];
		if(line.isSelected()) {
			line.color=color;
			line.setAttribute("stroke",color);
			line.clone.setAttribute("stroke",color);
		}
	}
}

function setBackground() {
	var color = document.getElementById('colorPicker').value;
	svg.setAttribute("style","background: "+color);
}

function sampleBackground() {
	document.getElementById('colorPicker').color.fromString(getBackgroundColor());
}

function getBackgroundColor() {
	var style=svg.getAttribute("style");
	return style.substr(style.indexOf("#"));
}

function hideColorPicker() {
	var picker = document.getElementById('colorPicker');
	picker.color.hidePicker();
	picker.blur();
}

function showColorPicker() {
	var picker = document.getElementById('colorPicker');
	picker.color.showPicker();
}

function changeOpacity(increase) {
	var shape;
	var opacity;
	var shapes = getLinesAndFaces();
	for(var ii=0;ii<shapes.length;ii++) {
		shape = shapes[ii];
		if(shape.isSelected()) {
			if(doesElementHaveClass(shape,"line")) {
				opacity = parseFloat(shape.getAttribute("stroke-opacity"));
			} else if (doesElementHaveClass(shape,"face")) {
				opacity = parseFloat(shape.getAttribute("fill-opacity"));
			}
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
			if(doesElementHaveClass(shape,"line")) {
				shape.setAttribute("stroke-opacity",opacity);
				shape.clone.setAttribute("stroke-opacity",opacity);
			} else if (doesElementHaveClass(shape,"face")) {
				shape.setAttribute("fill-opacity",opacity);
				shape.under.setAttribute("fill-opacity",opacity);
				shape.clone.setAttribute("fill-opacity",opacity);
				shape.clone.under.setAttribute("fill-opacity",opacity);
				
				opacity = 1.2*opacity*opacity-0.2*opacity;
				shape.under.setAttribute("stroke-opacity",opacity);
				shape.clone.under.setAttribute("stroke-opacity",opacity);
			}
		}
	}
}

function setOpaque() {
	var shape;
	var shapes = getLinesAndFaces();
	for(var ii=0;ii<shapes.length;ii++) {
		shape = shapes[ii];
		shape.setAttribute("opacity",1.0);
	}
}

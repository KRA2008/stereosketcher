'use strict';

var svg,dotGroup,labelGroup,shapeGroup,defs,picker,zoomLabel;
var isEditMode=true;
var mode=1;
var pressX, pressY;
var prevX, prevY;
var loading=false;

window.onload=function() {
	svg=document.getElementById("svg");
	dotGroup=document.getElementById("dots");
	labelGroup=document.getElementById("labels");
	shapeGroup=document.getElementById("shapes");
	defs=document.getElementById("defs");
	picker = document.getElementById('colorPicker');
	zoomLabel = document.getElementById('zoomLabel');
	
	svg.onmousedown = function(event) {
		pressX = event.clientX;
		pressY = event.clientY;
		prevX = pressX;
		prevY = pressY;
		if(event.button==0) {
			editMode();
			svg.onmousemove = function(event) {
				preventDefault(event);
				changeSelectangle(event);
			};
		}
		if(event.button==2) {
			editMode();
			var dots = getDots();
			svg.onmousemove = function(event) {
				preventDefault(event);
				snapDots(dots,event);
			};
		}
	};
	svg.onmouseup = function(event) {
		if(wasAClick(event)) {
			if(event.button==0) {
				shapeFactory.createCircle(event);
			}
			if(event.button==2) {
				deselectAll();
			}
		} else if(event.button==0) {
			releaseSelectangle(event);
		}
		svg.onmousemove = null;
	};
	svg.addEventListener("mousewheel",zoom,false);
	svg.addEventListener("DOMMouseScroll",zoom,false);
	crossEyeMode();
	picker.color.fromString("#000000");
	zoomLabel.innerHTML = zoomLevel;
	hideLoading();
};

window.onbeforeunload = function(e) {
	e.preventDefault();
}

function wasAClick(event) {
	return event.clientX == pressX && event.clientY == pressY;
}

function hideLoading() {
	loading = false;
	var loadingDiv = document.getElementById("loading");
	loadingDiv.style.display = "none";
	loadingDiv.clientHeight;
}

function showLoading() {
	loading = true;
	var loadingDiv = document.getElementById("loading");
	loadingDiv.style.display = "";
	loadingDiv.clientHeight;
}

document.addEventListener("keydown", keyDown, false);

function keyDown(e) {
	var keyCode = e.keyCode;
	switch (keyCode) {
		case 46: //delete
			deletePressed();
			break;
		case 68: //d
			createLinePressed();
			break;
		case 32: //spacebar
			toggleEditView();
			return false;
		case 83: //s
			shiftIn();
			break;
		case 65: //a
			shiftOut();
			break;
		case 70: //f
			createFacePressed();
			break;
		case 81: //q
			moveSelectedToBack();
			break;
		case 82: //r
			moveSelectedToFront();
			break;
		case 69: //e
			moveSelectedOneLayer(true);
			break;
		case 87: //w
			moveSelectedOneLayer(false);
			break;
		case 84: //t
			changeIPD(false);
			break;
		case 89: //y
			changeIPD(true);
			break;
		case 88: //x
			thickenLines();
			break;
		case 90: //z
			thinLines();
			break;
		case 49: //1
			crossEyeMode();
			break;
		case 50: //2
			magicEyeMode();
			break;
		case 51: //3
			redCyanMode();
			break;
		case 67: //c
			changeOpacity(false);
			break;
		case 86: //v
			changeOpacity(true);
			break;
	}
}

function changeIPD(right) {
	if(mode!=3) {
		if(right) {
			IPD++;
		} else {
			IPD--;
		}
		snapDots(getDots());
	}
}

function getDots() {
	return dotGroup.getElementsByClassName("dot");
}

function getLines() {
	return shapeGroup.getElementsByClassName("line");
}

function getLinesAndFaces() {
	var item;
	var items = shapeGroup.children;
	var linesAndFaces = [];
	for(var ii=0;ii<items.length;ii++) {
		item = items[ii];
		if(doesElementHaveClass(item,"line")||doesElementHaveClass(item,"face")) {
			linesAndFaces.push(item);
		}
	}
	return linesAndFaces;
}

function getFaces() {
	return shapeGroup.getElementsByClassName("face");
}

function getSelected() {
	return svg.getElementsByClassName("selected");
}

function getLabels() {
	return labelGroup.getElementsByClassName("label");
}

function createLinePressed() {
	var selectedDots=0;
	var dot1;
	var dot2;
	var dots = getDots();
	for(var io=0;io<dots.length;io++) {
		if(dots[io].isSelected())
		{
			selectedDots++;
			if(dot1==null)
			{
				dot1=dots[io];
				continue;
			}
			if(dot2==null)
			{
				dot2=dots[io];
				continue;
			}
			if(selectedDots==3)
			{
				return;
			}
		}
	}
	if(selectedDots!=2) {
		return;
	}
	var lines = getLines();
	var line;
	for(var ii=0;ii<lines.length;ii++) {
		line = lines[ii];
		if((line.dot1 == dot1 || line.dot2 == dot1) && (line.dot1 == dot2 || line.dot2 == dot2)) {
			return;
		}
	}
	shapeFactory.createLine(dot1,dot2);
}

function createFacePressed() {
	var selectedDots=0;
	var dot1;
	var dot2;
	var dot3;
	var dots = getDots();
	for(var io=0;io<dots.length;io++) {
		if(dots[io].isSelected()) {
			selectedDots++;
			if(dot1==null)
			{
				dot1=dots[io];
				continue;
			}
			if(dot2==null)
			{
				dot2=dots[io];
				continue;
			}
			if(dot3==null)
			{
				dot3=dots[io];
				continue;
			}
			if(selectedDots==4)
			{
				return;
			}
		}
	}
	if(selectedDots!=3) {
		return;
	}
	var faces = getFaces();
	var face;
	for(var ii=0;ii<faces.length;ii++) {
		face = faces[ii];
		if((dot1 == face.dot1 || dot1 == face.dot2 || dot1 == face.dot3) && 
		(dot2 == face.dot1 || dot2 == face.dot2 || dot2 == face.dot3) && 
		(dot3 == face.dot1 || dot3 == face.dot2 || dot3 == face.dot3))
		{
			return;
		}
	}
	shapeFactory.createFace(dot1,dot2,dot3);
}

function deletePressed() {
	var dot;
	var dots = getDots();
	for(var ii=dots.length-1;ii>=0;ii--) {
		dot=dots[ii];
		if(dot.isSelected()) {
			labelGroup.removeChild(dot.label);
			dotGroup.removeChild(dot);
		}
	}
	var line;
	var lines=getLines();
	for(var ii=lines.length-1;ii>=0;ii--) {
		line=lines[ii];
		if(line.isSelected() || line.dot1.isSelected() || line.dot2.isSelected()) {
			line.delete();
		}
	}
	var face;
	var faces = getFaces();
	for (var ii=faces.length-1;ii>=0;ii--) {
		face=faces[ii];
		if(face.isSelected() || face.dot1.isSelected() || face.dot2.isSelected() || face.dot3.isSelected()) {
			face.delete();
		}
	}
}

function preventDefault(event) {
	event.preventDefault ? event.preventDefault() : event.returnValue=false;
}
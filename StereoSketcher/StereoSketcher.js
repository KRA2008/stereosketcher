'use strict';

var svg,dotGroup,labelGroup,shapeGroup,defs,picker,zoomLabel,body,toolGroup,fileInput,fileDragger;
var isEditMode=true;
var mode=1;
var pressX, pressY;
var prevX, prevY;
var loading=false;
var middleMouseButtonLock=false;

window.onload=function() {
	svg = document.getElementById("svg");
	dotGroup = document.getElementById("dots");
	labelGroup = document.getElementById("labels");
	shapeGroup = document.getElementById("shapes");
	defs = document.getElementById("defs");
	picker = document.getElementById('colorPicker');
	zoomLabel = document.getElementById('zoomLabel');
	toolGroup = document.getElementById('toolGroup');
	fileInput = document.getElementById('fileInput');
	fileDragger = document.getElementById('fileDrag');
	
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
		if(event.button==1) {
			if(!middleMouseButtonLock) {
				var withExtrude = !!event.ctrlKey;
				copyAndPasteSelectedShapes(event.clientX,event.clientY,withExtrude);
				middleMouseButtonLock = true;
				setTimeout(function() {
					middleMouseButtonLock = false;
				},200);
			}
		}
		if(event.button==2) {
			editMode();
			var dots = getDots();
			svg.onmousemove = function(event) {
			    preventDefault(event);
			    if (!event.ctrlKey) {
			        snapDots(dots, false, event, 0);
			    }
			};
		}
	};
	svg.onmouseup = function(event) {
		if(wasAClick(event)) {
			if(event.button==0) {
				if(!event.shiftKey)
				{
					deselectAll();
				}
			}
			if(event.button==2) {
				var dot=shapeFactory.createDot(event.clientX,event.clientY);
				if(event.shiftKey) {
					dot.select();
					if (event.ctrlKey) {
						var previousDot = dot;
						createLinePressed(event);
						previousDot.select();
					}
				}
			}
		} else if(event.button==0) {
			releaseSelectangle(event);
		}
		stopDots();
	};
	svg.addEventListener("mousewheel",zoom,false);
	svg.addEventListener("DOMMouseScroll",zoom,false);
	fileDragger.addEventListener("change", fileDragHandler, false);
	fileDragger.addEventListener("drop", fileDragHandler, false);
	fileDragger.addEventListener("dragleave", fileDragHover, false);
	fileDragger.addEventListener("dragover", fileDragHover, false);
	crossEyeMode();
	picker.color.fromString("#000000");
	zoomLabel.innerHTML = zoomLevel;
	buildToolBar();
	fileInput.addEventListener('change', function() {
		load();
    });
	hideLoading();
	setTimeout(function() {
		window.onbeforeunload = function(e) {
			preventDefault(e);
		}
	},5000);
};


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

document.addEventListener("keydown", mapKeyPress, false);
document.addEventListener("keyup", keyReleased, false);
document.onclick = function(e) { if(e.button == 2 || e.button == 3) { e.preventDefault(); e.stopPropagation(); return(false); } };

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

function preventDefault(event) {
	event.preventDefault ? event.preventDefault() : event.returnValue=false;
}
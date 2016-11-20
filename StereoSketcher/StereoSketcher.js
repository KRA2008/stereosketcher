'use strict';

var svg,dotGroup,labelGroup,shapeGroup,defs,picker,
zoomLabel,body,toolGroup,fileInput,imageDragger,baseDragger,
imageButton,baseButton,gifFrames,loadingDiv,blocker,configurationPopup;
var isEditMode=true;
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
	imageDragger = document.getElementById('imageDrag');
	baseDragger = document.getElementById('baseDrag');
	imageButton = document.getElementById('imageButton');
	baseButton = document.getElementById('baseButton');
	gifFrames = document.getElementById('gifFrames');
	blocker = document.getElementById("blocker");
	loadingDiv = document.getElementById("loading");
	configurationPopup = document.getElementById("configurationPopup");
	framesInput = document.getElementById("framesInput");
	frameTimeInput = document.getElementById("frameTimeInput");
	shiftSpeedInput = document.getElementById("shiftSpeedInput");
	axisVisibleInput = document.getElementById("axisVisibleInput");
	
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
	
	imageDragger.addEventListener("change", imageDragHandler, false);
	imageDragger.addEventListener("drop", imageDragHandler, false);
	imageDragger.addEventListener("dragleave", dragHover, false);
	imageDragger.addEventListener("dragover", dragHover, false);
	imageDragger.addEventListener("mouseenter",imageHover,false);
	imageDragger.addEventListener("mouseleave",imageLeave,false);
	imageButton.addEventListener('change',imageButtonClick, false);
	
	baseDragger.addEventListener("change", baseDragHandler, false);
	baseDragger.addEventListener("drop", baseDragHandler, false);
	baseDragger.addEventListener("dragleave", dragHover, false);
	baseDragger.addEventListener("dragover", dragHover, false);
	baseDragger.addEventListener("mouseenter",imageHover,false);
	baseDragger.addEventListener("mouseleave",imageLeave,false);
	baseButton.addEventListener('change',baseButtonClick,false);
	
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
	blocker.style.display = "none";
	loadingDiv.style.display = "none";
}

function showLoading(onlyMargin) {
	loading = true;
	blocker.style.display = "";
	if(!onlyMargin) {
		loadingDiv.style.display = "";
	}
}

document.addEventListener(
	"keydown",
	function(event)
	{
		if(configurationPopup.style.display == "none")
		{
			mapKeyPress(event);
		}
	},
	false
);
document.addEventListener("keyup", keyReleased, false);
document.onclick = function(e) { if(e.button == 2 || e.button == 3) { e.preventDefault(); e.stopPropagation(); return(false); } };

function getDots() {
	return dotGroup.getElementsByClassName("dot");
}

function getLines() {
	return shapeGroup.getElementsByClassName("line");
}

function getImages() {
	return shapeGroup.getElementsByClassName("image");
}

function getBases() {
	return shapeGroup.getElementsByClassName("base");
}

function getShapes() {
	var item;
	var items = shapeGroup.children;
	var shapes = [];
	for(var ii=0;ii<items.length;ii++) {
		item = items[ii];
		if(doesElementHaveClass(item,"line")||doesElementHaveClass(item,"face")||doesElementHaveClass(item,"image")||doesElementHaveClass(item,"base")) {
			shapes.push(item);
		}
	}
	return shapes;
}

function getLinesAndFaces() {
	var item;
	var items = shapeGroup.children;
	var shapes = [];
	for(var ii=0;ii<items.length;ii++) {
		item = items[ii];
		if(doesElementHaveClass(item,"line")||doesElementHaveClass(item,"face")) {
			shapes.push(item);
		}
	}
	return shapes;
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
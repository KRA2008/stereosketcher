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
    if(isDeviceMobile()) {
        alert("Sorry, StereoSketcher doesn't work on mobile because there's just too much you can do for it to work with just tapping. Please head to a desktop or plug in a mouse and keyboard if you can!");
    }
    
    document.addEventListener("contextmenu", function(e){
        e.preventDefault();
    }, false);

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
				if(event.shiftKey | event.altKey) {
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

function isDeviceMobile() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}
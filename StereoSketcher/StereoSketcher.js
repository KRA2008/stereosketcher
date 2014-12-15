'use strict';

var svg,dotGroup,labelGroup,shapeGroup,defs;
var dotsVisible=true;
var mode=0;
var pressX, pressY;
var prevX, prevY;

window.onload=function() {
	svg=document.getElementById("svg");
	dotGroup=document.getElementById("dots");
	labelGroup=document.getElementById("labels");
	shapeGroup=document.getElementById("shapes");
	defs=document.getElementById("defs");
	
	svg.onmousedown = function(event)
	{
		pressX = event.clientX;
		pressY = event.clientY;
		prevX = pressX;
		prevY = pressY;
		if(event.button==0)
		{
			svg.onmousemove = function(event) {
				preventDefault(event);
				changeSelectangle(event);
			};
		}
		if(event.button==2)
		{
			var dots = getDots();
			svg.onmousemove = function(event) {
				preventDefault(event);
				dragDots(event,dots);
			};
		}
	};
	svg.onmouseup = function(event)
	{
		if(wasAClick(event))
		{
			if(event.button==0)
			{
				shapeFactory.createCircle(event);
			}
			if(event.button==2)
			{
				deselectAll();
			}
		}
		else if(event.button==0)
		{
			if(selectangle!=null)
			{
				var maxx=parseFloat(selectangle.getAttribute("width"))+parseFloat(selectangle.getAttribute("x"));
				var minx=parseFloat(selectangle.getAttribute("x"));
				var maxy=parseFloat(selectangle.getAttribute("height"))+parseFloat(selectangle.getAttribute("y"));
				var miny=parseFloat(selectangle.getAttribute("y"));
				var dots = getDots();
				if(!event.shiftKey)
				{
					deselectAll();
				}
				for(var ik=0;ik<dots.length;ik++)
				{
					var dot=dots[ik];
					var dotx=parseFloat(dot.getAttribute("cx"));
					var doty=parseFloat(dot.getAttribute("cy"));
					if(dotx<maxx && dotx>minx)
					{
						if(doty<maxy && doty>miny)
						{
							dot.select();
						}
					}
				}
				svg.removeChild(selectangle);
				selectangle = null;
			}
		}
		svg.onmousemove = null;
	};
	svg.addEventListener("mousewheel",zoom,false);
	svg.addEventListener("DOMMouseScroll",zoom,false);
	crossEyeMode();
	hideLoading();
};

function wasAClick(event)
{
	return event.clientX == pressX && event.clientY == pressY;
}

function hideLoading()
{
	var loading = document.getElementById("loading");
	loading.style.display = "none";
	loading.clientHeight;
}

function showLoading()
{
	var loading = document.getElementById("loading");
	loading.style.display = "";
	loading.clientHeight;
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
			toggleDotsVisible();
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
			moveSelectedThroughLayers(true);
			break;
		case 87: //w
			moveSelectedThroughLayers(false);
			break;
		case 67: //c
			changeIPD("left");
			break;
		case 86: //v
			changeIPD("right");
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
	}
}

function thickenLines()
{
	var lines = getLines();
	var line;
	for(var ii=0;ii<lines.length;ii++)
	{
		line = lines[ii];
		if(line.isSelected())
		{
			line.thicken();
		}
	}
	deselectAll();
}

function thinLines()
{
	var lines = getLines();
	var line;
	for(var ii=0;ii<lines.length;ii++)
	{
		line = lines[ii];
		if(line.isSelected())
		{
			line.thin();
		}
	}
	deselectAll();
}

function magicEyeMode()
{
	showDots();
	mode=1;
	var label=document.getElementById("modeLabel");
	label.innerHTML = "parallel";
	IPD=originalIPD*-1.0;
	refresh();
}

function redCyanMode()
{
	showDots();
	mode=2;
	var label=document.getElementById("modeLabel");
	label.innerHTML = "red/cyan";
	IPD=0.0;
	refresh();
}

function crossEyeMode()
{
	showDots();
	mode=0;
	var label=document.getElementById("modeLabel");
	label.innerHTML = "cross";
	IPD=originalIPD;
	refresh();
}

function changeIPD(direction)
{
	if(direction=="right") 
	{
		IPD++;
	}
	else
	{
		IPD--;
	}
	refresh();
}

function toggleDotsVisible()
{
	if(dotsVisible)
	{
		hideDots();
	} else {
		showDots();
	}
}

function showDots()
{
	var label = document.getElementById("modeLabel");
	label.setAttribute("visibility","visible");
	var dots = getDots();
	var dot;
	for(var ii=0;ii<dots.length;ii++)
	{
		dot = dots[ii];
		dot.setAttribute("visibility","visible");
		dot.label.setAttribute("visibility","visible");
	}
	dotsVisible = true;
	if(mode ==2)
	{
		removeOverlaps();
	}
}

function hideDots()
{
	var label = document.getElementById("modeLabel");
	label.setAttribute("visibility","hidden");
	var dots = getDots();
	var dot;
	for(var ii=0;ii<dots.length;ii++)
	{
		dot = dots[ii];
		dot.setAttribute("visibility","hidden");
		dot.label.setAttribute("visibility","hidden");
	}
	dotsVisible = false;
	correctOverlaps();
}

function getDots()
{
	return dotGroup.getElementsByClassName("dot");
}

function getLines()
{
	return shapeGroup.getElementsByClassName("line");
}

function getLinesAndFaces()
{
	var item;
	var items = shapeGroup.children;
	var linesAndFaces = [];
	for(var ii=0;ii<items.length;ii++)
	{
		item = items[ii];
		if(doesElementHaveClass(item,"line")||doesElementHaveClass(item,"face"))
		{
			linesAndFaces.push(item);
		}
	}
	return linesAndFaces;
}

function getFaces()
{
	return shapeGroup.getElementsByClassName("face");
}

function getSelected()
{
	return svg.getElementsByClassName("selected");
}

function getLabels()
{
	return labelGroup.getElementsByClassName("label");
}

function createLinePressed()
{
	var selectedDots=0;
	var dot1;
	var dot2;
	var dots = getDots();
	for(var io=0;io<dots.length;io++)
	{
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
	if(selectedDots!=2)
	{
		return;
	}
	var lines = getLines();
	var line;
	for(var ii=0;ii<lines.length;ii++)
	{
		line = lines[ii];
		if((line.dot1 == dot1 || line.dot2 == dot1) && (line.dot1 == dot2 || line.dot2 == dot2))
		{
			return;
		}
	}
	shapeFactory.createLine(dot1,dot2);
}

function createFacePressed()
{
	var selectedDots=0;
	var dot1;
	var dot2;
	var dot3;
	var dots = getDots();
	for(var io=0;io<dots.length;io++)
	{
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
	if(selectedDots!=3)
	{
		return;
	}
	var faces = getFaces();
	var face;
	for(var ii=0;ii<faces.length;ii++)
	{
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

function deletePressed()
{
	var dot;
	var dots = getDots();
	for(var ii=dots.length-1;ii>=0;ii--)
	{
		dot=dots[ii];
		if(dot.isSelected())
		{
			labelGroup.removeChild(dot.label);
			dotGroup.removeChild(dot);
		}
	}
	var line;
	var lines=getLines();
	for(var ii=lines.length-1;ii>=0;ii--)
	{
		line=lines[ii];
		if(line.isSelected() || line.dot1.isSelected() || line.dot2.isSelected())
		{
			line.remove();
		}
	}
	var face;
	var faces = getFaces();
	for (var ii=faces.length-1;ii>=0;ii--)
	{
		face=faces[ii];
		if(face.isSelected() || face.dot1.isSelected() || face.dot2.isSelected() || face.dot3.isSelected())
		{
			face.remove();
		}
	}
}

function preventDefault(event)
{
	event.preventDefault ? event.preventDefault() : event.returnValue=false;
}
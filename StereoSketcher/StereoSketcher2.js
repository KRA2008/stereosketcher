var svg;
var mousePressed={};
var mouseReleased={};
var dragger={};
var dotsVisible=true;

//constants
var originalIPD=250;
var IPD=originalIPD;
var lineThickness = 2;
var dotRadius = 7;
var shiftDist = 1;
var labelX = -15;
var labelY = -8;
var mode=0;

window.onload=function() {
	svg=document.getElementById("svg");
	svg.onmousedown = function(event) 
	{
		mousePressed.is=true;
		mousePressed.x=event.clientX;
		mousePressed.y=event.clientY;
		mousePressed.shape=null;
		if(event.button==0)
		{
			preventDefault(event);
			svg.onmousemove = function(event) {
				changeSelectangle(event);
			};
		}
	};
	svg.onmouseup = function(event)
	{
		if(mousePressed.shape==null && mousePressed.x==event.clientX && mousePressed.y==event.clientY)
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
		if(event.button==0)
		{
			if(selectangle!=null)
			{
				var maxx=parseInt(selectangle.getAttribute("width"))+parseInt(selectangle.getAttribute("x"));
				var minx=parseInt(selectangle.getAttribute("x"));
				var maxy=parseInt(selectangle.getAttribute("height"))+parseInt(selectangle.getAttribute("y"));
				var miny=parseInt(selectangle.getAttribute("y"));
				var dots = getDots();
				if(!event.shiftKey)
				{
					deselectAll();
				}
				for(var ik=0;ik<dots.length;ik++)
				{
					var dot=dots[ik];
					var dotx=parseInt(dot.getAttribute("cx"));
					var doty=parseInt(dot.getAttribute("cy"));
					if(dotx<maxx && dotx>minx)
					{
						if(doty<maxy && doty>miny)
						{
							dot.select();
						}
					}
				}
				svg.removeChild(selectangle);
			}
			svg.onmousemove = null;
			selectangle = null;
		}
	};
	addPalette();
	addModeLabel();
};

document.addEventListener("keydown", keyDown, false);

function keyDown(e) {
		var keyCode = e.keyCode;
		switch (keyCode) {
			case 46: //delete
				deletePressed();
				break;
			case 65: //a
				createLinePressed();
				break;
			case 32: //spacebar
				toggleDotsVisible();
				break;
			case 83: //s
				shiftIn();
				break;
			case 68: //d
				shiftOut();
				break;
			case 70: //f
				createFacePressed();
				break;
			case 86: //v
				moveSelectedToBack();
				break;
			case 84: //t
				moveSelectedToFront();
				break;
			case 87: //w
				changeIPD("left");
				break;
			case 69: //e
				changeIPD("right");
				break;
			case 81: //q
				toggleViewMode();
				break;
		}
}

function deselectAll()
{
	var dot;
	var dots = getDots();
	for(var il=0;il<dots.length;il++)
	{
		dot=dots[il];
		dot.deselect();
	}
	var line;
	var lines=getLines();
	for(var nn=0;nn<lines.length;nn++)
	{
		line=lines[nn];
		line.deselect();
	}
	var face;
	var faces=getFaces();
	for(var ii=0;ii<faces.length;ii++)
	{
		face=faces[ii];
		face.deselect();
	}
}

function toggleViewMode()
{
	if(mode==0)
	{
		mode=1;
		var label=document.getElementById("modeLabel");
		label.textContent = "magic eye";
		IPD=originalIPD*-1;
		setFilters(false)
	} else if(mode==1) {
		mode=2;
		var label=document.getElementById("modeLabel");
		label.textContent = "red/cyan";
		setFilters(true);
	} else if(mode==2) {
		mode=0;
		var label=document.getElementById("modeLabel");
		label.textContent = "cross eye";
		IPD=originalIPD;
		setFilters(false);
	}
	var dots = getDots();
	var dot;
	for(var ii=0;ii<dots.length;ii++)
	{
		dot = dots[ii];
		applyShift(dot);
	}
}

function setFilters(on)
{
	var lines = getLines();
	var line;
	for(var ii=0;ii<lines.length;ii++)
	{
		line = lines[ii];
		if(on)
		{
			setRegularFilter(line);
			setCloneFilter(line.clone);
		}
		else
		{
			dropFilters(line);
			dropFilters(line.clone);
		}
	}
	var faces = getFaces();
	var face;
	for(var ii=0;ii<faces.length;ii++)
	{
		face = faces[ii];
		if(on)
		{
			setRegularFilter(face);
			setCloneFilter(face.clone);
		}
		else
		{
			dropFilters(face);
			dropFilters(face.clone);
		}
	}
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
	redrawAllDots();
}

function redrawAllDots()
{
	var dots = getDots();
	var dot;
	for(var ii=0;ii<dots.length;ii++)
	{
		dot = dots[ii];
		applyShift(dot);
	}
}

function toggleDotsVisible()
{
	var dots = getDots();
	var dot;
	if(dotsVisible)
	{
		for(var ii=0;ii<dots.length;ii++)
		{
			dot = dots[ii];
			dot.setAttribute("visibility","hidden");
			dot.label.setAttribute("visibility","hidden");
		}
		dotsVisible = false;
	} else {
		for(var ii=0;ii<dots.length;ii++)
		{
			dot = dots[ii];
			dot.setAttribute("visibility","visible");
			dot.label.setAttribute("visibility","visible");
		}
		dotsVisible = true;
	}
}

function getDots()
{
	return svg.getElementsByClassName("dot");
}

function getLines()
{
	return svg.getElementsByClassName("line");
}

function getFaces()
{
	return svg.getElementsByClassName("face");
}

function getSelected()
{
	return svg.getElementsByClassName("selected");
}

function getLabels()
{
	return svg.getElementsByClassName("label");
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
			removeShape(dot.label);
			removeShape(dot);
		}
	}
	var line;
	var lines=getLines();
	var dotLines = [];
	for(var ii=lines.length-1;ii>=0;ii--)
	{
		line=lines[ii];
		if(line.isSelected() || line.dot1.isSelected() || line.dot2.isSelected())
		{
			dotLines = line.dot1.lines;
			dotLines.splice(dotLines.indexOf(line),1);
			dotLines = line.dot2.lines;
			dotLines.splice(dotLines.indexOf(line),1);
			removeShape(line.clone);
			removeShape(line);
		}
	}
	var face;
	var faces = getFaces();
	var dotFaces = [];
	for (var ii=faces.length-1;ii>=0;ii--)
	{
		face=faces[ii];
		if(face.isSelected() || face.dot1.isSelected() || face.dot2.isSelected() || face.dot3.isSelected())
		{
			dotFaces = face.dot1.faces;
			dotFaces.splice(dotFaces.indexOf(face),1);
			dotFaces = face.dot2.faces;
			dotFaces.splice(dotFaces.indexOf(face),1);
			dotFaces = face.dot3.faces;
			dotFaces.splice(dotFaces.indexOf(face),1);
			removeShape(face.clone);
			removeShape(face);
		}
	}
}

function removeShape(shape)
{
	svg.removeChild(shape);
}

function preventDefault(event)
{
	event.preventDefault ? event.preventDefault() : event.returnValue=false;
}



function selectAllContiguous(sourceDot,event)
{
	var dots = getDots();
	var dot;
	if(!event.shiftKey) {
		deselectAll();
	} else {
		for(var ii=0;ii<dots.length;ii++)
		{
			dot = dots[ii];
			if(dot.isSelected())
			{
				dot.deselect();
				addClassToElement(dot,"tempSelect");
			}
		}
	}
	sourceDot.select();
	recursiveSelectDots(sourceDot);
	dots = getDots();
	for(var ii=0;ii<dots.length;ii++)
	{
		dot = dots[ii];
		if(doesElementHaveClass(dot,"tempSelect"))
		{
			dot.select();
			removeClassFromElement(dot,"tempSelect");
		}
	}
}

function selectDotsOfLine(line,event)
{
	if(!event.shiftKey) {
		deselectAll();
	}
	line.dot1.select();
	line.dot2.select();
}

function selectDotsOfFace(face,event)
{
	if(!event.shiftKey) {
		deselectAll();
	}
	face.dot1.select();
	face.dot2.select();
	face.dot3.select();
}

function recursiveSelectDots(dot)
{
	var lines = dot.lines;
	var line;
	for(var ii=0;ii<lines.length;ii++)
	{
		line = lines[ii];
		if(line.dot1.isSelected() && line.dot2.isSelected())
		{
			continue;
		}
		if(line.dot1 == dot)
		{
			line.dot2.select();
			recursiveSelectDots(line.dot2);
		} 
		else if (line.dot2 == dot)
		{
			line.dot1.select();
			recursiveSelectDots(line.dot1);
		}
	}
	var faces = dot.faces;
	var face;
	for(var ii=0;ii<faces.length;ii++)
	{
		face = faces[ii];
		if(face.dot1.isSelected() && face.dot2.isSelected() && face.dot3.isSelected())
		{
			continue;
		}
		if(face.dot1 == dot)
		{
			if(!face.dot2.isSelected())
			{
				face.dot2.select();
				recursiveSelectDots(face.dot2);
			}
			if(!face.dot3.isSelected())
			{
				face.dot3.select();
				recursiveSelectDots(face.dot3);
			}
		}
		if(face.dot2 == dot)
		{
			if(!face.dot1.isSelected())
			{
				face.dot1.select();
				recursiveSelectDots(face.dot1);
			}
			if(!face.dot3.isSelected())
			{
				face.dot3.select();
				recursiveSelectDots(face.dot3);
			}
		}
		if(face.dot3 == dot)
		{
			if(!face.dot2.isSelected())
			{
				face.dot2.select();
				recursiveSelectDots(face.dot2);
			}
			if(!face.dot1.isSelected())
			{
				face.dot1.select();
				recursiveSelectDots(face.dot1);
			}
		}
	}
}

function mousePressedOnShape(event,shape) 
{
	if(doesElementHaveClass(shape,"dot"))
	{
		event.stopPropagation();
	}
	mousePressed.is=true;
	mousePressed.x=event.clientX;
	mousePressed.y=event.clientY;
	mousePressed.shape=shape;
	if(doesElementHaveClass(shape,"dot"))
	{
		dragger.x=mousePressed.x;
		dragger.y=mousePressed.y;
		dragger.handle=shape;
		svg.onmousemove = function(event) 
		{
			if(mousePressed.is && mousePressed.shape.isSelected())
			{
				dragDots(event);
			}
		};
	}
}

function mouseReleasedOnShape(event,shape) 
{
	event.stopPropagation();
	var wasSelected = false;
	if(mousePressed.x==event.clientX && mousePressed.y==event.clientY)
	{
		if(event.shiftKey)
		{
			shape.toggleSelect();
		}
		else
		{
			if(shape.isSelected())
			{
				wasSelected=true;
			}
			deselectAll();
			if(wasSelected)
			{
				shape.deselect();
			} 
			else 
			{
				shape.select();
			}
		}
	}
	mousePressed.is=false;
	svg.onmousemove = null;
}

function deselectAllDots()
{
	var dots = getDots();
	for(var ii=0;ii<dots.length;ii++)
	{
		dots[ii].deselect();
	}
}

function moveSelectedToBack()
{
	deselectAllDots();
	moveSelectedToBackRecursive();
}

function moveSelectedToBackRecursive()
{
	var selected = getSelected();
	var element = selected[0];
	if(element == null) return;
	element.deselect();
	svg.removeChild(element);
	svg.insertBefore(element, svg.firstChild);
	svg.removeChild(element.clone);
	svg.insertBefore(element.clone, svg.firstChild);
	moveSelectedToBackRecursive();
}

function moveSelectedToFront()
{
	deselectAllDots();
	moveSelectedToFrontRecursive();
}

function moveSelectedToFrontRecursive()
{
	var dots = getDots();
	var selected = getSelected();
	var element = selected[0];
	if(element == null) return;
	element.deselect();
	svg.removeChild(element);
	svg.removeChild(element.clone);
	shapeFactory.addElement(element);
	shapeFactory.addElement(element.clone);
	moveSelectedToFrontRecursive();
}

function addModeLabel()
{
	var label = document.createElementNS("http://www.w3.org/2000/svg", "text");
	label.setAttribute("x",plainWidth);
	label.setAttribute("y",plainWidth*3);
	label.setAttribute("fill","black");
	label.textContent = "cross eye";
	label.setAttribute("id","modeLabel");
	svg.appendChild(label);
}

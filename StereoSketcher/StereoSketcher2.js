var svg;
var mousePressed={};
var mouseReleased={};
var dragger={};
var selectangle;
var dotsVisible=true;

//constants
var IPD=230;
var lineThickness = 2;
var dotRadius = 10;
var shiftDist = 2;
var labelX = 20;
var labelY = 10;

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



function selectAllContiguous(dot)
{
	deselectAll();
	dot.select();
	recursiveSelectDots(dot);
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
}



function changeSelectangle(event) {
	event.stopPropagation();
	if(selectangle!=null)
	{
		var x=parseInt(selectangle.getAttribute("x"));
		var y=parseInt(selectangle.getAttribute("y"));
		var width=parseInt(selectangle.getAttribute("width"));
		var height=parseInt(selectangle.getAttribute("height"));
		var ex=event.clientX;
		var ey=event.clientY;
		if(selectangle.originalX<ex)
		{
			selectangle.setAttribute("width",ex-x);
			selectangle.setAttribute("x",selectangle.originalX);
		}
		else
		{
			selectangle.setAttribute("width",selectangle.originalX-ex);
			selectangle.setAttribute("x",ex);
		}
		if(selectangle.originalY<ey)
		{
			selectangle.setAttribute("height",ey-y);
			selectangle.setAttribute("y",selectangle.originalY);
		}
		else
		{
			selectangle.setAttribute("height",selectangle.originalY-ey);
			selectangle.setAttribute("y",ey);
		}
	}
	else
	{
		createSelectangle(event);
	}
}

function createSelectangle(event)
{
	selectangle = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	selectangle.setAttribute("x",event.clientX);
	selectangle.setAttribute("y",event.clientY);
	selectangle.setAttribute("fill-opacity",0);
	selectangle.setAttribute("stroke","black");
	selectangle.setAttribute("stroke-width",2);
	selectangle.setAttribute("stroke-opacity",1);
	selectangle.setAttribute("height",0);
	selectangle.setAttribute("width",0);
	selectangle.originalX=event.clientX;
	selectangle.originalY=event.clientY;
	svg.appendChild(selectangle);
}

function mousePressedOnShape(event,shape) 
{
	event.stopPropagation();
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
	if(mousePressed.x==event.clientX && mousePressed.y==event.clientY)
	{
		shape.toggleSelect();
	}
	mousePressed.x=null;
	mousePressed.y=null;
	mousePressed.is=false;
	mousePressed.shape=null;
	svg.onmousemove = null;
}

function highlight(shape) 
{
	shape.setAttribute("stroke","green");
	if(doesElementHaveClass(shape,"face"))
	{
		shape.setAttribute("stroke-width",1);
	}
	addClassToElement(shape,"highlit");
}

function lowlight(shape) 
{
	if(doesElementHaveClass(shape,"dot"))
	{
		shape.setAttribute("stroke","black");
	}
	else if(doesElementHaveClass(shape,"line"))
	{
		if(shape.isSelected())
		{
			shape.setAttribute("stroke","yellow");
		} else {
			shape.setAttribute("stroke","black");
		}
	}
	else if(doesElementHaveClass(shape,"face"))
	{
		if(shape.isSelected())
		{
			shape.setAttribute("stroke","yellow");
		} else {
			shape.setAttribute("stroke-width",0);
		}
	}
	removeClassFromElement(shape,"highlit");
}
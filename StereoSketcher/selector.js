'use strict';

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

function deselectAllDots()
{
	var dot;
	var dots = getDots();
	for(var ii=0;ii<dots.length;ii++)
	{
		dot=dots[ii];
		dot.deselect();
	}
}

function deselectAll()
{
	deselectAllDots();
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
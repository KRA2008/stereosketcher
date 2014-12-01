'use strict';

var shiftSpeed = 0.5;
var originalIPD=250.0;
var IPD=originalIPD;

function shiftIn()
{
	var dots = getDots();
	var dot;
	for(var ii=0;ii<dots.length;ii++)
	{
		dot = dots[ii];
		if(dot.isSelected())
		{
			dot.shift++;
			dot.label.textContent = dot.shift;
		}
	}
	refresh();
}

function shiftOut()
{
	var dots = getDots();
	var dot;
	for(var ii=0;ii<dots.length;ii++)
	{
		dot = dots[ii];
		if(dot.isSelected())
		{
			dot.shift--;
			dot.label.textContent = dot.shift;
		}
	}
	refresh();
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
        shapeGroup.removeChild(element);
        shapeGroup.insertBefore(element,shapeGroup.firstChild);
        shapeGroup.removeChild(element.clone);
        shapeGroup.insertBefore(element.clone,shapeGroup.firstChild);
        if(element.under != null)
        {
                shapeGroup.removeChild(element.under);
                shapeGroup.removeChild(element.clone.under);
                shapeGroup.insertBefore(element.under,shapeGroup.firstChild);
                shapeGroup.insertBefore(element.clone.under,shapeGroup.firstChild);
        }
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
        if(element.under != null)
        {
                shapeGroup.removeChild(element.under);
                shapeGroup.removeChild(element.clone.under);
                shapeGroup.appendChild(element.under);
                shapeGroup.appendChild(element.clone.under);
        }
        shapeGroup.removeChild(element);
        shapeGroup.removeChild(element.clone);
        shapeGroup.appendChild(element);
        shapeGroup.appendChild(element.clone);
        moveSelectedToFrontRecursive();
}
var dotWidth = 10;
var selectedColor = "#ff0";
var highlightedColor = "#0f0";
var defaultColor = "#000";
var items = [];
var mousePressedOnNothing = true;
var mouseHeld = false;
var itemPressed;
var pressedLocationX;
var pressedLocationY;
var startSelectangleX;
var startSelectanglyY;
var selectangle;
var indicatorCircle;
var previousDragX = 0;
var previousDragY = 0;

function mouseDown(event)
{
	pressedLocationX = event.pageX;
	pressedLocationY = event.pageY;
	previousDragX = event.pageX;
	previousDragY = event.pageY;
	mousePressedOnNothing = true;
	mouseHeld = true;
	for(var ii=0; ii < items.length; ii++)
	{
		if(items[ii].highlighted)
		{
			mousePressedOnNothing = false;
			break;
		}
	}
	beginSelectangle(pressedLocationX,pressedLocationY);
}

function mouseUp(event)
{
	if (event.pageX == pressedLocationX
		&& event.pageY == pressedLocationY)
	{
		mouseClicked(pressedLocationX,pressedLocationY);
	}
	else
	{
		endSelectangle(event);
	}
	mousePressedOnNothing = true;
	mouseHeld = false;
}

function mouseClicked(clickX,clickY)
{
	for(var ii=0;ii<items.length;ii++)
	{
		if(items[ii].highlighted)
		{
			toggleSelect(items[ii]);
			return;
		}
	}
	snapClick(clickX,clickY);
}

function mouseMoved(event)
{
	if(mouseHeld && !mousePressedOnNothing)
	{
		dragThings(event);
	} else {
		
	}
}

function dragThings(event)
{
	var newX = event.pageX;
	var newY = event.pageY;
	var dx = previousDragX-newX;
	var dy = previousDragY-newY;
	for(var ii=0;ii<items.length;ii++)
	{
		var item = items[ii];
		if(item.selected)
		{
			item.attr({
				cx:item.getBBox().cx-dx,
				cy:item.getBBox().cy-dy					
			});
		}
	}
	previousDragX = newX;
	previousDragY = newY;
}

function beginSelectangle(clickX,clickY)
{
	startSelectangleX = clickX;
	startSelectanglyY = clickY;
}

function endSelectangle(event)
{
	
}

function keyPressed(event)
{
	var unicode = event.charCode;
	switch (unicode)
	{
		case 0:
			specialPressed(event)
			break;
	}
}

function specialPressed(event)
{
	switch (event.keyCode)
	{
		case 46:
			deletePressed();
			break;
	}
}

function deletePressed() {
	for(var ii = 0; ii < items.length; ii++)
	{
		if(items[ii].selected)
		{
			items[ii].remove();
			items[ii].deleted = true;
		}
	}
	var tempItems = [];
	for(var ij = 0; ij < items.length; ij++)
	{
		if(!items[ij].deleted)
		{
			tempItems.push(items[ij]);
		}
	}
	items = tempItems;
}

function snapClick(clickX,clickY) 
{
	var dot = s.circle(clickX,clickY,dotWidth);
	dot.selected = false;
	dot.hover(
		function() {
			highlight(dot);
		}, 
		function(){
			lowlight(dot);
		}
	);
	dot.type = "dot";
	items.push(dot);
}

function highlight(thing) 
{
	thing.highlighted = true;
	thing.attr({
		fill: highlightedColor
	});
}

function lowlight(thing) 
{
	thing.highlighted = false;
	if(thing.selected)
	{
		thing.attr({
			fill: selectedColor
		});
	}
	else 
	{
		thing.attr({
			fill: defaultColor
		});
	}
}

function toggleSelect(thing) 
{
	if(thing.selected)
	{
		thing.attr({
			fill: defaultColor
		});
		thing.selected = false;
	} else {
		thing.attr({
			fill: selectedColor
		});
		thing.selected = true;
	}
}
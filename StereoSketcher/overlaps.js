function addOverlaps()
{
	var item;
	var clone;
	var clip;
	var itemOverlap, itemOverlapUnder;
	var lineOverlap;
	var cloneOverlap, cloneOverlapUnder;
	var resultColor;
	var outerBBox, innerBBox;
	var overlap;
	var clipPath;
	var tempItem;
	
	var lines = getLines();
	var faces = getFaces();
	var linesAndFaces = getLinesAndFaces();
	
	for(var ii=0;ii<linesAndFaces.length;ii++)
	{
		item = linesAndFaces[ii];
		outerBBox = item.getBBox();
		item.overlaps = [];
		
		for(var jj=0;jj<linesAndFaces.length;jj++)
		{
			tempItem = linesAndFaces[jj];
			
			innerBBox = tempItem.getBBox();
			
			if (!doBoundingBoxesOverlap(outerBBox,innerBBox)) continue;
			
			resultColor = getResultColor(item,tempItem);
			overlap = {};
			clone = tempItem.clone;
			
			clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
			clipPath.setAttribute("id",["itemClip.",ii,".",jj].join(''));
			overlap.itemClip = createClipPath(item,clipPath);
			
			clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
			clipPath.setAttribute("id",["cloneClip.",ii,".",jj].join(''));
			overlap.cloneClip = createClipPath(clone,clipPath);

			if(doesElementHaveClass(item,"face"))
			{
				itemOverlap = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
				itemOverlap.setAttribute("fill",resultColor);
				itemOverlap.setAttribute("points",item.getAttribute("points"));
				
				itemOverlapUnder = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
				itemOverlapUnder.setAttribute("fill",resultColor);
				itemOverlapUnder.setAttribute("points",item.getAttribute("points"));
				itemOverlapUnder.setAttribute("stroke-width",faceSpaceCorrection);
				itemOverlapUnder.setAttribute("stroke",resultColor);
				itemOverlapUnder.setAttribute("clip-path",["url(#cloneClip.",ii,".",jj,")"].join(''));
				itemOverlapUnder.setAttribute("class","itemOverlapUnder");
				forwardAllMouseEvents(itemOverlapUnder,item);
				shapeGroup.appendChild(itemOverlapUnder);
				overlap.itemOverlapUnder = itemOverlapUnder;
			} 
			else if (doesElementHaveClass(item,"line"))
			{
				itemOverlap = document.createElementNS("http://www.w3.org/2000/svg","line");
				itemOverlap.setAttribute("x1",item.getAttribute("x1"));
				itemOverlap.setAttribute("y1",item.getAttribute("y1"));
				itemOverlap.setAttribute("x2",item.getAttribute("x2"));
				itemOverlap.setAttribute("y2",item.getAttribute("y2"));
				itemOverlap.setAttribute("stroke",resultColor);
				itemOverlap.setAttribute("stroke-width",lineThickness);
			}
			itemOverlap.setAttribute("class","itemOverlap");
			forwardAllMouseEvents(itemOverlap,item);
			shapeGroup.appendChild(itemOverlap);
			itemOverlap.setAttribute("clip-path",["url(#cloneClip.",ii,".",jj,")"].join(''));
			overlap.itemOverlap = itemOverlap;
			
			if(doesElementHaveClass(clone,"cloneFace"))
			{
				cloneOverlap = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
				cloneOverlap.setAttribute("fill",resultColor);
				cloneOverlap.setAttribute("points",clone.getAttribute("points"));
				
				cloneOverlapUnder = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
				cloneOverlapUnder.setAttribute("fill",resultColor);
				cloneOverlapUnder.setAttribute("points",clone.getAttribute("points"));
				cloneOverlapUnder.setAttribute("stroke-width",faceSpaceCorrection);
				cloneOverlapUnder.setAttribute("stroke",resultColor);
				cloneOverlapUnder.setAttribute("clip-path",["url(#itemClip.",ii,".",jj,")"].join(''));
				cloneOverlapUnder.setAttribute("class","cloneOverlapUnder");
				forwardAllMouseEvents(cloneOverlapUnder,item);
				shapeGroup.appendChild(cloneOverlapUnder);
				overlap.cloneOverlapUnder = cloneOverlapUnder;
			}
			else if (doesElementHaveClass(clone,"cloneLine"))
			{
				cloneOverlap = document.createElementNS("http://www.w3.org/2000/svg","line");
				cloneOverlap.setAttribute("x1",clone.getAttribute("x1"));
				cloneOverlap.setAttribute("y1",clone.getAttribute("y1"));
				cloneOverlap.setAttribute("x2",clone.getAttribute("x2"));
				cloneOverlap.setAttribute("y2",clone.getAttribute("y2"));
				cloneOverlap.setAttribute("stroke",resultColor);
				cloneOverlap.setAttribute("stroke-width",lineThickness);
			}
			cloneOverlap.setAttribute("class","cloneOverlap");
			shapeGroup.appendChild(cloneOverlap);
			forwardAllMouseEvents(cloneOverlap,item);	
			cloneOverlap.setAttribute("clip-path",["url(#itemClip.",ii,".",jj,")"].join(''));
			overlap.cloneOverlap = cloneOverlap;
			
			item.overlaps.push(overlap);
		}
	}
}

function createClipPath(item,clipPath)
{			
	var clip;
	if(doesElementHaveClass(item,"face")||doesElementHaveClass(item,"cloneFace"))
	{
		clip = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
		clip.setAttribute("points",item.getAttribute("points"));
		clipPath.appendChild(clip);
	}
	else if (doesElementHaveClass(item,"line")||doesElementHaveClass(item,"cloneLine"))
	{
		clip = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
		var x1 = parseInt(item.getAttribute("x1"));
		var y1 = parseInt(item.getAttribute("y1"));
		var x2 = parseInt(item.getAttribute("x2"));
		var y2 = parseInt(item.getAttribute("y2"));
		var theta = Math.atan((y2-y1)/(x2-x1));
		var littleX = (lineThickness/2)*Math.sin(theta);
		var littleY = (lineThickness/2)*Math.cos(theta);
		var path = [(x1-littleX),",",(y1+littleY)," ",(x1+littleX),",",(y1-littleY)," ",(x2+littleX),",",(y2-littleY)," ",(x2-littleX),",",(y2+littleY)].join('');
		clip.setAttribute("points",path);
		clipPath.appendChild(clip);
		
		clip = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		clip.setAttribute("cx",x1);
		clip.setAttribute("cy",y1);
		clip.setAttribute("r",lineThickness/2);
		clipPath.appendChild(clip);
		
		clip = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		clip.setAttribute("cx",x2);
		clip.setAttribute("cy",y2);
		clip.setAttribute("r",lineThickness/2);
		clipPath.appendChild(clip);
	}
	defs.appendChild(clipPath);
	return clipPath;
}

function doBoundingBoxesOverlap(bbox1,bbox2)
{
	return (bbox1.x <= bbox2.x+bbox2.width && bbox1.x+bbox1.width >= bbox2.x && bbox1.y <= bbox2.y+bbox2.height && bbox1.y+bbox1.height >= bbox2.y);
}

function forwardAllMouseEvents(element,recipient)
{
	element.onmouseenter = function()
	{
		recipient.onmouseenter();
	}
	element.onmouseout = function()
	{
		recipient.onmouseout();
	}
	element.onmousedown = function(event)
	{
		recipient.onmousedown(event);
	}
	element.onmouseup = function(event)
	{
		recipient.onmouseup(event);
	}
	element.ondblclick = function(event)
	{
		recipient.ondblclick(event);
	}
}

function getResultColor(base,clone)
{
	return "#"+("000000"+(getCyanComponent(base.color)|getRedComponent(clone.color)).toString(16)).slice(-6);
}

function getCyanComponent(colorAttr)
{
	var hex = parseInt("0x"+colorAttr.slice(1));
	return hex & 65535;
}

function getRedComponent(colorAttr)
{
	var hex = parseInt("0x"+colorAttr.slice(1));
	return hex & 16711680;
}

function correctOverlaps()
{
	if(mode==2)
	{
		removeOverlaps();
		addOverlaps();
	}
}

function removeOverlaps()
{
	var item;
	var linesAndFaces = getLinesAndFaces();
	var overlap;
	for(var ii = 0; ii < linesAndFaces.length; ii++)
	{
		item = linesAndFaces[ii];
		removeOverlapsOfItem(item);
	}
}

function removeOverlapsOfItem(item)
{
	for(var jj=0;jj<item.overlaps.length;jj++)
	{
		overlap = item.overlaps[jj];
		defs.removeChild(overlap.itemClip);
		defs.removeChild(overlap.cloneClip);
		shapeGroup.removeChild(overlap.itemOverlap);
		if(overlap.itemOverlapUnder != null)
		{
			shapeGroup.removeChild(overlap.itemOverlapUnder);
		}
		shapeGroup.removeChild(overlap.cloneOverlap);
		if(overlap.cloneOverlapUnder != null)
		{
			shapeGroup.removeChild(overlap.cloneOverlapUnder);
		}
	}
	item.overlaps = [];
}

function setCloneFilter(element)
{
	element.setAttribute("style","filter: url(#cyanFilter)");
}

function setShapeFilter(element)
{
	element.setAttribute("style","filter: url(#redFilter)");
}

function dropFilters(element)
{
	element.setAttribute("style","");
}

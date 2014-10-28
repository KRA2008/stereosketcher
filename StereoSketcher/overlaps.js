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
	var itemClip;
	
	var lines = getLines();
	var faces = getFaces();
	var linesAndFaces = getLinesAndFaces();
	
	for(var ii=0;ii<linesAndFaces.length;ii++)
	{
		item = linesAndFaces[ii];
		outerBBox = item.getBBox();
		item.overlaps = [];
		
		for(var jj=0;jj<faces.length;jj++)
		{
			var tempFace = faces[jj];
			
			innerBBox = tempFace.getBBox();
			
			if (!doBoundingBoxesOverlap(outerBBox,innerBBox)) continue;
			
			resultColor = getResultColor(item,tempFace);
			overlap = {};
			clone = tempFace.clone;
			
			itemClip = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
			itemClip.setAttribute("id","itemClip."+ii+"."+jj);
			
			if(doesElementHaveClass(item,"face"))
			{
				clip = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
				clip.setAttribute("points",item.getAttribute("points"));
			} 
			else if (doesElementHaveClass(item,"line"))
			{
				clip = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
				var x1 = parseFloat(item.getAttribute("x1"));
				var y1 = parseFloat(item.getAttribute("y1"));
				var x2 = parseFloat(item.getAttribute("x2"));
				var y2 = parseFloat(item.getAttribute("y2"));
				var theta = Math.atan((y2-y1)/(x2-x1));
				var littleX = (lineThickness/2)*Math.sin(theta);
				var littleY = (lineThickness/2)*Math.cos(theta);
				var p1 = (x1-littleX)+","+(y1+littleY);
				var p2 = (x1+littleX)+","+(y1-littleY);
				var p3 = (x2+littleX)+","+(y2-littleY);
				var p4 = (x2-littleX)+","+(y2+littleY);
				var path = p1+" "+p2+" "+p3+" "+p4;
				clip.setAttribute("points",path);
			}
			itemClip.appendChild(clip);
			
			cloneClip = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
			cloneClip.setAttribute("id","cloneClip."+ii+"."+jj);
			clip = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
			clip.setAttribute("points",clone.getAttribute("points"));
			cloneClip.appendChild(clip);
	
			defs.appendChild(itemClip);
			defs.appendChild(cloneClip);
			overlap.itemClip = itemClip;
			overlap.cloneClip = cloneClip;
			
			
			if(doesElementHaveClass(item,"face"))
			{
				itemOverlap = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
				itemOverlap.setAttribute("fill",resultColor);
				itemOverlap.setAttribute("points",item.getAttribute("points"));
			} 
			else if (doesElementHaveClass(item,"line"))
			{
				itemOverlap = document.createElementNS("http://www.w3.org/2000/svg","line");
				itemOverlap.setAttribute("x1",item.getAttribute("x1"));
				itemOverlap.setAttribute("y1",item.getAttribute("y1"));
				itemOverlap.setAttribute("x2",item.getAttribute("x2"));
				itemOverlap.setAttribute("y2",item.getAttribute("y2"));
				itemOverlap.setAttribute("stroke","resultColor");
				itemOverlap.setAttribute("stroke-width",lineThickness);
			}
			itemOverlap.setAttribute("clip-path","url(#cloneClip."+ii+"."+jj+")");
			itemOverlap.setAttribute("class","itemOverlap");
			forwardAllMouseEvents(itemOverlap,item);
			shapeGroup.appendChild(itemOverlap);
			overlap.itemOverlap = itemOverlap;
				
			if(doesElementHaveClass(item,"face"))
			{
				itemOverlapUnder = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
				itemOverlapUnder.setAttribute("fill",resultColor);
				itemOverlapUnder.setAttribute("points",item.getAttribute("points"));
				itemOverlapUnder.setAttribute("stroke-width",faceSpaceCorrection);
				itemOverlapUnder.setAttribute("stroke",resultColor);
				itemOverlapUnder.setAttribute("clip-path","url(#cloneClip."+ii+"."+jj+")");
				itemOverlapUnder.setAttribute("class","itemOverlapUnder");
				forwardAllMouseEvents(itemOverlapUnder,item);
				shapeGroup.appendChild(itemOverlapUnder);
				overlap.itemOverlapUnder = itemOverlapUnder;
			} 
			else if(doesElementHaveClass(item,"line"))
			{
				//lines don't need no unders
			}
			
			cloneOverlap = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
			cloneOverlap.setAttribute("fill",resultColor);
			cloneOverlap.setAttribute("points",clone.getAttribute("points"));
			cloneOverlap.setAttribute("clip-path","url(#itemClip."+ii+"."+jj+")");
			cloneOverlap.setAttribute("class","cloneOverlap");
			forwardAllMouseEvents(cloneOverlap,item);			
			shapeGroup.appendChild(cloneOverlap);
			overlap.cloneOverlap = cloneOverlap;
			
			cloneOverlapUnder = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
			cloneOverlapUnder.setAttribute("fill",resultColor);
			cloneOverlapUnder.setAttribute("points",clone.getAttribute("points"));
			cloneOverlapUnder.setAttribute("stroke-width",faceSpaceCorrection);
			cloneOverlapUnder.setAttribute("stroke",resultColor);
			cloneOverlapUnder.setAttribute("clip-path","url(#itemClip."+ii+"."+jj+")");
			cloneOverlapUnder.setAttribute("class","cloneOverlapUnder");
			forwardAllMouseEvents(cloneOverlapUnder,item);
			shapeGroup.appendChild(cloneOverlapUnder);
			overlap.cloneOverlapUnder = cloneOverlapUnder;
			
			item.overlaps.push(overlap);
		}
	}
}

function doBoundingBoxesOverlap(bbox1,bbox2)
{
	return (bbox1.x < bbox2.x+bbox2.width && bbox1.x+bbox1.width > bbox2.x && bbox1.y < bbox2.y+bbox2.height && bbox1.y+bbox1.height > bbox2.y);
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

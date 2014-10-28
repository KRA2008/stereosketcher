function addOverlaps()
{
	var item;
	var clone;
	var clip;
	var faceOverlap, faceOverlapUnder;
	var lineOverlap;
	var cloneOverlap, cloneOverlapUnder;
	var resultColor;
	var outerBBox, innerBBox;
	var imaxX,imaxY,iminX,iminY,jmaxX,jmaxY,jminX,jminY;
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
			
			if(doesElementHaveClass(item,"face"))
			{
				itemClip = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
				itemClip.setAttribute("id","itemClip."+ii+"."+jj);
				clip = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
				clip.setAttribute("points",item.getAttribute("points"));
				itemClip.appendChild(clip);
			} else if (doesElementHaveClass(item,"line"))
			{
				// make line clip
			}
			
			cloneClip = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
			cloneClip.setAttribute("id","cloneClip."+ii+"."+jj);
			clip = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
			clip.setAttribute("points",clone.getAttribute("points"));
			cloneClip.appendChild(clip);
	
			defs.appendChild(itemClip);
			defs.appendChild(cloneClip);
			overlap.itemClip = itemClip;
			overlap.cloneClip = cloneClip;
			

			faceOverlap = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
			faceOverlap.setAttribute("fill",resultColor);
			faceOverlap.setAttribute("points",item.getAttribute("points"));
			faceOverlap.setAttribute("clip-path","url(#cloneClip."+ii+"."+jj+")");
			faceOverlap.setAttribute("class","faceOverlap");
			forwardAllMouseEvents(faceOverlap,item);
			shapeGroup.appendChild(faceOverlap);
			overlap.faceOverlap = faceOverlap;
			
			if(doesElementHaveClass(item,"face"))
			{
				faceOverlapUnder = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
				faceOverlapUnder.setAttribute("fill",resultColor);
				faceOverlapUnder.setAttribute("points",item.getAttribute("points"));
				faceOverlapUnder.setAttribute("stroke-width",faceSpaceCorrection);
				faceOverlapUnder.setAttribute("stroke",resultColor);
				faceOverlapUnder.setAttribute("clip-path","url(#cloneClip."+ii+"."+jj+")");
				faceOverlapUnder.setAttribute("class","faceOverlapUnder");
				forwardAllMouseEvents(faceOverlapUnder,item);
				shapeGroup.appendChild(faceOverlapUnder);
				overlap.faceOverlapUnder = faceOverlapUnder;
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
	var face;
	var faces = getFaces();
	var overlap;
	for(var ii = 0; ii < faces.length; ii++)
	{
		face = faces[ii];
		removeOverlapsOfFace(face);
	}
}

function removeOverlapsOfFace(face)
{
	for(var jj=0;jj<face.overlaps.length;jj++)
	{
		overlap = face.overlaps[jj];
		defs.removeChild(overlap.itemClip);
		defs.removeChild(overlap.cloneClip);
		shapeGroup.removeChild(overlap.faceOverlap);
		shapeGroup.removeChild(overlap.faceOverlapUnder);
		shapeGroup.removeChild(overlap.cloneOverlap);
		shapeGroup.removeChild(overlap.cloneOverlapUnder);
	}
	face.overlaps = [];
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

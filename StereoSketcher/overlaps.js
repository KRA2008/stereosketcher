function addOverlaps()
{
	var face;
	var line;
	var clone;
	var clip;
	var faceOverlap, faceOverlapUnder;
	var lineOverlap;
	var cloneOverlap, cloneOverlapUnder;
	var resultColor;
	var outerBBox, innerBBox;
	var imaxX,imaxY,iminX,iminY,jmaxX,jmaxY,jminX,jminY;
	var overlap;
	
	var lines = getLines();
	var faces = getFaces();
	var linesAndFaces = getLinesAndFaces();
	
	for(var ii=0;ii<linesAndFaces.length;ii++)
	{
		var item = linesAndFaces[ii];
		outerBBox = item.getBBox();
		item.overlaps = [];
		
		face = item;
		
		for(var jj=0;jj<faces.length;jj++)
		{
			var tempFace = faces[jj];
			
			innerBBox = tempFace.getBBox();
			
			if (!doBoundingBoxesOverlap(outerBBox,innerBBox)) continue;
			
			resultColor = getResultColor(face,tempFace);
			overlap = {};
			clone = tempFace.clone;
			
			faceClip = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
			faceClip.setAttribute("id","faceClip."+ii+"."+jj);
			clip = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
			clip.setAttribute("points",face.getAttribute("points"));
			faceClip.appendChild(clip);
			
			cloneClip = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
			cloneClip.setAttribute("id","cloneClip."+ii+"."+jj);
			clip = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
			clip.setAttribute("points",clone.getAttribute("points"));
			cloneClip.appendChild(clip);
	
			defs.appendChild(faceClip);
			defs.appendChild(cloneClip);
			overlap.faceClip = faceClip;
			overlap.cloneClip = cloneClip;
			
			faceOverlap = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
			faceOverlap.setAttribute("fill",resultColor);
			faceOverlap.setAttribute("points",face.getAttribute("points"));
			faceOverlap.setAttribute("clip-path","url(#cloneClip."+ii+"."+jj+")");
			faceOverlap.setAttribute("class","faceOverlap");
			forwardAllMouseEvents(faceOverlap,face);
			
			faceOverlapUnder = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
			faceOverlapUnder.setAttribute("fill",resultColor);
			faceOverlapUnder.setAttribute("points",face.getAttribute("points"));
			faceOverlapUnder.setAttribute("stroke-width",faceSpaceCorrection);
			faceOverlapUnder.setAttribute("stroke",resultColor);
			faceOverlapUnder.setAttribute("clip-path","url(#cloneClip."+ii+"."+jj+")");
			faceOverlapUnder.setAttribute("class","faceOverlapUnder");
			forwardAllMouseEvents(faceOverlapUnder,face);
			
			cloneOverlap = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
			cloneOverlap.setAttribute("fill",resultColor);
			cloneOverlap.setAttribute("points",clone.getAttribute("points"));
			cloneOverlap.setAttribute("clip-path","url(#faceClip."+ii+"."+jj+")");
			cloneOverlap.setAttribute("class","cloneOverlap");
			forwardAllMouseEvents(cloneOverlap,face);
			
			cloneOverlapUnder = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
			cloneOverlapUnder.setAttribute("fill",resultColor);
			cloneOverlapUnder.setAttribute("points",clone.getAttribute("points"));
			cloneOverlapUnder.setAttribute("stroke-width",faceSpaceCorrection);
			cloneOverlapUnder.setAttribute("stroke",resultColor);
			cloneOverlapUnder.setAttribute("clip-path","url(#faceClip."+ii+"."+jj+")");
			cloneOverlapUnder.setAttribute("class","cloneOverlapUnder");
			forwardAllMouseEvents(cloneOverlapUnder,face);
			
			shapeGroup.appendChild(faceOverlap);
			shapeGroup.appendChild(faceOverlapUnder);
			shapeGroup.appendChild(cloneOverlap);
			shapeGroup.appendChild(cloneOverlapUnder);
			overlap.faceOverlap = faceOverlap;
			overlap.faceOverlapUnder = faceOverlapUnder;
			overlap.cloneOverlap = cloneOverlap;
			overlap.cloneOverlapUnder = cloneOverlapUnder;
			face.overlaps.push(overlap);
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
		defs.removeChild(overlap.faceClip);
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

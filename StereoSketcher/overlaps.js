function addOverlaps()
{
	var face;
	var clone;
	var faces = getFaces();
	var clip;
	var faceOverlap, faceOverlapUnder;
	var cloneOverlap, cloneOverlapUnder;
	var resultColor;
	var ibbox, jbbox;
	var imaxX,imaxY,iminX,iminY,jmaxX,jmaxY,jminX,jminY;
	var overlap;
	for(var ii=0;ii<faces.length;ii++)
	{
		face = faces[ii];
		face.overlaps = [];
		
		ibbox = face.getBBox();
		imaxX = ibbox.x+ibbox.width;
		iminX = ibbox.x;
		imaxY = ibbox.y+ibbox.height;
		iminY = ibbox.y;
		for(var jj=0;jj<faces.length;jj++)
		{
			var tempFace = faces[jj];
			clone = tempFace.clone;
			resultColor = "#"+("000000"+(getCyanComponent(face.color)|getRedComponent(tempFace.color)).toString(16)).slice(-6);
			overlap = {};
			
			jbbox = tempFace.getBBox();
			jmaxX = jbbox.x+jbbox.width;
			jminX = jbbox.x;
			jmaxY = jbbox.y+jbbox.height;
			jminY = jbbox.y;
			
			if (!(iminX < jmaxX && imaxX > jminX && iminY < jmaxY && imaxY > jminY)) continue;
			
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
			
			faceOverlapUnder = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
			faceOverlapUnder.setAttribute("fill",resultColor);
			faceOverlapUnder.setAttribute("points",face.getAttribute("points"));
			faceOverlapUnder.setAttribute("stroke-width",faceSpaceCorrection);
			faceOverlapUnder.setAttribute("stroke",resultColor);
			faceOverlapUnder.setAttribute("clip-path","url(#cloneClip."+ii+"."+jj+")");
			faceOverlapUnder.setAttribute("class","faceOverlapUnder");
			
			cloneOverlap = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
			cloneOverlap.setAttribute("fill",resultColor);
			cloneOverlap.setAttribute("points",clone.getAttribute("points"));
			cloneOverlap.setAttribute("clip-path","url(#faceClip."+ii+"."+jj+")");
			cloneOverlap.setAttribute("class","cloneOverlap");
			
			cloneOverlapUnder = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
			cloneOverlapUnder.setAttribute("fill",resultColor);
			cloneOverlapUnder.setAttribute("points",clone.getAttribute("points"));
			cloneOverlapUnder.setAttribute("stroke-width",faceSpaceCorrection);
			cloneOverlapUnder.setAttribute("stroke",resultColor);
			cloneOverlapUnder.setAttribute("clip-path","url(#faceClip."+ii+"."+jj+")");
			cloneOverlapUnder.setAttribute("class","cloneOverlapUnder");
			
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

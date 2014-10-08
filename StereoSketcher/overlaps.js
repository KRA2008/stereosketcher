function addOverlaps()
{
	var face;
	var clone;
	var faces = getFaces();
	var clip;
	var faceOverlap, faceOverlapUnder;
	var cloneOverlap, cloneOverlapUnder;
	var resultColor;
	for(var ii=0;ii<faces.length;ii++)
	{
		face = faces[ii];
		face.overlaps = [];
		
		for(var jj=0;jj<faces.length;jj++)
		{
			var tempFace = faces[jj];
			clone = tempFace.clone;
			resultColor = "#"+("000000"+(getCyanComponent(face.color)|getRedComponent(tempFace.color)).toString(16)).slice(-6);
			
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
			
			faceOverlap = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
			faceOverlap.setAttribute("fill",resultColor);
			faceOverlap.setAttribute("points",face.getAttribute("points"));
			faceOverlap.setAttribute("clip-path","url(#cloneClip."+ii+"."+jj+")");
			
			faceOverlapUnder = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
			faceOverlapUnder.setAttribute("fill",resultColor);
			faceOverlapUnder.setAttribute("points",face.getAttribute("points"));
			faceOverlapUnder.setAttribute("stroke-width",faceSpaceCorrection);
			faceOverlapUnder.setAttribute("stroke",resultColor);
			faceOverlapUnder.setAttribute("clip-path","url(#cloneClip."+ii+"."+jj+")");
			
			cloneOverlap = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
			cloneOverlap.setAttribute("fill",resultColor);
			cloneOverlap.setAttribute("points",clone.getAttribute("points"));
			cloneOverlap.setAttribute("clip-path","url(#faceClip."+ii+"."+jj+")");
			
			cloneOverlapUnder = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
			cloneOverlapUnder.setAttribute("fill",resultColor);
			cloneOverlapUnder.setAttribute("points",clone.getAttribute("points"));
			cloneOverlapUnder.setAttribute("stroke-width",faceSpaceCorrection);
			cloneOverlapUnder.setAttribute("stroke",resultColor);
			cloneOverlapUnder.setAttribute("clip-path","url(#faceClip."+ii+"."+jj+")");
			
			face.parentNode.appendChild(faceOverlap);
			face.parentNode.appendChild(faceOverlapUnder);
			face.parentNode.appendChild(cloneOverlap);
			face.parentNode.appendChild(cloneOverlapUnder);
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

function removeOverlaps()
{
	
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

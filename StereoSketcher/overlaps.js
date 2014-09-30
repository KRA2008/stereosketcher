function addOverlaps()
{
	var face;
	var faces = getFaces();
	var clip;
	var faceOverlap, faceOverlapUnder;
	var cloneOverlap, cloneOverlapUnder;
	for(var ii=0;ii<faces.length;ii++)
	{
		face = faces[ii];
		
		faceClip = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
		faceClip.setAttribute("id","faceClip"+ii);
		clip = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
		clip.setAttribute("points",face.getAttribute("points"));
		faceClip.appendChild(clip);
		
		cloneClip = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
		cloneClip.setAttribute("id","cloneClip"+ii);
		clip = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
		clip.setAttribute("points",face.clone.getAttribute("points"));
		cloneClip.appendChild(clip);

		defs.appendChild(faceClip);
		defs.appendChild(cloneClip);
		
		faceOverlap = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
		faceOverlap.setAttribute("fill",face.color);
		faceOverlap.setAttribute("points",face.getAttribute("points"));
		faceOverlap.setAttribute("clip-path","url(#cloneClip"+ii+")");
		
		faceOverlapUnder = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
		faceOverlapUnder.setAttribute("fill",face.color);
		faceOverlapUnder.setAttribute("points",face.getAttribute("points"));
		faceOverlapUnder.setAttribute("stroke-width",faceSpaceCorrection);
		faceOverlapUnder.setAttribute("stroke",face.color);
		faceOverlapUnder.setAttribute("clip-path","url(#cloneClip"+ii+")");
		
		cloneOverlap = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
		cloneOverlap.setAttribute("fill",face.color);
		cloneOverlap.setAttribute("points",face.clone.getAttribute("points"));
		cloneOverlap.setAttribute("clip-path","url(#faceClip"+ii+")");
		
		cloneOverlapUnder = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
		cloneOverlapUnder.setAttribute("fill",face.color);
		cloneOverlapUnder.setAttribute("points",face.clone.getAttribute("points"));
		cloneOverlapUnder.setAttribute("stroke-width",faceSpaceCorrection);
		cloneOverlapUnder.setAttribute("stroke",face.color);
		cloneOverlapUnder.setAttribute("clip-path","url(#faceClip"+ii+")");
		
		face.parentNode.appendChild(faceOverlap);
		face.parentNode.appendChild(faceOverlapUnder);
		face.parentNode.appendChild(cloneOverlap);
		face.parentNode.appendChild(cloneOverlapUnder);
	}
}

function removeOverlaps()
{
	
}

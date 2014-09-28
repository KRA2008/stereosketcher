function addOverlaps()
{
	var face;
	var faces = getFaces();
	var clipper;
	for(var ii=0;ii<faces.length;ii++)
	{
		face = faces[ii];
		clipper = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
		clipper.setAttribute("id","clip"+ii);
		top = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
		top.setAttribute("points",face.getAttribute("points"));
		bottom = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
		bottom.setAttribute("points",face.clone.getAttribute("points"));
		clipper.appendChild(top);
		clipper.appendChild(bottom);
		//TODO: stick flood in there, don't clip the actual face.
		face.setAttribute("clip-path","url(#clip"+ii+")");
	}
}

function removeOverlaps()
{
	
}

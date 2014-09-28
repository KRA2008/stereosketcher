function addOverlaps()
{
	var face;
	var faces = getFaces();
	var clip1;
	var clip2;
	var maxx,maxy,minx,miny;
	var overlap;
	var top,bottom;
	for(var ii=0;ii<faces.length;ii++)
	{
		face = faces[ii];
		clip1 = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
		clip1.setAttribute("id","clip"+ii+".1");
		top = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
		top.setAttribute("points",face.getAttribute("points"));
		clip1.appendChild(top);
		
		clip2 = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
		clip2.setAttribute("id","clip"+ii+".2");
		bottom = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
		bottom.setAttribute("points",face.clone.getAttribute("points"));
		clip2.appendChild(bottom);
		
		clip2.setAttribute("clip-path","url(#clip"+ii+".1)");

		defs.appendChild(clip1);
		defs.appendChild(clip2);
		
		overlap = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		overlap.setAttribute("x",0);
		overlap.setAttribute("y",0);
		overlap.setAttribute("width",window.innerWidth);
		overlap.setAttribute("height",window.innerHeight);
		overlap.setAttribute("fill",face.color);
		overlap.setAttribute("clip-path","url(#clip"+ii+".2)");
		svg.appendChild(overlap);
	}
}

function removeOverlaps()
{
	
}

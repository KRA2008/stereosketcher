function dragDots(event,shape) {
	event.stopPropagation();
	var dx=event.clientX-dragger.x;
	var dy=event.clientY-dragger.y;
	var dot;
	var line;
	var face;
	var x=0;
	var y=0;
	var dots = getDots();
	var lines = [];
	var faces = [];
	var facex1 = 0;
	var facey1 = 0;
	var facex2 = 0;
	var facey2 = 0;
	var facex3 = 0;
	var facey3 = 0;
	var faceCoord = "";
	var cloneCoord = "";
	for(var ii=0;ii<dots.length;ii++)
	{
		dot=dots[ii];
		if(dot.isSelected())
		{
			x=parseInt(dot.getAttribute("cx"));
			y=parseInt(dot.getAttribute("cy"));
			dot.setAttribute("cx",x+dx);
			dot.setAttribute("cy",y+dy);
			lines=dot.lines;
			for(var ij=0;ij<lines.length;ij++)
			{
				line = lines[ij];
				if(line.dot1 == dot)
				{
					line.setAttribute("x1",line.dot1.getAttribute("cx"));
					line.setAttribute("y1",line.dot1.getAttribute("cy"));
					line.clone.setAttribute("x1",parseInt(line.dot1.getAttribute("cx"))+IPD+dot.shift);
					line.clone.setAttribute("y1",line.dot1.getAttribute("cy"));
				}
				else if(line.dot2 == dot)
				{
					line.setAttribute("x2",line.dot2.getAttribute("cx"));
					line.setAttribute("y2",line.dot2.getAttribute("cy"));
					line.clone.setAttribute("x2",parseInt(line.dot2.getAttribute("cx"))+IPD+dot.shift);
					line.clone.setAttribute("y2",line.dot2.getAttribute("cy"));
				}
			}
			faces = dot.faces;
			for(var ik=0;ik<faces.length;ik++)
			{
				face = faces[ik];
				if(face.dot1 == dot)
				{
					facex1 = dot.getAttribute("cx");
					facey1 = dot.getAttribute("cy");
					facex2 = face.dot2.getAttribute("cx");
					facey2 = face.dot2.getAttribute("cy");
					facex3 = face.dot3.getAttribute("cx");
					facey3 = face.dot3.getAttribute("cy");
					faceCoord = facex1+","+facey1+" "+facex2+","+facey2+" "+facex3+","+facey3;
					face.setAttribute("points",faceCoord);
					cloneCoord = (parseInt(facex1)+IPD+face.dot1.shift)+","+facey1+" "+(parseInt(facex2)+face.dot2.shift+IPD)+","+facey2+" "+(parseInt(facex3)+face.dot3.shift+IPD)+","+facey3;
					face.clone.setAttribute("points",cloneCoord);
				}
				if(face.dot2 == dot)
				{
					facex1 = face.dot1.getAttribute("cx");
					facey1 = face.dot1.getAttribute("cy");
					facex2 = dot.getAttribute("cx");
					facey2 = dot.getAttribute("cy");
					facex3 = face.dot3.getAttribute("cx");
					facey3 = face.dot3.getAttribute("cy");
					faceCoord = facex1+","+facey1+" "+facex2+","+facey2+" "+facex3+","+facey3;
					face.setAttribute("points",faceCoord);
					cloneCoord = (parseInt(facex1)+IPD+face.dot1.shift)+","+facey1+" "+(parseInt(facex2)+face.dot2.shift+IPD)+","+facey2+" "+(parseInt(facex3)+face.dot3.shift+IPD)+","+facey3;
					face.clone.setAttribute("points",cloneCoord);
				}
				if(face.dot3 == dot)
				{
					facex1 = face.dot1.getAttribute("cx");
					facey1 = face.dot1.getAttribute("cy");
					facex2 = face.dot2.getAttribute("cx");
					facey2 = face.dot2.getAttribute("cy");
					facex3 = dot.getAttribute("cx");
					facey3 = dot.getAttribute("cy");
					faceCoord = facex1+","+facey1+" "+facex2+","+facey2+" "+facex3+","+facey3;
					face.setAttribute("points",faceCoord);
					cloneCoord = (parseInt(facex1)+IPD+face.dot1.shift)+","+facey1+" "+(parseInt(facex2)+face.dot2.shift+IPD)+","+facey2+" "+(parseInt(facex3)+face.dot3.shift+IPD)+","+facey3;
					face.clone.setAttribute("points",cloneCoord);
				}
			}
			dot.label.setAttribute("x",parseInt(dot.getAttribute("cx"))+labelX);
			dot.label.setAttribute("y",parseInt(dot.getAttribute("cy"))+labelY);
		}
	}
	dragger.x=event.clientX;
	dragger.y=event.clientY;
}
var selectangle;

function changeSelectangle(event) {
	event.stopPropagation();
	if(selectangle!=null)
	{
		var x=parseInt(selectangle.getAttribute("x"));
		var y=parseInt(selectangle.getAttribute("y"));
		var width=parseInt(selectangle.getAttribute("width"));
		var height=parseInt(selectangle.getAttribute("height"));
		var ex=event.clientX;
		var ey=event.clientY;
		if(selectangle.originalX<ex)
		{
			selectangle.setAttribute("width",ex-x);
			selectangle.setAttribute("x",selectangle.originalX);
		}
		else
		{
			selectangle.setAttribute("width",selectangle.originalX-ex);
			selectangle.setAttribute("x",ex);
		}
		if(selectangle.originalY<ey)
		{
			selectangle.setAttribute("height",ey-y);
			selectangle.setAttribute("y",selectangle.originalY);
		}
		else
		{
			selectangle.setAttribute("height",selectangle.originalY-ey);
			selectangle.setAttribute("y",ey);
		}
	}
	else
	{
		createSelectangle(event);
	}
}

function createSelectangle(event)
{
	selectangle = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	selectangle.setAttribute("x",event.clientX);
	selectangle.setAttribute("y",event.clientY);
	selectangle.setAttribute("fill-opacity",0);
	selectangle.setAttribute("stroke","black");
	selectangle.setAttribute("stroke-width",2);
	selectangle.setAttribute("stroke-opacity",1);
	selectangle.setAttribute("height",0);
	selectangle.setAttribute("width",0);
	selectangle.originalX=event.clientX;
	selectangle.originalY=event.clientY;
	svg.appendChild(selectangle);
}
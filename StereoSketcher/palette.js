var plainWidth = 20;
var hoverWidth = 30;

function addPalette()
{
	var colors = ["red","orange","yellow","green","blue","violet"];
	var bbox = svg.getBoundingClientRect();
	for(var ii = 0;ii<colors.length;ii++)
	{
		var box = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		box.setAttribute("x",plainWidth+plainWidth*2*ii);
		box.setAttribute("y",plainWidth);
		box.setAttribute("height",plainWidth);
		box.setAttribute("width",plainWidth);
		box.setAttribute("fill",colors[ii]);
		box.setAttribute("class","");
		addClassToElement(box,"paletteBox");
		box.onmouseenter = function() 
		{
			this.setAttribute("height",hoverWidth);
			this.setAttribute("width",hoverWidth);
			this.setAttribute("x",parseInt(this.getAttribute("x"))-(hoverWidth-plainWidth)/2)
			this.setAttribute("y",parseInt(this.getAttribute("y"))-(hoverWidth-plainWidth)/2)
		}
		box.onmouseleave = function()
		{
			this.setAttribute("height",plainWidth);
			this.setAttribute("width",plainWidth);
			this.setAttribute("x",parseInt(this.getAttribute("x"))+(hoverWidth-plainWidth)/2)
			this.setAttribute("y",parseInt(this.getAttribute("y"))+(hoverWidth-plainWidth)/2)
		}
		box.onclick = function(event)
		{
			event.stopPropagation();
			var color = this.getAttribute("fill");
			var faces = getFaces();
			var face;
			for(var ii = 0;ii<faces.length;ii++)
			{
				face = faces[ii];
				if(face.isSelected())
				{
					face.setAttribute("fill",color);
					face.clone.setAttribute("fill",color);
				}
				face.deselect();
			}
			var lines = getLines();
			var line;
			for(var ii=0;ii<lines.length;ii++)
			{
				line = lines[ii];
				if(line.isSelected())
				{
					line.color=color;
					line.setAttribute("stroke",color);
					line.clone.setAttribute("stroke",color);
				}
				line.deselect();
			}
		}
		box.onmouseup = function(event)
		{
			event.stopPropagation();
		}
		box.onmousedown = function(event)
		{
			preventDefault(event);
			event.stopPropagation();
		}
		svg.appendChild(box);
	}
}

'use strict';

function sampleColor()
{
	var selectedItem = null;
	var items = getLinesAndFaces();
	var item;
	for(var ii=0;ii<items.length;ii++)
	{
		item = items[ii];
		if(item.isSelected())
		{
			if(selectedItem != null)
			{
				return;
			} else {
				selectedItem = item;
			}
		}
	}
	if(selectedItem == null) return;
	document.getElementById('colorPicker').color.fromString(selectedItem.color);
}

function setColor()
{			
	var color = document.getElementById('colorPicker').value;
	var faces = getFaces();
	var face;
	for(var ii = 0;ii<faces.length;ii++)
	{
		face = faces[ii];
		if(face.isSelected())
		{
			face.color=color;
			face.setAttribute("fill",color);
			face.clone.setAttribute("fill",color);
			face.under.setAttribute("fill",color);
			face.clone.under.setAttribute("fill",color);
			face.under.setAttribute("stroke",color);
			face.clone.under.setAttribute("stroke",color);
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

function setBackground()
{
	var color = document.getElementById('colorPicker').value;
	svg.setAttribute("style","background: "+color);
}

function sampleBackground()
{
	document.getElementById('colorPicker').color.fromString(svg.getAttribute("style").substr(style.indexOf("#")));
}
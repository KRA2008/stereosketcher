var faceSpaceCorrection = "0.5px";
var faceActionStrokeWidth = 2;
var labelX = -15;
var labelY = -8;
var lineThickness = 2;
var dotRadius = 7;
var faceStartColor = "#777777";


var shapeFactory={
	createCircle:function(event) 
	{
		var dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		dot.setAttribute("cx",event.clientX);
		dot.setAttribute("cy",event.clientY);
		dot.setAttribute("r",dotRadius);
		dot.setAttribute("stroke","black");
		dot.setAttribute("stroke-width",1);
		dot.setAttribute("fill","yellow");
		dot.setAttribute("fill-opacity",0);
		dot.setAttribute("class","");
		addClassToElement(dot,"dot");
		addClassToElement(dot,"highlit");
		this.attachCommonHandlers(dot);
		dot.onmousemove = function(event) {
			if(mousePressed.is && mousePressed.shape && mousePressed.shape.isSelected())
			{
				dragDots(event,this);
			}
		};
		dot.ondblclick = function(event)
		{
			if(event.clientX == mousePressed.x && event.clientY == mousePressed.y)
			{
				selectAllContiguous(this,event);
			}
		};
		dot.lines = [];
		dot.shift = 0;
		var label = document.createElementNS("http://www.w3.org/2000/svg", "text");
		label.setAttribute("x",parseFloat(dot.getAttribute("cx"))+labelX);
		label.setAttribute("y",parseFloat(dot.getAttribute("cy"))+labelY);
		label.setAttribute("fill","black");
		label.setAttribute("class","");
		addClassToElement(label,"label");
		label.textContent = "0";
		dot.label = label;
		dot.faces = [];
		labelGroup.appendChild(label);
		dotGroup.appendChild(dot);
	},
	attachCommonHandlers:function(shape) {
		shape.onmouseenter = function() {
			this.highlight();
		};
		shape.onmouseout = function() {
			this.lowlight();
		};
		shape.select = function() {
			if(doesElementHaveClass(this,"dot"))
			{
				this.setAttribute("fill-opacity",0.5);
			}
			else if(doesElementHaveClass(this,"line"))
			{
				this.setAttribute("stroke","yellow");
			}
			else if(doesElementHaveClass(this,"face"))
			{
				this.setAttribute("stroke-width",faceActionStrokeWidth);
				this.setAttribute("stroke","yellow");
			}
			addClassToElement(this,"selected");
		};
		shape.deselect = function() {
			if(doesElementHaveClass(this,"dot"))
			{
				this.setAttribute("fill-opacity",0);
			}
			else if(doesElementHaveClass(this,"line"))
			{
				this.setAttribute("stroke",this.color);
			}
			else if(doesElementHaveClass(this,"face"))
			{
				this.setAttribute("stroke-width",0);
			}
			removeClassFromElement(this,"selected");
			if(doesElementHaveClass(this,"highlit"))
			{
				this.highlight();
			}
		};
		shape.isSelected = function() {
			return doesElementHaveClass(this,"selected");
		};
		shape.toggleSelect = function() {
			if(this.isSelected()) 
			{
				this.deselect();
			}
			else
			{
				this.select();
			}
		};
		shape.onmousedown = function(event) {
			if(event.button==0)
			{
				preventDefault(event);
				mousePressedOnShape(event,this);
			}
		};
		shape.onmouseup = function(event) {
			if(event.button==0)
			{
				mouseReleasedOnShape(event,this);
				selectangle=null;
			}
		};
		shape.highlight = function(event)
		{
			this.setAttribute("stroke","green");
			if(doesElementHaveClass(this,"dot"))
			{
				this.label.setAttribute("fill","green");
			}
			if(doesElementHaveClass(this,"face"))
			{
				this.setAttribute("stroke-width",faceActionStrokeWidth);
			}
			addClassToElement(this,"highlit");
		};
		shape.lowlight = function(event)
		{
			if(doesElementHaveClass(this,"dot"))
			{
				this.setAttribute("stroke","black");
				this.label.setAttribute("fill","black");
			}
			else if(doesElementHaveClass(this,"line"))
			{
				if(this.isSelected())
				{
					this.setAttribute("stroke","yellow");
				} else {
					this.setAttribute("stroke",shape.color);
				}
			}
			else if(doesElementHaveClass(this,"face"))
			{
				if(this.isSelected())
				{
					this.setAttribute("stroke","yellow");
				} else {
					this.setAttribute("stroke-width",0);
				}
			}
			removeClassFromElement(this,"highlit");
		};
	},
	createLine:function(dot1,dot2)
	{
		var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		line.setAttribute("x1",dot1.getAttribute("cx"));
		line.setAttribute("y1",dot1.getAttribute("cy"));
		line.setAttribute("x2",dot2.getAttribute("cx"));
		line.setAttribute("y2",dot2.getAttribute("cy"));
		line.color="black";
		line.setAttribute("stroke","black");
		line.setAttribute("stroke-width",lineThickness);
		line.setAttribute("class","");
		addClassToElement(line,"line");
		line.dot1=dot1;
		line.dot2=dot2;
		dot1.lines.push(line);
		dot2.lines.push(line);
		this.attachCommonHandlers(line);
		dot1.deselect();
		dot2.deselect();
		line.ondblclick = function(event)
		{
			selectDotsOfLine(this,event);
		};
		line.setAttribute("stroke-linecap","round");
		this.createCloneLine(line);
		shapeGroup.appendChild(line);
	},
	createCloneLine:function(line)
	{
		var clone = document.createElementNS("http://www.w3.org/2000/svg", "line");
		line.clone=clone;
		clone.setAttribute("x1",parseFloat(line.dot1.getAttribute("cx"))+IPD+line.dot1.shift);
		clone.setAttribute("y1",line.dot1.getAttribute("cy"));
		clone.setAttribute("x2",parseFloat(line.dot2.getAttribute("cx"))+IPD+line.dot2.shift);
		clone.setAttribute("y2",line.dot2.getAttribute("cy"));
		clone.setAttribute("stroke","black");
		clone.setAttribute("stroke-width",lineThickness);
		clone.setAttribute("class","");
		addClassToElement(clone,"cloneLine");
		clone.setAttribute("stroke-linecap","round");
		shapeGroup.appendChild(clone);
	},
	createFace:function(dot1,dot2,dot3)
	{
		var face = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
		var under = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
		var coords = "";
		dot1.faces.push(face);
		dot2.faces.push(face);
		dot3.faces.push(face);
		coords+=dot1.getAttribute("cx")+","+dot1.getAttribute("cy")+" ";
		coords+=dot2.getAttribute("cx")+","+dot2.getAttribute("cy")+" ";
		coords+=dot3.getAttribute("cx")+","+dot3.getAttribute("cy")+" ";
		dot1.deselect();
		dot2.deselect();
		dot3.deselect();
		face.dot1=dot1;
		face.dot2=dot2;
		face.dot3=dot3;
		face.setAttribute("points",coords);
		under.setAttribute("points",coords);
		face.under = under;
		face.setAttribute("class","");
		face.setAttribute("fill",faceStartColor);
		face.color = faceStartColor;
		under.setAttribute("fill",faceStartColor);
		under.setAttribute("stroke",faceStartColor);
		under.setAttribute("stroke-width",faceSpaceCorrection);
		under.setAttribute("stroke-opacity",1);
		under.setAttribute("class","faceUnder");
		addClassToElement(face,"face");
		this.attachCommonHandlers(face);
		face.ondblclick = function(event) {
			selectDotsOfFace(this,event);
		}
		this.createCloneFace(face);
		shapeGroup.appendChild(under);
		shapeGroup.appendChild(face);
		face.overlaps = [];
		correctOverlaps();
		if(mode==2)
		{
			setShapeFilter(face);
			setShapeFilter(under);
		}
	},
	createCloneFace:function(face)
	{
		var clone = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
		var under = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
		face.clone = clone;
		var coords = "";
		coords+=parseFloat(face.dot1.getAttribute("cx"))+IPD+face.dot1.shift+","+face.dot1.getAttribute("cy")+" ";
		coords+=parseFloat(face.dot2.getAttribute("cx"))+IPD+face.dot2.shift+","+face.dot2.getAttribute("cy")+" ";
		coords+=parseFloat(face.dot3.getAttribute("cx"))+IPD+face.dot3.shift+","+face.dot3.getAttribute("cy")+" ";
		clone.setAttribute("points",coords);
		under.setAttribute("points",coords);
		clone.under = under;
		clone.setAttribute("class","");
		addClassToElement(clone,"cloneFace");
		clone.setAttribute("stroke-width",0);
		clone.setAttribute("fill",faceStartColor);
		under.setAttribute("fill",faceStartColor);
		under.setAttribute("stroke",faceStartColor);
		under.setAttribute("stroke-width",faceSpaceCorrection);
		under.setAttribute("stroke-opacity",1);
		under.setAttribute("class","cloneUnder");
		shapeGroup.appendChild(under);
		shapeGroup.appendChild(clone);
		if(mode==2)
		{
			setCloneFilter(clone);
			setCloneFilter(under);
		}
	}
}
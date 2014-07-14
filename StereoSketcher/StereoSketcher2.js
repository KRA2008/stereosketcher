var id=0;
var svg;
var mousePressed={};
var mouseReleased={};
var dragger={};
var dots=[];
var lines=[];
var selectangle;

window.onload=function() {
	svg=document.getElementById("svg");
	svg.onmousedown = function(event) 
	{
		mousePressed.is=true;
		mousePressed.x=event.clientX;
		mousePressed.y=event.clientY;
		mousePressed.shape=null;
		if(event.button==0)
		{
			preventDefault(event);
			svg.onmousemove = function(event) {
				changeSelectangle(event);
			};
		}
	};
	svg.onmouseup = function(event)
	{
		if(mousePressed.shape==null && mousePressed.x==event.clientX && mousePressed.y==event.clientY)
		{
			if(event.button==0)
			{
				shapeFactory.createCircle(event);
			}
			if(event.button==2)
			{
				for(var il=0;il<dots.length;il++)
				{
					var dot=dots[il];
					dot.deselect();
				}
				for(var nn=0;nn<lines.length;nn++)
				{
					var line=lines[nn];
					line.deselect();
				}
			}
		}
		if(event.button==0)
		{
			if(selectangle!=null)
			{
				var maxx=parseInt(selectangle.getAttribute("width"))+parseInt(selectangle.getAttribute("x"));
				var minx=parseInt(selectangle.getAttribute("x"));
				var maxy=parseInt(selectangle.getAttribute("height"))+parseInt(selectangle.getAttribute("y"));
				var miny=parseInt(selectangle.getAttribute("y"));
				for(var ik=0;ik<dots.length;ik++)
				{
					var dot=dots[ik];
					var dotx=parseInt(dot.getAttribute("cx"));
					var doty=parseInt(dot.getAttribute("cy"));
					if(dotx<maxx && dotx>minx)
					{
						if(doty<maxy && doty>miny)
						{
							dot.select();
						}
					}
				}
				svg.removeChild(selectangle);
			}
			svg.onmousemove = null;
			selectangle = null;
		}
	};
};

document.addEventListener("keydown", keyDown, false);

function keyDown(e) {
		var keyCode = e.keyCode;
		switch (keyCode) {
			case 46:
				deletePressed();
				break;
			case 65:
				createLine();
				break;
		}
}

function createLine()
{
	var selectedDots=0;
	var dot1=null;
	var dot2=null;
	for(var io=0;io<dots.length;io++)
	{
		if(dots[io].isSelected())
		{
			selectedDots++;
			if(dot1==null)
			{
				dot1=dots[io];
				continue;
			}
			if(dot2==null)
			{
				dot2=dots[io];
				continue;
			}
			if(selectedDots==3)
			{
				return;
			}
		}
	}
	shapeFactory.createLine(dot1,dot2);
}

function deletePressed()
{
	var dot;
	var line;
	var tempDots=[];
	var tempLines=[];
	for(var ij=0;ij<dots.length;ij++)
	{
		dot=dots[ij];
		if(dot.isSelected())
		{
			removeShape(dot);
		}
		else 
		{
			tempDots.push(dot);
		}
	}
	for(var ip=0;ip<lines.length;ip++)
	{
		line=lines[ip];
		if(line.isSelected())
		{
			removeShape(line);
		}
		else
		{
			tempLines.push(line);
		}
	}
	lines=tempLines;
	dots=tempDots;
	svg.querySelector
}

function removeShape(shape)
{
	shape.deselect();
	svg.removeChild(shape);
}

function preventDefault(event)
{
	event.preventDefault ? event.preventDefault() : event.returnValue=false;
}

var shapeFactory={
	createLine:function(dot1,dot2)
	{
		var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		line.setAttribute("x1",dot1.getAttribute("cx"));
		line.setAttribute("y1",dot1.getAttribute("cy"));
		line.setAttribute("x2",dot2.getAttribute("cx"));
		line.setAttribute("y2",dot2.getAttribute("cy"));
		line.setAttribute("stroke","black");
		line.setAttribute("stroke-width",2);
		line.setAttribute("class","line");
		line.dot1=dot1;
		line.dot2=dot2;
		this.attachCommonHandlers(line);
		svg.appendChild(line);
		lines.push(line);
		dot1.deselect();
		dot2.deselect();
	},
	createCircle:function(event) 
	{
		var dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		dot.setAttribute("cx",event.clientX);
		dot.setAttribute("cy",event.clientY);
		dot.setAttribute("r",10);
		dot.setAttribute("stroke","black");
		dot.setAttribute("stroke-width",1);
		dot.setAttribute("fill","yellow");
		dot.setAttribute("fill-opacity",0);
		dot.setAttribute("selected","false");
		dot.setAttribute("highlit","false");
		dot.setAttribute("class","dot");
		this.attachCommonHandlers(dot);
		dot.onmousemove = function(event) {
			if(mousePressed.is && mousePressed.shape && mousePressed.shape.isSelected())
			{
				dragDots(event,this);
			}
		};
		svg.appendChild(dot);
		dots.push(dot);
	},
	attachCommonHandlers:function(shape) {
		shape.onmouseover = function() {
			highlight(this);
		};
		shape.onmouseout = function() {
			lowlight(this);
		};
		shape.select = function() {
			if(this.getClass()==="dot")
			{
				this.setAttribute("fill-opacity",0.5);
			}
			else if(this.getClass()==="line")
			{
				this.setAttribute("stroke","yellow");
			}
			this.setAttribute("selected","true");
		};
		shape.deselect = function() {
			if(this.getClass()==="dot")
			{
				this.setAttribute("fill-opacity",0);
			}
			else if(this.getClass()==="line")
			{
				this.setAttribute("stroke","black");
			}
			this.setAttribute("selected","false");
		};
		shape.isSelected = function() {
			return this.getAttribute("selected")==="true";
		};
		shape.toggleSelect = function() {
			var selected = this.isSelected();
			if(selected=="true") 
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
		shape.getClass = function(event)
		{
			return this.getAttribute("class");
		}
	}
}

function dragDots(event,shape) {
	event.stopPropagation();
	var dx=event.clientX-dragger.x;
	var dy=event.clientY-dragger.y;
	var dot;
	var x=0;
	var y=0;
	for(var ii=0;ii<dots.length;ii++)
	{
		dot=dots[ii];
		if(dot.isSelected())
		{
			x=parseInt(dot.getAttribute("cx"));
			y=parseInt(dot.getAttribute("cy"));
			var tempx=x+dx;
			var tempy=y+dy;
			dot.setAttribute("cx",tempx);
			dot.setAttribute("cy",tempy);
		}
	}
	dragger.x=event.clientX;
	dragger.y=event.clientY;
}

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

function mousePressedOnShape(event,shape) 
{
	event.stopPropagation();
	mousePressed.is=true;
	mousePressed.x=event.clientX;
	mousePressed.y=event.clientY;
	mousePressed.shape=shape;
	if(shape.getClass()==="dot")
	{
		dragger.x=mousePressed.x;
		dragger.y=mousePressed.y;
		dragger.handle=shape;
		svg.onmousemove = function(event) 
		{
			if(mousePressed.is && mousePressed.shape.isSelected())
			{
				dragDots(event);
			}
		};
	}
}

function mouseReleasedOnShape(event,shape) 
{
	event.stopPropagation();
	if(mousePressed.x==event.clientX && mousePressed.y==event.clientY)
	{
		shape.toggleSelect();
	}
	mousePressed.x=null;
	mousePressed.y=null;
	mousePressed.is=false;
	mousePressed.shape=null;
	svg.onmousemove = null;
}

function highlight(shape) 
{
	shape.setAttribute("stroke","green");
	shape.setAttribute("highlit","true");
}

function lowlight(shape) 
{
	if(shape.getClass()==="dot")
	{
		shape.setAttribute("stroke","black");
	} 
	else if(shape.getClass()==="line")
	{
		if(shape.isSelected())
		{
			shape.setAttribute("stroke","yellow");
		} else {
			shape.setAttribute("stroke","black");
		}
	}
	shape.setAttribute("highlit","false");
}
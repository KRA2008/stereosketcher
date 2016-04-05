'use strict';

var selectangle;

function changeSelectangle(event) {
	if(selectangle) {
		var x=parseFloat(selectangle.getAttribute("x"));
		var y=parseFloat(selectangle.getAttribute("y"));
		var width=parseFloat(selectangle.getAttribute("width"));
		var height=parseFloat(selectangle.getAttribute("height"));
		var ex=event.clientX;
		var ey=event.clientY;
		if(selectangle.originalX<ex) {
			selectangle.setAttribute("width",ex-x);
			selectangle.setAttribute("x",selectangle.originalX);
		} else {
			selectangle.setAttribute("width",selectangle.originalX-ex);
			selectangle.setAttribute("x",ex);
		}
		if(selectangle.originalY<ey) {
			selectangle.setAttribute("height",ey-y);
			selectangle.setAttribute("y",selectangle.originalY);
		} else {
			selectangle.setAttribute("height",selectangle.originalY-ey);
			selectangle.setAttribute("y",ey);
		}
	} else {
		createSelectangle(event);
	}
}

function createSelectangle(event) {
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

function releaseSelectangle(event) {
	if(selectangle) {
		var maxx=parseFloat(selectangle.getAttribute("width"))+parseFloat(selectangle.getAttribute("x"));
		var minx=parseFloat(selectangle.getAttribute("x"));
		var maxy=parseFloat(selectangle.getAttribute("height"))+parseFloat(selectangle.getAttribute("y"));
		var miny=parseFloat(selectangle.getAttribute("y"));
		var dots = getDots();
		if(!event.shiftKey) {
			deselectAll();
		}
		for(var ik=0;ik<dots.length;ik++) {
			var dot=dots[ik];
			var dotx=parseFloat(dot.getAttribute("cx"));
			var doty=parseFloat(dot.getAttribute("cy"));
			if(dotx<maxx && dotx>minx) {
				if(doty<maxy && doty>miny) {
					if(event.ctrlKey) {
						selectShapesOfDot(dot,event);
					} else {
						dot.select();
					}
				}
			}
		}
		svg.removeChild(selectangle);
		selectangle = null;
	}
}

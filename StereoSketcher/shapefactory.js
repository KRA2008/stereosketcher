'use strict';

var faceSpaceCorrection = "0.56px";
var faceActionStrokeWidth = 3.0;
var labelX = -15.0;
var labelY = -7.0;
var defaultLineThickness = 2.0;
var thickenRate = 0.5;
var dotRadius = 7.0;
var dotColor = "#000000";
var selectedColor = "#FFFF00";
var highlitColor = "#008800";
var strokeLinecap = "round";

var shapeFactory = {
	createCircle : function(event) {
		var dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		dot.setAttribute("cx", event.clientX);
		dot.setAttribute("cy", event.clientY);
		dot.setAttribute("r", dotRadius);
		dot.setAttribute("stroke", dotColor);
		dot.setAttribute("stroke-width", 1.0);
		dot.setAttribute("fill", selectedColor);
		dot.setAttribute("fill-opacity", 0);
		dot.setAttribute("class","dot");
		addClassToElement(dot, "highlit");
		this.attachCommonHandlers(dot);
		dot.ondblclick = function(event) {
			event.stopPropagation();
			editMode();
			if (wasAClick(event)) {
				selectAllContiguousDots(this, event);
			}
		};
		dot.lines = [];
		dot.shift = 0.0;
		var label = document.createElementNS("http://www.w3.org/2000/svg", "text");
		label.setAttribute("x", parseFloat(dot.getAttribute("cx")) + labelX);
		label.setAttribute("y", parseFloat(dot.getAttribute("cy")) + labelY);
		label.setAttribute("fill", dotColor);
		label.setAttribute("class", "label forwardEvents");
		label.textContent = "0";
		dot.label = label;
		dot.faces = [];
		labelGroup.appendChild(label);
		dotGroup.appendChild(dot);
		dot.select = function() {
			this.setAttribute("fill-opacity", 0.5);
			addClassToElement(this, "selected");
		};
		dot.deselect = function() {
			this.setAttribute("fill-opacity", 0);
			removeClassFromElement(this, "selected");
			if (this.isHighlit()) {
				this.highlight();
			}
		};
		dot.highlight = function() {
			this.setAttribute("stroke", highlitColor);
			this.label.setAttribute("fill", highlitColor);
			addClassToElement(this, "highlit");
		};
		dot.lowlight = function() {
			this.setAttribute("stroke", dotColor);
			this.label.setAttribute("fill", dotColor);
			removeClassFromElement(this, "highlit");
		};
		if(event.shiftKey) {
			dot.select();
		}
	},
	attachCommonHandlers : function(shape) {
		shape.onmouseenter = function() {
			editMode();
			this.highlight();
		};
		shape.onmouseout = function() {
			editMode();
			this.lowlight();
		};
		shape.isSelected = function() {
			return doesElementHaveClass(this, "selected");
		};
		shape.isHighlit = function() {
			return doesElementHaveClass(this,"highlit");
		};
		shape.toggleSelect = function() {
			if (this.isSelected()) {
				this.deselect();
			} else {
				this.select();
			}
		};
		shape.onmousedown = function(event) {
			editMode();
			preventDefault(event);
			if (event.button == 0) {
				pressX=event.clientX;
				pressY=event.clientY;
				prevX = pressX;
				prevY = pressY;
				if(doesElementHaveClass(this,"dot") && this.isSelected()) {
					event.stopPropagation();
					var dot;
					var dots = getDots();
					var selectedDots = [];
					for(var ii=0;ii<dots.length;ii++) {
						dot = dots[ii];
						if(dot.isSelected()) {
							selectedDots.push(dot);
						}
					}
					for(var jj=0;jj<selectedDots.length;jj++) {
						dot = selectedDots[jj];
						dotGroup.removeChild(dot);
						dotGroup.appendChild(dot);
					}
					this.onmousemove = function(event) {
						event.stopPropagation();
						dragDots(event,selectedDots);
					};
					svg.onmousemove = function(event) {
						event.stopPropagation();
						dragDots(event,selectedDots);
					};
				}
			}
		};
		shape.onmouseup = function(event) {
			editMode();
			if (event.button == 0) {
				event.stopPropagation();
				if(wasAClick(event)) {
					if(event.ctrlKey) {
						if(doesElementHaveClass(this,"dot")) {
							selectShapesOfDot(this,event);
						} else if (doesElementHaveClass(this,"face")) {
							selectDotsOfFace(this,event);
						} else if (doesElementHaveClass(this,"line")) {
							selectDotsOfLine(this,event);
						}
					} else {
						if(event.shiftKey) {
							this.toggleSelect();
						} else {
							var wasSelected;
							if(this.isSelected()) {
								wasSelected=true;
							}
							deselectAll();
							if(wasSelected) {
								this.deselect();
							} else {
								this.select();
							}
						}
					}
				}
				svg.onmousemove = null;
				this.onmousemove = null;
				this.onmouseout = function() {
					this.lowlight();
				};
			}
		};
	},
	createLine : function(dot1, dot2) {
		var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		line.setAttribute("x1", dot1.getAttribute("cx"));
		line.setAttribute("y1", dot1.getAttribute("cy"));
		line.setAttribute("x2", dot2.getAttribute("cx"));
		line.setAttribute("y2", dot2.getAttribute("cy"));
		line.color = picker.value;
		line.setAttribute("stroke", picker.value);
		line.setAttribute("stroke-width", defaultLineThickness);
		line.opacity = 1.0;
		line.setAttribute("stroke-opacity",1.0);
		line.setAttribute("class","line");
		line.dot1 = dot1;
		line.dot2 = dot2;
		dot1.lines.push(line);
		dot2.lines.push(line);
		this.attachCommonHandlers(line);
		dot1.deselect();
		dot2.deselect();
		line.ondblclick = function(event) {
			event.stopPropagation();
			editMode();
			selectAllContiguousShapes(this,event);
		};
		line.setAttribute("stroke-linecap", strokeLinecap);
		this.createCloneLine(line);
		shapeGroup.appendChild(line);
		line.overlaps = [];
		
		line.select = function() {
			editMode();
			this.setAttribute("stroke", selectedColor);
			addClassToElement(this, "selected");
		};
		line.deselect = function() {
			this.setAttribute("stroke", this.color);
			removeClassFromElement(this, "selected");
			if (this.isHighlit()) {
				this.highlight();
			}
		};
		line.highlight = function() {
			this.setAttribute("stroke", highlitColor);
			addClassToElement(this, "highlit");
		};
		line.lowlight = function() {
			removeClassFromElement(this, "highlit");
			if (this.isSelected()) {
				this.setAttribute("stroke", selectedColor);
			} else {
				this.setAttribute("stroke", this.color);
			}
		};
		line.thicken = function() {
			var thickness = parseFloat(this.getAttribute("stroke-width"));
			this.setAttribute("stroke-width",thickness+thickenRate);
			this.clone.setAttribute("stroke-width",thickness+thickenRate);
		};
		line.thin = function() {
			var thickness = parseFloat(this.getAttribute("stroke-width"));
			if(thickness>thickenRate) {
				this.setAttribute("stroke-width",thickness-thickenRate);
				this.clone.setAttribute("stroke-width",thickness-thickenRate);
			}
		};
		line.add = function() {
			shapeGroup.appendChild(this.clone);
			shapeGroup.appendChild(this);
		};
		line.remove = function() {
			shapeGroup.removeChild(this);
			shapeGroup.removeChild(this.clone);
			removeOverlapsOfItem(this);
		};
		line.delete = function() {
			this.dot1.lines.splice(this.dot1.lines.indexOf(this),1);
			this.dot2.lines.splice(this.dot2.lines.indexOf(this),1);
			this.remove();
		}
	},
	createCloneLine : function(line) {
		var clone = document.createElementNS("http://www.w3.org/2000/svg", "line");
		line.clone = clone;
		clone.setAttribute("x1", parseFloat(line.dot1.getAttribute("cx")) + IPD + line.dot1.shift*shiftSpeed);
		clone.setAttribute("y1", line.dot1.getAttribute("cy"));
		clone.setAttribute("x2", parseFloat(line.dot2.getAttribute("cx")) + IPD + line.dot2.shift*shiftSpeed);
		clone.setAttribute("y2", line.dot2.getAttribute("cy"));
		clone.setAttribute("stroke", picker.value);
		clone.setAttribute("stroke-width", defaultLineThickness);
		clone.setAttribute("stroke-opacity",1.0);
		clone.setAttribute("class","cloneLine");
		clone.setAttribute("stroke-linecap", strokeLinecap);
		shapeGroup.appendChild(clone);
		if(mode==3)
		{
			clone.setAttribute("visibility","hidden");
		}
	},
	createFace : function(dot1, dot2, dot3) {
		var face = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
		var under = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
		var coords = "";
		dot1.faces.push(face);
		dot2.faces.push(face);
		dot3.faces.push(face);
		coords += dot1.getAttribute("cx") + "," + dot1.getAttribute("cy") + " ";
		coords += dot2.getAttribute("cx") + "," + dot2.getAttribute("cy") + " ";
		coords += dot3.getAttribute("cx") + "," + dot3.getAttribute("cy") + " ";
		dot1.deselect();
		dot2.deselect();
		dot3.deselect();
		face.dot1 = dot1;
		face.dot2 = dot2;
		face.dot3 = dot3;
		face.setAttribute("points", coords);
		under.setAttribute("points", coords);
		face.under = under;
		face.color = picker.value;
		face.setAttribute("fill", picker.value);
		face.opacity = 1.0;
		face.setAttribute("fill-opacity",1.0);
		face.setAttribute("class", "face");
		under.setAttribute("fill", picker.value);
		under.setAttribute("stroke", picker.value);
		under.setAttribute("stroke-width", faceSpaceCorrection);
		under.setAttribute("stroke-opacity", 1.0);
		under.setAttribute("fill-opacity",1.0);
		under.setAttribute("class", "faceUnder");
		this.attachCommonHandlers(face);
		face.ondblclick = function(event) {
			event.stopPropagation();
			editMode();
			selectAllContiguousShapes(this,event);
		};
		this.createCloneFace(face);
		shapeGroup.appendChild(under);
		shapeGroup.appendChild(face);
		face.overlaps = [];
		face.select = function() {
			editMode();
			this.setAttribute("stroke-width", faceActionStrokeWidth);
			this.setAttribute("stroke", selectedColor);
			addClassToElement(this, "selected");
		};
		face.deselect = function() {
			this.setAttribute("stroke-width", 0);
			removeClassFromElement(this, "selected");
			if (this.isHighlit()) {
				this.highlight();
			}
		};
		face.highlight = function() {
			this.setAttribute("stroke", highlitColor);
			this.setAttribute("stroke-width", faceActionStrokeWidth);
			addClassToElement(this, "highlit");
		};
		face.lowlight = function() {
			removeClassFromElement(this, "highlit");
			if (this.isSelected()) {
				this.setAttribute("stroke", selectedColor);
			} else {
				this.setAttribute("stroke-width", 0);
			}
		};
		face.add = function() {
			shapeGroup.appendChild(this.clone.under);
			shapeGroup.appendChild(this.clone);
			shapeGroup.appendChild(this.under);
			shapeGroup.appendChild(this);
		};
		face.remove = function() {
			shapeGroup.removeChild(this.clone.under);
			shapeGroup.removeChild(this.clone);
			shapeGroup.removeChild(this.under);
			shapeGroup.removeChild(this);
			removeOverlapsOfItem(this);
		};
		face.delete = function() {
			this.dot1.faces.splice(this.dot1.faces.indexOf(this),1);
			this.dot2.faces.splice(this.dot2.faces.indexOf(this),1);
			this.dot3.faces.splice(this.dot3.faces.indexOf(this),1);
			this.remove();
		};
	},
	createCloneFace : function(face) {
		var clone = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
		var under = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
		face.clone = clone;
		var coords = "";
		coords += parseFloat(face.dot1.getAttribute("cx")) + IPD + face.dot1.shift*shiftSpeed + "," + face.dot1.getAttribute("cy") + " ";
		coords += parseFloat(face.dot2.getAttribute("cx")) + IPD + face.dot2.shift*shiftSpeed + "," + face.dot2.getAttribute("cy") + " ";
		coords += parseFloat(face.dot3.getAttribute("cx")) + IPD + face.dot3.shift*shiftSpeed + "," + face.dot3.getAttribute("cy") + " ";
		clone.setAttribute("points", coords);
		under.setAttribute("points", coords);
		clone.under = under;
		clone.setAttribute("class", "cloneFace");
		clone.setAttribute("stroke-width", 0);
		clone.setAttribute("fill", picker.value);
		clone.setAttribute("fill-opacity",1.0);
		under.setAttribute("fill", picker.value);
		under.setAttribute("fill-opacity",1.0);
		under.setAttribute("stroke", picker.value);
		under.setAttribute("stroke-width", faceSpaceCorrection);
		under.setAttribute("stroke-opacity", 1.0);
		under.setAttribute("class", "cloneUnder");
		shapeGroup.appendChild(under);
		shapeGroup.appendChild(clone);
		if(mode==3)
		{
			clone.setAttribute("visibility","hidden");
			clone.under.setAttribute("visibility","hidden");
		}
	}
}
'use strict';

var faceSpaceCorrection = "0.5px";
var faceActionStrokeWidth = 3.0;
var labelX = -15.0;
var labelY = -7.0;
var defaultLineThickness = 2.0;
var thickenRate = 0.5;
var dotRadius = 8.0;
var dotColor = "#000000";
var selectedColor = "#FFFF00";
var highlitColor = "#008800";
var strokeLinecap = "round";
var highlit = "highlit";
var selected = "selected";

var shapeFactory = {
	createDot : function(x,y) {
		var dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		dot.setAttribute("cx", x);
		dot.setAttribute("cy", y);
		dot.setAttribute("r", dotRadius);
		dot.setAttribute("stroke", dotColor);
		dot.setAttribute("stroke-width", 1.0);
		dot.setAttribute("fill", selectedColor);
		dot.setAttribute("fill-opacity", 0);
		dot.setAttribute("class","dot");
		addClassToElement(dot, highlit);
		this.attachCommonHandlers(dot);
		dot.doubleHandler = function(event) {
			if (wasAClick(event)) {
				selectAllContiguousDots(this, event);
			}
		};
		dot.lines = [];
		var shift = 0.0;
		var label = document.createElementNS("http://www.w3.org/2000/svg", "text");
		label.setAttribute("x", parseFloat(dot.getAttribute("cx")) + labelX);
		label.setAttribute("y", parseFloat(dot.getAttribute("cy")) + labelY);
		label.setAttribute("fill", dotColor);
		label.setAttribute("class", "label forwardEvents");
		label.textContent = "0";
		dot.label = label;
		dot.faces = [];
		dot.images = [];
		dot.bases = [];
		labelGroup.appendChild(label);
		dotGroup.appendChild(dot);
		dot.select = function() {
			this.setAttribute("fill-opacity", 0.5);
			addClassToElement(this, selected);
		};
		dot.deselect = function() {
			this.setAttribute("fill-opacity", 0);
			removeClassFromElement(this, selected);
			if (this.isHighlit()) {
				this.highlight();
			}
		};
		dot.highlight = function() {
			this.setAttribute("stroke", highlitColor);
			this.label.setAttribute("fill", highlitColor);
			addClassToElement(this, highlit);
		};
		dot.lowlight = function() {
			this.setAttribute("stroke", dotColor);
			this.label.setAttribute("fill", dotColor);
			removeClassFromElement(this, highlit);
		};
		dot.getShift = function() {
			return shift;
		}
		dot.getX = function() {
			return parseFloat(this.getAttribute("cx"));
		}
		dot.getY = function() {
			return parseFloat(this.getAttribute("cy"));
		}
		dot.getZ = function() {
			return this.getShift()*equivalence*shiftSpeed;
		}
		dot.setShift = function(newShift) {
			shift = newShift; //TODO what is this line?
			this.label.textContent = newShift;
			return this;
		};
		return dot;
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
			return doesElementHaveClass(this, selected);
		};
		shape.isHighlit = function() {
			return doesElementHaveClass(this,highlit);
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
			if (event.button == 0 || event.button == 2) {
				pressX=event.clientX;
				pressY=event.clientY;
				prevX = pressX;
				prevY = pressY;
				if(doesElementHaveClass(this,"dot")) {
					event.stopPropagation();
					var dot;
					var dots = getDots();
					var selectedDots = [];
					for(var ii=0;ii<dots.length;ii++) {
						dot = dots[ii];
						if(dot.isSelected() && this != dot) {
							selectedDots.push(dot);
						}
					}
					selectedDots.push(this);
					for(var jj=0;jj<selectedDots.length;jj++) {
						dot = selectedDots[jj];
						dotGroup.removeChild(dot);
						dotGroup.appendChild(dot);
					}
					if(event.button == 0) {
						this.onmousemove = function(event) {
							if(!this.isSelected()) {
								if(!event.shiftKey) {
									deselectAll();
									selectedDots = [this];
								}
								this.select();
							}
							event.stopPropagation();
							snapDots(selectedDots,false,event,0);
							snapDots(dots,true);
						};
						svg.onmousemove = function(event) {
							event.stopPropagation();
							snapDots(selectedDots,false,event,0);
							snapDots(dots,true);
						};
					} else if(event.button == 2){
						this.onmousemove = function(event) {
							event.stopPropagation();
							snapDots(selectedDots,false,event,2);
							snapDots(dots,true);
						};
						svg.onmousemove = function(event) {
							event.stopPropagation();
							snapDots(selectedDots,false,event,2);
							snapDots(dots,true);
						};
					}
				}
			}
		};
		shape.onmouseup = function(event) {
			editMode();
			if (event.button == 0) {
				if(event.detail == 2) {
					shape.doubleHandler(event);
				} else if(wasAClick(event)) {
					if(event.ctrlKey) {
						if(doesElementHaveClass(this,"dot")) {
							if(!event.shiftKey) {
								deselectAll();
							}
							selectShapesOfDot(this,event);
						} else if (doesElementHaveClass(this,"line")) {
							if(!event.shiftKey) {
								deselectAll();
							}
							selectDotsOfLine(this,event);
						} else {
							if(!event.shiftKey) {
								deselectAll();
							}
							selectDotsOfFaceImageOrBase(this,event);
						}
					} else {
						if(event.shiftKey) {
							this.toggleSelect();
						} else {
							deselectAll();
							this.select();
						}
					}
				}
				event.stopPropagation();
				this.onmouseout = function() {
					this.lowlight();
				};
			} else if (event.button == 2 && wasAClick(event)) {
				if(doesElementHaveClass(this,"dot")) {
					this.select();
					createLinePressed();
					event.stopPropagation();
				}
			}
			stopDots();
		};
	},
	createLine : function(dot1, dot2) {
		dot1.deselect();
		dot2.deselect();
		var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		line.color = picker.value;
		line.setAttribute("stroke", picker.value);
		line.setAttribute("stroke-width", defaultLineThickness);
		line.storedOpacity = 1.0;
		line.setAttribute("stroke-opacity",1.0);
		line.setAttribute("class","line");
		line.dot1 = dot1;
		line.dot2 = dot2;
		dot1.lines.push(line);
		dot2.lines.push(line);
		this.attachCommonHandlers(line);
		line.doubleHandler = function(event) {
			selectAllContiguousShapes(this,event);
		};
		line.setAttribute("stroke-linecap", strokeLinecap);
		this.createCloneLine(line);
		line.overlaps = [];
		
		line.select = function() {
			editMode();
			this.setAttribute("stroke", selectedColor);
			addClassToElement(this, selected);
		};
		line.deselect = function() {
			this.setAttribute("stroke", this.color);
			removeClassFromElement(this, selected);
			if (this.isHighlit()) {
				this.highlight();
			}
		};
		line.highlight = function() {
			this.setAttribute("stroke", highlitColor);
			addClassToElement(this, highlit);
		};
		line.lowlight = function() {
			removeClassFromElement(this, highlit);
			if (this.isSelected()) {
				this.select();
			} else {
				this.setAttribute("stroke", this.color);
			}
		};
		line.thicken = function() {
			var thickness = parseFloat(this.getAttribute("stroke-width"));
			this.setThickness(thickness+thickenRate);
		};
		line.thin = function() {
			var thickness = parseFloat(this.getAttribute("stroke-width"));
			if(thickness>thickenRate) {
				this.setThickness(thickness-thickenRate);
			}
		};
		line.setThickness = function(thickness) {
			this.setAttribute("stroke-width",thickness);
			this.clone.setAttribute("stroke-width",thickness);
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
		};
		line.setColor = function(color) {
			this.color=color;
			this.setAttribute("stroke",color);
			this.clone.setAttribute("stroke",color);
		};
		line.getOpacity = function() {
			return parseFloat(this.getAttribute("stroke-opacity"));
		};
		line.setOpacity = function(opacity) {
			var parsed = parseFloat(opacity); //backward compatibility for old bug
			this.setAttribute("stroke-opacity",parsed);
			this.clone.setAttribute("stroke-opacity",parsed);
		};
		
		line.add();
		snapDots(getDots(),true);
		
		return line;
	},
	createCloneLine : function(line) {
		var clone = document.createElementNS("http://www.w3.org/2000/svg", "line");
		line.clone = clone;
		clone.setAttribute("stroke", picker.value);
		clone.setAttribute("stroke-width", defaultLineThickness);
		clone.setAttribute("stroke-opacity",1.0);
		clone.setAttribute("class","cloneLine");
		clone.setAttribute("stroke-linecap", strokeLinecap);
		if(mode==3)
		{
			clone.setAttribute("visibility","hidden");
		}
	},
	createFace : function(dots) {
		var face = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
		for(var ii=0;ii<dots.length;ii++) {
			var dot = dots[ii];
			dot.deselect();
			dot.faces.push(face);
		}
		face.dots = Array.prototype.slice.call(dots);
		var under = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
		face.under = under;
		face.color = picker.value;
		face.setAttribute("fill", picker.value);
		face.storedOpacity = 1.0;
		face.setAttribute("fill-opacity",1.0);
		face.setAttribute("class", "face");
		face.setAttribute("stroke-width", 0);
		under.setAttribute("fill", picker.value);
		under.setAttribute("stroke", picker.value);
		under.setAttribute("stroke-width", faceSpaceCorrection);
		under.setAttribute("stroke-opacity", 1.0);
		under.setAttribute("fill-opacity",1.0);
		under.setAttribute("class", "faceUnder");
		this.attachCommonHandlers(face);
		face.doubleHandler = function(event) {
			selectAllContiguousShapes(this,event);
		};
		this.createCloneFace(face);
		face.overlaps = [];
		face.select = function() {
			editMode();
			this.setAttribute("stroke-width", faceActionStrokeWidth);
			this.setAttribute("stroke", selectedColor);
			addClassToElement(this, selected);
		};
		face.deselect = function() {
			this.setAttribute("stroke-width", 0);
			removeClassFromElement(this, selected);
			if (this.isHighlit()) {
				this.highlight();
			}
		};
		face.highlight = function() {
			this.setAttribute("stroke", highlitColor);
			this.setAttribute("stroke-width", faceActionStrokeWidth);
			addClassToElement(this, highlit);
		};
		face.lowlight = function() {
			removeClassFromElement(this, highlit);
			if (this.isSelected()) {
				this.select();
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
			var dots = this.dots;
			for(var ii=0;ii<dots.length;ii++) {
				dots[ii].faces.splice(this.dots[ii].faces.indexOf(this),1);
			}
			this.remove();
		};
		face.setColor = function(color) {
			this.color=color;
			this.setAttribute("fill",color);
			this.clone.setAttribute("fill",color);
			this.under.setAttribute("fill",color);
			this.clone.under.setAttribute("fill",color);
			this.under.setAttribute("stroke",color);
			this.clone.under.setAttribute("stroke",color);
		};
		face.getOpacity = function() {
			return parseFloat(this.getAttribute("fill-opacity"));
		};
		face.setOpacity = function(opacity) {
			var parsed = parseFloat(opacity); // backward compatibility for old bug
			this.setAttribute("fill-opacity",parsed);
			this.under.setAttribute("fill-opacity",parsed);
			this.clone.setAttribute("fill-opacity",parsed);
			this.clone.under.setAttribute("fill-opacity",parsed);
			
			var mathedOpacity = 1.2*parsed*parsed-0.2*parsed;
			this.under.setAttribute("stroke-opacity",mathedOpacity);
			this.clone.under.setAttribute("stroke-opacity",mathedOpacity);
		};
		
		face.add();
		snapDots(getDots(),true);
		
		return face;
	},
	createCloneFace : function(face) {
		var clone = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
		var under = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
		face.clone = clone;
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
		if(mode==3)
		{
			clone.setAttribute("visibility","hidden");
			clone.under.setAttribute("visibility","hidden");
		}
	},
	createImage: function(dots,imageObject,asBase) {
		var image = document.createElementNS("http://www.w3.org/2000/svg", "image");
		if(!asBase) {
			for(var ii=0;ii<dots.length;ii++) {
				dots[ii].deselect();
				dots[ii].images.push(image);
			}
		} else {
			for(var ii=0;ii<dots.length;ii++) {
				dots[ii].deselect();
				dots[ii].bases.push(image);
			}
		}
		image.setAttribute("x",0);
		image.setAttribute("y",0);
		image.setAttribute("width",imageObject.width);
		image.setAttribute("height",imageObject.height);
		image.setAttribute("opacity",1.0);
		image.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', imageObject.src);
		
		if(!asBase) {
			image.setAttribute("class","image");
		} else {
			image.setAttribute("class","base");
		}
		
		image.dots = dots;
		image.indicator = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
		if(!asBase) {
			image.indicator.setAttribute("points",makePolygonPointString(dots,false));
		} else {
			image.indicator.setAttribute("points",makeBoxFromTwoPointsString(dots,false));
		}
		image.indicator.setAttribute("fill-opacity",0);
		
		shapeGroup.appendChild(image.indicator);
		shapeGroup.appendChild(image);
		
		if(!asBase) {
			this.createCloneImage(image,imageObject);
		}
		
		image.onclick = function(event) {
			event.preventDefault();
		};
		image.select = function() {
			this.indicator.setAttribute("stroke-width","5");
			this.indicator.setAttribute("stroke",selectedColor);
			addClassToElement(this,selected);
		};
		image.deselect = function() {
			this.indicator.setAttribute("stroke-width","0");
			removeClassFromElement(this,selected);
		};
		image.highlight = function() {
			this.indicator.setAttribute("stroke-width","5");
			this.indicator.setAttribute("stroke",highlitColor);
			addClassToElement(this,highlit);
		};
		image.lowlight = function() {
			if(doesElementHaveClass(this,selected)) {
				this.select();
			} else {
				this.indicator.setAttribute("stroke-width","0");
			}
			removeClassFromElement(this,highlit);
		};
		image.delete = function() {
			var dots = this.dots;
			if(doesElementHaveClass(this,"image")) {
				for(var ii=0;ii<dots.length;ii++) {
					dots[ii].images.splice(this.dots[ii].images.indexOf(this),1);
				}
			} else {
				for(var ii=0;ii<dots.length;ii++) {
					dots[ii].bases.splice(this.dots[ii].bases.indexOf(this),1);
				}
			}
			this.remove();
		};
		image.remove = function() {
			shapeGroup.removeChild(this.indicator);
			if(!doesElementHaveClass(this,"base")) {
				shapeGroup.removeChild(this.clone);
			}
			shapeGroup.removeChild(this);
		};
		image.add = function() {
			shapeGroup.appendChild(this.indicator);
			if(!doesElementHaveClass(this,"base")) {
				shapeGroup.appendChild(this.clone);
			}
			shapeGroup.appendChild(this);
		}
		image.doubleHandler = function(event) {
			selectAllContiguousShapes(this,event);
		};
		image.getOpacity = function() {
			return parseFloat(this.getAttribute("opacity"));
		};
		image.setOpacity = function(opacity) {
			var parsed = parseFloat(opacity); //backward compatibility for old bug
			this.setAttribute("opacity",parsed);
			if(!doesElementHaveClass(this,"base")) {
				this.clone.setAttribute("opacity",parsed);
			}
		};
		this.attachCommonHandlers(image);
		image.add();
		snapDots(getDots(),true);
		
		return image;
	},
	createCloneImage: function(firstImage,imageObject) {		
		var clone = document.createElementNS("http://www.w3.org/2000/svg", "image");
		clone.setAttribute("x",0);
		clone.setAttribute("y",0);
		clone.setAttribute("width",imageObject.width);
		clone.setAttribute("height",imageObject.height);
		clone.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', imageObject.src);
		clone.setAttribute("class","imageClone");
		firstImage.clone = clone;
	}
}

function stopDots() {
	svg.onmousemove = null;
	var dots = getDots();
	for(var ii=0;ii<dots.length;ii++) {
		dots[ii].onmousemove = null;
	}
	removeMarker();
	removeAnchors();
}

function createLinePressed(event) {
	var selectedDots=0;
	var dot1;
	var dot2;
	var dots = getDots();
	for(var io=0;io<dots.length;io++) {
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
	if(selectedDots!=2) {
		return;
	}
	var lines = getLines();
	var line;
	for(var ii=0;ii<lines.length;ii++) {
		line = lines[ii];
		if((line.dot1 == dot1 || line.dot2 == dot1) && (line.dot1 == dot2 || line.dot2 == dot2)) {
			return;
		}
	}
	shapeFactory.createLine(dot1,dot2,event);
}

function createFacePressed(event) {
	var candidateDots = getDots();
	var candidateDot;
	var selectedDots = [];
	for(var ii=0;ii<candidateDots.length;ii++) {
		candidateDot = candidateDots[ii];
		if(candidateDot.isSelected()) {
			selectedDots.push(candidateDot);
		}
	}
	if(selectedDots.length < 3) {
		return;
	}
	shapeFactory.createFace(selectedDots);
}

function deletePressed() {
	var dot;
	var dots = getDots();
	for(var ii=dots.length-1;ii>=0;ii--) {
		dot=dots[ii];
		if(dot.isSelected()) {
			labelGroup.removeChild(dot.label);
			dotGroup.removeChild(dot);
		}
	}
	var line;
	var lines=getLines();
	for(var ii=lines.length-1;ii>=0;ii--) {
		line=lines[ii];
		if(line.isSelected() || line.dot1.isSelected() || line.dot2.isSelected()) {
			line.delete();
		}
	}
	
	deletePressedImagesOrFaces(getFaces());
	deletePressedImagesOrFaces(getImages());
	deletePressedImagesOrFaces(getBases());
	
	snapDots(getDots(),true);
}

function deletePressedImagesOrFaces(imagesOrFaces) {
	var imageOrFace;
	for (var ii=imagesOrFaces.length-1;ii>=0;ii--) {
		imageOrFace=imagesOrFaces[ii];
		if(imageOrFace.isSelected()) {
			imageOrFace.delete();
			continue;
		}
		var dots = imageOrFace.dots;
		for(var jj=0;jj<dots.length;jj++) {
			if(dots[jj].isSelected()) {
				imageOrFace.delete();
				break;
			}
		}
	}
}

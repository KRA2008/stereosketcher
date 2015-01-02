'use strict';

var shiftSpeed = 0.5;
var originalIPD=250.0;
var IPD=originalIPD;

function shiftIn() {
	var dots = getDots();
	var dot;
	for(var ii=0;ii<dots.length;ii++) {
		dot = dots[ii];
		if(dot.isSelected()) {
			dot.shift++;
			dot.label.textContent = dot.shift;
		}
	}
	refresh();
}

function shiftOut() {
	var dots = getDots();
	var dot;
	for(var ii=0;ii<dots.length;ii++) {
		dot = dots[ii];
		if(dot.isSelected()) {
			dot.shift--;
			dot.label.textContent = dot.shift;
		}
	}
	refresh();
}

function moveSelectedToBack() {
	deselectAllDots();
    var selected = getSelected();
    while(selected.length>0) {
	    var element = selected[0];
	    element.remove();
	    shapeGroup.insertBefore(element,shapeGroup.firstChild);
	    shapeGroup.insertBefore(element.clone,shapeGroup.firstChild);
	    if(element.under) {
	            shapeGroup.insertBefore(element.under,shapeGroup.firstChild);
	            shapeGroup.insertBefore(element.clone.under,shapeGroup.firstChild);
	    }
	    element.lowlight();
	    element.deselect();
	    selected = getSelected();
    }
}

function moveSelectedToFront() {		
	deselectAllDots();
    var selected = getSelected();
    while(selected.length>0) {
	    var element = selected[0];
	    element.remove();
	    element.add();
	    element.lowlight();
	    element.deselect();
	    selected = getSelected();
    }
}

function moveSelectedThroughLayers(forward) {
	deselectAllDots();
	var selected = getSelected();
	var thingToMove;
	var linesAndFaces;
	var marker;
	var remainder = [];
	var temp;
	while(selected.length>0) {
		thingToMove = selected[0];
		remainder = [];
		linesAndFaces = getLinesAndFaces();
		for(var ii=0;ii<linesAndFaces.length;ii++) {
			marker = linesAndFaces[ii];
			if(marker === thingToMove) {
				if(forward) {
					if(linesAndFaces.length==ii) {
						thingToMove.deselect();
						return;
					}
					marker = linesAndFaces[ii+1];
				} else {
					if(0==ii) {
						thingToMove.deselect();
						return;
					}
					marker = linesAndFaces[ii-1];
					remainder.push(marker);
				}
				for(;ii<linesAndFaces.length;ii++) {
					remainder.push(linesAndFaces[ii]);
				}
				if(remainder.length>1) {
					temp = remainder[0];
					remainder[0] = remainder[1];
					remainder[1] = temp;
					var restacked;
					for(var jj=0;jj<remainder.length;jj++) {
						restacked = remainder[jj];
						restacked.remove();
						restacked.add();
					}
				}
				break;
			}
		}
		if(!forward) {
			thingToMove.lowlight();
		}
		thingToMove.deselect();
		selected = getSelected();
	}
}
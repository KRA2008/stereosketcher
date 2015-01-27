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
    var linesAndFaces = getLinesAndFaces();
    var removed = [];
    var item;
    var startLength = linesAndFaces.length;
    for(var ii=startLength-1;ii>=0;ii--) {
	    item = linesAndFaces[ii];
	    if(item.isSelected()) {
		    item.remove();
		    removed.push(item);
	    }
    }
    for(var jj=0;jj<removed.length;jj++) {
    	item = removed[jj];
	    shapeGroup.insertBefore(item,shapeGroup.firstChild);
	    shapeGroup.insertBefore(item.clone,shapeGroup.firstChild);
	    if(item.under) {
	            shapeGroup.insertBefore(item.under,shapeGroup.firstChild);
	            shapeGroup.insertBefore(item.clone.under,shapeGroup.firstChild);
	    }
	    item.lowlight();
    }
}

function moveSelectedToFront() {
    var linesAndFaces = getLinesAndFaces();
    var removed = [];
    var item;
    var startLength = linesAndFaces.length;
    for(var ii=startLength-1;ii>=0;ii--) {
    	item = linesAndFaces[ii];
    	if(item.isSelected()) {
		    item.remove();
		    removed.push(item);
    	}
    }
    for(var jj=removed.length-1;jj>=0;jj--) {
    	item = removed[jj];
    	item.add();
    	item.lowlight();
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
'use strict';

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

function moveSelectedOneForward() {
	moveSelectedOneLayer(true);
}

function moveSelectedOneBack() {
	moveSelectedOneLayer(false);
}

function moveSelectedOneLayer(forward) {
	var linesAndFaces = getLinesAndFaces();
	var item;
	var next;
	if(forward) {
		linesAndFaces.reverse();
	}
    for(var ii=0;ii<linesAndFaces.length;ii++) {
    	item = linesAndFaces[ii];
    	next = linesAndFaces[ii+1];
    	if(ii+1<linesAndFaces.length && next.isSelected() && !item.isSelected()) {
    		linesAndFaces[ii] = next;
    		linesAndFaces[ii+1] = item;
    	}
    }
    if(forward) {
    	linesAndFaces.reverse();
    }
    var reordered = linesAndFaces.slice(0);
    for(var jj=0;jj<reordered.length;jj++) {
    	item = reordered[jj];
    	item.add();
    	item.lowlight();
    }
}

function invertLayering() {
    var linesAndFaces = getLinesAndFaces();
    var item;
    for (var ii = 0; ii < linesAndFaces.length; ii++) {
        item = linesAndFaces[ii];
        item.remove();
    }
    linesAndFaces.reverse();
    for (var ii = 0; ii < linesAndFaces.length; ii++) {
        item = linesAndFaces[ii];
        item.add();
    }
}
'use strict';

function moveSelectedToBack() {
    var shapes = getShapes();
    var removed = [];
    var item;
    var startLength = shapes.length;
    for(var ii=startLength-1;ii>=0;ii--) {
	    item = shapes[ii];
	    if(item.isSelected()) {
		    item.remove();
		    removed.push(item);
	    }
    }
    for(var jj=0;jj<removed.length;jj++) {
    	item = removed[jj];
	    shapeGroup.insertBefore(item,shapeGroup.firstChild);
	    if(item.clone) {
	    	shapeGroup.insertBefore(item.clone,shapeGroup.firstChild);
	    }
	    if(item.under) {
	            shapeGroup.insertBefore(item.under,shapeGroup.firstChild);
	            shapeGroup.insertBefore(item.clone.under,shapeGroup.firstChild);
	    }
	    if(item.indicator) {
	            shapeGroup.insertBefore(item.indicator,shapeGroup.firstChild);
	    }
	    item.lowlight();
    }
}

function moveSelectedToFront() {
    var shapes = getShapes();
    var removed = [];
    var item;
    var startLength = shapes.length;
    for(var ii=startLength-1;ii>=0;ii--) {
    	item = shapes[ii];
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
	var shapes = getShapes();
	var item;
	var next;
	if(forward) {
		shapes.reverse();
	}
    for(var ii=0;ii<shapes.length;ii++) {
    	item = shapes[ii];
    	next = shapes[ii+1];
    	if(ii+1<shapes.length && next.isSelected() && !item.isSelected()) {
    		shapes[ii] = next;
    		shapes[ii+1] = item;
    	}
    }
    if(forward) {
    	shapes.reverse();
    }
    var reordered = shapes.slice(0);
    for(var jj=0;jj<reordered.length;jj++) {
    	item = reordered[jj];
    	item.add();
    	item.lowlight();
    }
}

function invertLayering() {
    var shapes = getShapes();
    var item;
    for (var ii = 0; ii < shapes.length; ii++) {
        item = shapes[ii];
        item.remove();
    }
    shapes.reverse();
    for (var ii = 0; ii < shapes.length; ii++) {
        item = shapes[ii];
        item.add();
    }
}
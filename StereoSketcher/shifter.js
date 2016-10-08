'use strict';

var IPD = 0;
var buffer = 30;
var cloneSpeed = 5;

function shiftOut() {
	var dots = getDots();
	var dot;
	var moved = [];
	for (var ii = 0; ii < dots.length; ii++) {
		dot = dots[ii];
		if (dot.isSelected()) {
			dot.setShift(dot.getShift() + 1);
			moved.push(dot);
		}
	}
	snapDots(moved, false);
}

function shiftIn() {
	var dots = getDots();
	var dot;
	var moved = [];
	for (var ii = 0; ii < dots.length; ii++) {
		dot = dots[ii];
		if (dot.isSelected()) {
			dot.setShift(dot.getShift() - 1);
			moved.push(dot);
		}
	}
	snapDots(moved, false);
}

function clonesRight() {
	moveClones(true);
}

function clonesLeft() {
	moveClones(false)
}

function moveClones(right) {
	if (mode != 3) {
		if (right) {
			buffer += cloneSpeed;
		} else {
			buffer -= cloneSpeed;
		}
		snapDots(getDots(), true);
	}
}

function findSketchWidth() {
	var dots = getDots();
	var dot;
	var maxX;
	var minX;
	var width;
	var dotX;
	var dot;
	var bases = getBases();
	if (bases.length != 0) {
		buffer = 0;
		var x1 = bases[0].dots[0].getAttribute("cx");
		var x2 = bases[0].dots[1].getAttribute("cx");
		return (x2 - x1) / 2;
	}
	if (dots[0]) {
		maxX = parseFloat(dots[0].getAttribute("cx"));
		minX = maxX;
		for (var ii = 1; ii < dots.length; ii++) {
			dot = dots[ii];
			if (dot.lines.length === 0 && dot.faces.length === 0 && dot.images.length === 0) {
				continue;
			}
			dotX = parseFloat(dot.getAttribute("cx"));
			if (dotX > maxX) {
				maxX = dotX;
			} else if (dotX < minX) {
				minX = dotX;
			}
		}
		return maxX - minX;
	} else {
		return 0;
	}
}

function findIPD() {
	switch(mode) {
		case 1:
			IPD = findSketchWidth() + buffer;
			return;
		case 2:
			IPD = (findSketchWidth() + buffer) * -1;
			return;
		case 3:
			IPD = 0;
			return;
	}
}

function invertShift() {
	var dots = getDots();
	var dot
	var shifted = [];
	for (var ii = 0; ii < dots.length; ii++) {
		dot = dots[ii];
		if (dot.isSelected()) {
			dot.setShift(dot.getShift() * -1);
			shifted.push(dot);
		}
	}
	snapDots(shifted);
}
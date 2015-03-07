'use strict';

var shiftSpeed = 0.5;
var originalIPD=250.0;
var IPD=originalIPD;
var cloneSpeed = 5;

function shiftOut() {
	var dots = getDots();
	var dot;
	var moved = [];
	for(var ii=0;ii<dots.length;ii++) {
		dot = dots[ii];
		if(dot.isSelected()) {
			dot.shift++;
			dot.label.textContent = dot.shift;
			moved.push(dot);
		}
	}
	snapDots(moved);
}

function shiftIn() {
	var dots = getDots();
	var dot;
	var moved = [];
	for(var ii=0;ii<dots.length;ii++) {
		dot = dots[ii];
		if(dot.isSelected()) {
			dot.shift--;
			dot.label.textContent = dot.shift;
			moved.push(dot);
		}
	}
	snapDots(moved);
}

function clonesRight() {
	moveClones(true);
}

function clonesLeft() {
	moveClones(false)
}

function moveClones(right) {
	if(mode!=3) {
		if(right) {
			IPD+=cloneSpeed;
		} else {
			IPD-=cloneSpeed;
		}
		snapDots(getDots());
	}
}

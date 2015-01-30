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
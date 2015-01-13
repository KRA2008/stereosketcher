'use strict';

function magicEyeMode() {
	mode=2;
	var label=document.getElementById("modeLabel");
	label.innerHTML = "parallel";
	IPD=originalIPD*-1.0;
	editMode(true);
	restoreAllOpacity();
}

function redCyanMode() {
	mode=3;
	var label=document.getElementById("modeLabel");
	label.innerHTML = "red/cyan";
	IPD=0.0;
	editMode(true);
	stowAllOpacity();
}

function crossEyeMode() {
	mode=1;
	var label=document.getElementById("modeLabel");
	label.innerHTML = "cross";
	IPD=originalIPD;
	editMode(true);
	restoreAllOpacity();
}

function editMode(force) {
	if(!isEditMode || force)	{
		if(mode==3) {
			hideClones();
		} else {
			showClones();
		}
		removeOverlaps();
		showDots();
		isEditMode = true;
		refresh();
	}
}

function viewMode() {
	if(mode==3) {
		addOverlaps();
		showClones();
	}
	hideDots();
	isEditMode = false;
	refresh();
}

function toggleEditView() {
	if(isEditMode) {
		viewMode();
	} else {
		editMode();
	}
}

function showDots() {
	var label = document.getElementById("modeLabel");
	label.setAttribute("visibility","visible");
	var dots = getDots();
	var dot;
	for(var ii=0;ii<dots.length;ii++) {
		dot = dots[ii];
		dot.setAttribute("visibility","visible");
		dot.label.setAttribute("visibility","visible");
	}
}

function hideDots() {
	deselectAll();
	var label = document.getElementById("modeLabel");
	label.setAttribute("visibility","hidden");
	var dots = getDots();
	var dot;
	for(var ii=0;ii<dots.length;ii++) {
		dot = dots[ii];
		dot.setAttribute("visibility","hidden");
		dot.label.setAttribute("visibility","hidden");
	}
}
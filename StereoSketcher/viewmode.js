'use strict';

function magicEyeMode() {
	mode=2;
	setViewModeIndicator();
	findIPD();
	editMode(true);
	restoreAllOpacity();
}

function redCyanMode() {
	mode=3;
	setViewModeIndicator();
	findIPD();
	editMode(true);
	stowAllOpacity();
}

function crossEyeMode() {
	mode=1;
	setViewModeIndicator();
	findIPD();
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
		deselectAll();
		removeOverlaps();
		showDots();
		isEditMode = true;
		snapDots(getDots(),true);
	}
}

function setViewModeIndicator() {
	var cross=document.getElementById("cross");
	var parallel=document.getElementById("parallel");
	var redcyan=document.getElementById("redcyan");
	cross.setAttribute("class","gray");
	parallel.setAttribute("class","gray");
	redcyan.setAttribute("class","gray");
	switch(mode) {
		case 1:
			cross.setAttribute("class","black");
			break;
		case 2:
			parallel.setAttribute("class","black");
			break;
		case 3:
			redcyan.setAttribute("class","black");
			break;
	}
}

function viewMode() {
	if(mode==3) {
		addOverlaps();
		showClones();
	}
	hideDots();
	isEditMode = false;
	snapDots(getDots(),true);
}

function toggleEditView() {
	if(!loading) {
		if(isEditMode) {
			viewMode();
		} else {
			editMode();
		}
	}
}

function showDots() {
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
	var dots = getDots();
	var dot;
	for(var ii=0;ii<dots.length;ii++) {
		dot = dots[ii];
		dot.setAttribute("visibility","hidden");
		dot.label.setAttribute("visibility","hidden");
	}
}
'use strict';

var mode=1;

function magicEyeMode() {
	setMode(2);
}

function redCyanMode() {
	setMode(3);
}

function crossEyeMode() {
	setMode(1);
}

function setMode(newMode) {
	mode = newMode;
	setViewModeIndicator();
	findIPD();
	editMode(true);
	if(mode == 3) {
		stowAllOpacity();
		stowImages();
	} else {
		restoreAllOpacity();
		restoreImages();
	}
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

function viewMode(noLoading) {
	if(mode==3) {
		if(noLoading) {
			// don't waste time here, we'll do it later. go look.
		} else {
			addOverlaps();
			showClones();
		}
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
	var dots = getDots();
	var dot;
	for(var ii=0;ii<dots.length;ii++) {
		dot = dots[ii];
		dot.setAttribute("visibility","hidden");
		dot.label.setAttribute("visibility","hidden");
	}
}
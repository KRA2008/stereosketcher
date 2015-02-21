'use strict';

function addClassToElement(element,className) {
	var old = element.getAttribute("class");
	if(old == null) {
		element.setAttribute("class","");
		old = "";
	}
	if(!doesElementHaveClass(element,className)) {
		element.setAttribute("class",old+" "+className);
	}
}

function removeClassFromElement(element,className) {
	var re = new RegExp("(?:^|\\s)"+className+"(?!\\S)","g");
	var old = element.getAttribute("class");
	if(old == null) {
		element.setAttribute("class","");
		return;
	}
	element.setAttribute("class",old.replace(re,''));
}

function doesElementHaveClass(element,className) {
	var re = new RegExp("(?:^|\\s)"+className+"(?!\\S)","");
	var currentClass = element.getAttribute("class");
	if(currentClass == null || currentClass == "") {
		return false;
	}
	var matched = element.getAttribute("class").match(re);
	if(matched == null)	{
		return false;
	} else {
		return true;
	}
}
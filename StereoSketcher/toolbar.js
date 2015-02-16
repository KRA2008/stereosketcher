var toolWidth = 30;
var barY = 300;
var toolBorder = 2;
var toolMargin = 5;

var toolSets = [
	new toolSet(
		[
			new tool('1',crossEyeMode,'cross.png','cross eye view mode'),
			new tool('2',magicEyeMode,'parallel.png','parallel eye view mode'),
			new tool('3',redCyanMode,'redcyan.png','red/cyan view mode')
		]
	),
	new toolSet(
		[
			new tool('q',moveSelectedToBack,'toback.png','move selected lines and faces to back layer'),
			new tool('w',moveSelectedOneBack,'backward.png','move selected lines and faces one layer backward'),
			new tool('e',moveSelectedOneForward,'forward.png','move selected lines and faces one layer forward'),
			new tool('r',moveSelectedToFront,'tofront.png','move selected lines and faces to front layer')
		]
	),
	new toolSet(
		[
			new tool('t',clonesLeft,'cloneleft.png','move clones left'),
			new tool('y',clonesRight,'cloneright.png','move clones right')
		]
	),
	new toolSet(
		[
			new tool('a',shiftOut,'shiftout.png','shift dots out of screen'),
			new tool('s',shiftIn,'shiftin.png','shift dots into screen'),
		]
	),
	new toolSet(
		[
			new tool('d',createLinePressed,'line.png','create line between two selected dots'),
			new tool('f',createFacePressed,'face.png','create face between three selected dots')
		]
	),
	new toolSet(
		[
			new tool('z',thinLines,'thinner.png','make selected lines thinner'),
			new tool('x',thickenLines,'thicker.png','make selected lines thicker')
		]
	),
	new toolSet(
		[
			new tool('c',transluce,'transluce.png','make selected lines and faces less opaque'),
			new tool('v',opace,'opaque.png','make selected lines and faces more opaque')
		]
	),
	new toolSet(
		[
			new tool('delete',deletePressed,'delete.png','remove selected dots, lines, and faces')
		]
	),
	new toolSet(
		[
			new tool('spacebar',toggleEditView,'hidedots.png','toggle dots/display mode')
		]
	)
];

function toolSet(tools) {
	this.tools = tools;
}

function tool(key,action,image,description) {
	this.key = key;
	this.action = action;
	this.description = description;
	this.image = image;
}

function buildToolBar() {
	var toolSet;
	var tool;
	var toolButton;
	var toolTip;
	var toolPattern;
	var toolImage;
	for(var ii=0;ii<toolSets.length;ii++) {
		var toolSet = toolSets[ii].tools;
		for(var jj=0;jj<toolSet.length;jj++) {
			tool = toolSet[jj];
						
			toolPattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
			toolPattern.setAttribute("id",tool.image);
			toolPattern.setAttribute("height",toolWidth+1000);
			toolPattern.setAttribute("width",toolWidth+1000);
			toolPattern.setAttribute("patternUnits","userSpaceOnUse");
			toolImage = document.createElementNS("http://www.w3.org/2000/svg", "image");
			toolImage.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href','tools/'+tool.image);
			toolImage.setAttribute("x",jj*toolWidth+toolMargin*(jj+1));
			toolImage.setAttribute("y",toolMargin*(ii+1)+toolWidth*(ii));
			toolImage.setAttribute("height",toolWidth);
			toolImage.setAttribute("width",toolWidth);
			toolPattern.appendChild(toolImage);
			defs.appendChild(toolPattern);
			
			toolButton = document.createElementNS("http://www.w3.org/2000/svg", "rect");
			toolButton.setAttribute("x",jj*toolWidth+toolMargin*(jj+1));
			toolButton.setAttribute("y",toolMargin*(ii+1)+toolWidth*(ii));
			toolButton.setAttribute("width",toolWidth);
			toolButton.setAttribute("height",toolWidth);
			toolButton.setAttribute("stroke","#000000");
			toolButton.setAttribute("stroke-width",toolBorder+"px");
			toolButton.setAttribute("fill","url(#"+tool.image+")");
			toolGroup.appendChild(toolButton);
			
			toolTip = document.createElementNS("http://www.w3.org/2000/svg", "text");
			toolTip.setAttribute("class","toolTip");
			toolTip.textContent = "("+tool.key+") "+tool.description;
			toolTip.setAttribute("x",toolMargin);
			toolTip.setAttribute("y",toolMargin*(toolSets.length)+toolWidth*(toolSets.length)+toolWidth/2);
			addClassToElement(toolTip,"hidden");
			toolGroup.appendChild(toolTip);
			
			toolButton.tip = toolTip;
			toolButton.tool = tool;
			tool.toolButton = toolButton;
			
			toolButton.onmouseenter = function() {
				this.setAttribute("stroke","green");
				removeClassFromElement(this.tip,"hidden");
			}		
			toolButton.onmouseout = function() {
				this.setAttribute("stroke","black");
				addClassToElement(this.tip,"hidden");
			}
			toolButton.onmousedown = function(event) {
				event.stopPropagation();
			}
			toolButton.onmouseup = function(event) {
				event.stopPropagation();
			}
			toolButton.onclick = function(event) {
				event.stopPropagation();
				this.tool.action();
			}
		}
	}
}

function mapKeyPress(event) {
	var keyCode = event.keyCode;
	var character = String.fromCharCode(keyCode).toLowerCase();
	if(character === ' ') character = "spacebar";
	if(character === '.') character = "delete";
	var toolset;
	var tool;
	for(var ii=0;ii<toolSets.length;ii++) {
		toolSet = toolSets[ii].tools;
		for(var jj=0;jj<toolSet.length;jj++) {
			tool = toolSet[jj];
			if(tool.key === character) {
				tool.toolButton.setAttribute("stroke","green");
				tool.action();
			}
		}
	}
}

function keyReleased() {
	var toolset;
	var tool;
	for(var ii=0;ii<toolSets.length;ii++) {
		toolSet = toolSets[ii].tools;
		for(var jj=0;jj<toolSet.length;jj++) {
			toolSet[jj].toolButton.setAttribute("stroke","black");
		}
	}
}
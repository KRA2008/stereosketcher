'use strict';
var imageToSend;

function startUploadingShit()
{
	hideDots();
	saveSvgAsPng(document.getElementById("svg"), 1);
	showDots();
}

function callbacksAreFuckingStupid() 
{
	setSuccessDisplay(false,"Uploading image...");
	var params="image="+encodeURIComponent(imageToSend)+"&album=HTD2v8UUS3zApIz";
	
	var ajax = new XMLHttpRequest();
	ajax.open("POST","https://api.imgur.com/3/image",true);
	ajax.setRequestHeader("Authorization", "Client-ID 1070461d2c44f9f");
	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	ajax.onload = function(e) {
		if(ajax.readyState === 4) {
			if(ajax.status === 200) {
				var response = JSON.parse(ajax.responseText);
				setSuccessDisplay(true,"Success!",response.data.link);
			}
			else
			{
				setSuccessDisplay(false,"Upload failed.");
			}
		}
	}
	ajax.onerror = function (e) {
		setSuccessDisplay(false,"Upload failed.");
	}
	ajax.send(params);
}

function setSuccessDisplay(success,text,link)
{
	var resultDisplay = document.getElementById("uploadResult");
	if(success)
	{
		resultDisplay.innerHTML = "<a target='none' href='"+link+"'>"+text+"</a>"
	}
	else
	{
		resultDisplay.innerHTML = text;
	}
}

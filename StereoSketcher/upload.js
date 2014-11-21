'use strict';
var imageToSend;

function uploadGo() 
{
	hideDots();
	saveSvgAsPng(document.getElementById("svg"), 1);
	showDots();
	
	var formData = new FormData();
	formData.append("image",imageToSend);
	formData.append("album","HTD2v8UUS3zApIz");
	
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			alert("success: "+xmlhttp.responseText);
		} 
		else 
		{
			alert("fail: "+xmlhttp.responseText);
		}
	}
	xmlhttp.open("POST","https://api.imgur.com/3/image",true);
	xmlhttp.setRequestHeader("Authorization","Client-ID 1070461d2c44f9f");
	xmlhttp.send();
}

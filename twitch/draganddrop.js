"use strict";

function drag()
{
	document.getElementById('emoteDropArea').parentNode.className = "draging dragBox";
}

function drop()
{
	document.getElementById('emoteDropArea').parentNode.className = "dragBox";
}

var loadFile = function(event) 
{
    var reader = new FileReader();
	var imgs = document.getElementsByTagName("img");
	reader.onload = function()
	{
		for(var i=0, l=imgs.length; i<l; i++) 
		{	
			imgs[i].src = reader.result;	
		}
	};
    reader.readAsDataURL(event.target.files[0]);
};
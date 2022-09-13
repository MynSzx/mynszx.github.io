const imgUrl = "https://img.pokemondb.net/sprites/ruby-sapphire/normal/";
const gen4ImgUrl = "https://img.pokemondb.net/sprites/diamond-pearl/normal/"
var loadingDiv = null;

function ShowLoading(state)
{
	if (state)
	{
		if (loadingDiv == null)
		{
			loadingDiv = document.createElement('div');
			loadingDiv.classList.add('loading');
			var text = document.createTextNode("Loading..");
			loadingDiv.appendChild(text);
			document.body.appendChild(loadingDiv) 
		}
	}
	else 
	{
		loadingDiv.remove();
		loadingDiv = null;
	}
}

function loadJSON(callback) 
{
	ShowLoading(true);
	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', 'https://raw.githubusercontent.com/MynSzx/mynszx.github.io/main/evorecords.json', true);
	xobj.onreadystatechange = function () 
	{
		if (xobj.readyState == 4 && xobj.status == "200") 
		{
			callback(xobj.responseText);
		}
	}
	xobj.send(null);
}

var genStart = 2869;
var genEnd = 7447;
var listDivs = [];

function changeGeneration()
{
	switch(document.getElementById("gens").value)
	{
		case "generation1": 
			genStart = 0;
			genEnd = 811;
			break;
		case "generation2": 
			genStart = 812;
			genEnd = 2868;
			break;
		case "generation3": 
			genStart = 2869;
			genEnd = 7447;
			break;
		case "generation4": 
			genStart = 7448;
			genEnd = 14784
			break;
		default: break;
	}
	loadJSON(readJSON);
}
// gen 1 : 0 - 811
// gen 2 : 812 - 2868
// gen 3 : 2869 - 7447
// gen 4 : 7448 - 14784
function readJSON(response)
{
	ClearCards();
	ShowLoading(true);
	
	var json = JSON.parse(response);
	
	var currentPokemon = "";
	var previousPokemon = "";

	var previousTarget = "";
	var target = "";
	
	const pokemons = new Map();
	
	var valuesPerPokemons = [];
	
	for	(i = genStart; i < genEnd; i++)
	{
		currentPokemon = json["rows"][i]["basepokemon"];
		target = json["rows"][i]["vanillatarget"];
		listIdentifier = currentPokemon + "@" + target;
		if (!pokemons.has(listIdentifier))
		{
			valuesPerPokemons[listIdentifier] = "";
			pokemons.set(listIdentifier, "");
			//pokemons[listIdentifier] = "";
			
			let flipCard = document.createElement('div');
			let flipCardInner = document.createElement('div')
			let flipCardFront = document.createElement('div')
			let flipCardBack = document.createElement('div')
			let flipCardBackText = document.createElement('div')

			// assign classes
			flipCard.classList.add('flip-card');
			flipCard.id = currentPokemon.toLowerCase();
			flipCardInner.classList.add('flip-card-inner');
			flipCardFront.classList.add('flip-card-front');
			flipCardBack.classList.add('flip-card-back');
			flipCardBackText.classList.add('flip-card-back-text');
				
			// divs trees
			flipCard.appendChild(flipCardInner);
			flipCardInner.appendChild(flipCardFront);
			flipCardInner.appendChild(flipCardBack);
			flipCardBack.appendChild(flipCardBackText);

			// main pokemon image
			var image = document.createElement("img");
			if (json["rows"][i]["basedex"] > 386)
			{

				if (currentPokemon == "Mime Jr.")
					image.src = "https://img.pokemondb.net/sprites/diamond-pearl/normal/mime-jr.png";
				else
					image.src = gen4ImgUrl + currentPokemon.toLowerCase() + ".png";
			}
			else
			{
				image.src = imgUrl + currentPokemon.toLowerCase() + ".png";
			}
			
			
			image.width = 84;	
			image.height = 84;
			flipCardFront.appendChild(image);
				
			const stoneEvol = currentPokemon.includes("Eevee") || currentPokemon.includes("Gloom") || currentPokemon.includes("Slowpoke") || currentPokemon.includes("Poliwhirl") || currentPokemon.includes("Wurmple") || currentPokemon.includes("Tyrogue") || currentPokemon.includes("Clamperl") || (currentPokemon.includes("Kirlia") && genEnd > 7448) || (currentPokemon.includes("Snorunt") && genEnd > 7448) || currentPokemon.includes("Burmy") || currentPokemon.includes("Nincada");
				
			// yes?
			if (stoneEvol && target != null)
			{
				flipCard.id = currentPokemon.toLowerCase() + "TO" + target.toLowerCase();
				// special evo
				var imageArrow = document.createElement("img");
				imageArrow.src = "arrow.png";
				imageArrow.width = 16;
				imageArrow.height = 84;
				flipCardFront.appendChild(imageArrow);
			
				var imageSpecial = document.createElement("img");
				
				if (json["rows"][i]["vanilladex"] > 386)
				{
					if (target == "Wormadam (Sandy Cloak)")
						imageSpecial.src = "https://img.pokemondb.net/sprites/bank/normal/wormadam-sandy.png";
					else imageSpecial.src = gen4ImgUrl + target.toLowerCase() + ".png";
				}
				else
				{
					imageSpecial.src = imgUrl + target.toLowerCase() + ".png";
				}
				
				//imageSpecial.src = imgUrl + target.toLowerCase() + ".png";
				imageSpecial.width = 84;
				imageSpecial.height = 84;
				flipCardFront.appendChild(imageSpecial);
			}			
			
			document.body.appendChild(flipCard) 
		}
		valuesPerPokemons[currentPokemon + "@" + target] += json["rows"][i]["targetpokemon"] + "-" + json["rows"][i]["percent"] + ",";		
	}	
		
	var divs = document.getElementsByClassName('flip-card');
	for (const [key, value] of pokemons.entries()) 
	{
		currentPokemon = key.split('@')[0];
		const stoneEvol = currentPokemon.includes("Eevee") || currentPokemon.includes("Gloom") || currentPokemon.includes("Slowpoke") || currentPokemon.includes("Poliwhirl") || currentPokemon.includes("Wurmple") || currentPokemon.includes("Tyrogue") || currentPokemon.includes("Clamperl") || (currentPokemon.includes("Kirlia") && genEnd > 7448) || (currentPokemon.includes("Snorunt") && genEnd > 7448) || currentPokemon.includes("Burmy") || currentPokemon.includes("Nincada");
		
		var theDiv = null;
		
		if (!stoneEvol)
		{
			theDiv = document.getElementById(key.split('@')[0].toLowerCase());
			//console.log("Looking for : " + key.split('@')[0].toLowerCase());
		}
		else
		{
			theDiv = document.getElementById(key.split('@')[0].toLowerCase() + "TO" + key.split('@')[1].toLowerCase());
			//console.log("Looking for : " + key.split('@')[0].toLowerCase() + "TO" + key.split('@')[1].toLowerCase());
		}
		//console.log(theDiv);
		
		
		var theVal = valuesPerPokemons[key].split(',');

		var evoList = [];
		var percList = [];
		for	(v = 0; v < theVal.length; v++)
		{
			if (theVal[v] == "") break;			
			var pokemon = theVal[v].split('-')[0];
			var perc = parseFloat(theVal[v].split('-')[1]);
			if (theVal[v].includes("Porygon-Z"))
			{
				pokemon = theVal[v].split('-')[0] + theVal[v].split('-')[1];
				perc = parseFloat(theVal[v].split('-')[2]);
			}	
			evoList.push(pokemon);
			percList.push(perc);
		}
		Bubble(percList, evoList);
		for (k = 0; k < evoList.length; k++)
		{
			let pDiv = document.createElement('p');
			var pokemon = theVal[v].split('-')[0];
			var perc = parseFloat(theVal[v].split('-')[1]);

			var text = document.createTextNode(evoList[k] + " - " + percList[k].toFixed(5) + "%");
			pDiv.appendChild(text);
			
			theDiv.lastElementChild.lastElementChild.lastElementChild.appendChild(pDiv);		
		}
		
	}
	for (i = 0; i < divs.length; i++) 
	{
		listDivs.push(divs.item(i));
		divs[i].style = "";
	}
	ShowLoading(false);
}
	
function Filter(el)
{
	for (i = 0; i < listDivs.length; i++) 
	{
		if (listDivs[i].id[0] != el.id && el.id != 0) listDivs[i].style = "display: none;";
		else listDivs[i].style = "";
	}
}

function Bubble(perc, evo)
{
	var done = false;
	while (!done) 
	{
		done = true;
		for (var i = 1; i < perc.length; i += 1) 
		{
			if (perc[i - 1] < perc[i]) 
			{
				done = false;
				var tmp = perc[i - 1];
				var tmp2 = evo[i - 1];
				
				perc[i - 1] = perc[i];
				evo[i-1] = evo[i];
				
				perc[i] = tmp;
				evo[i] = tmp2;
			}
		}
	}
}

function ClearCards()
{
	if (listDivs.length > 0)
	{
		for (i = 0; i < listDivs.length; i++) { listDivs[i].remove(); }
	}
}

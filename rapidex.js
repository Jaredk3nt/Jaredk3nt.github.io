/* TODO :
    -add client side caching of pokemon they look up in a session so if they re-look them up it doesn't have to make extranious calls to the backend (web-storage)
    store: localstorage.setItem('key', JSON.stringify({name: 'value'}));
    get: JSON.parse(localStorage.getItem('key')).name;
    -set up JSON objects for each pokemon for storage
    {name: 'name', id: '', type: 'type', img: 'url'}
    
    -add section for what types they are good against
    
    -some double pokemon show types they aren't weak against due to having types that are resistant to something as well as the other being weak to it, the algorithm needs to be expanded to include these
    
    
    UI UPDATE NOTES
    Type colors :
    
*/

var xmlhttp = new XMLHttpRequest();
var baseurl = "http://pokeapi.co/api/v2/pokemon/";

function pokeSearch() {
    //grab the pokemon they search for
    var pokemon = document.getElementById("searchBar").value.lowerFirstLetter();
    var currentShowing = document.getElementById("pokeName").innerHTML.lowerFirstLetter();
    //test if they are re-searching for whats already there
    //prevent another api call
    if (pokemon === currentShowing) {
        //keep the current showing
    } else {
        
        console.log("no currently showing or diff");
        document.getElementById("pokeDisplay").style.display = "none";
        document.getElementById("errorState").style.display = "none";
        document.getElementById("loader").style.display = "block";
        //make the full URL based on search
        var url = baseurl.concat(pokemon);
        url = url.concat("/");
        console.log("begin request");
        xmlhttp.open("GET", url, true);
        xmlhttp.onload = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                var json = JSON.parse(xmlhttp.responseText);
                console.log("end request");
                pokeDisplay(json);
            } else {
                document.getElementById("errorMessage").innerHTML = pokemon + " can't be found!";
                document.getElementById("loader").style.display = "none";
                document.getElementById("errorState").style.display = "block";
                console.error(xmlhttp.statusText);
            }
        };
        xmlhttp.send();
    }
}

//placing the data into the page
function pokeDisplay(json) {
    var name = json.name.capitalizeString();
    var weaknesses = "";
    
    //var urls = [];
    var formattedTypes = [];
    //place information we already have
    document.getElementById("pokeDisplay").style.display = "block";
    document.getElementById("pokeName").innerHTML = name;
    console.log(json.id < 10);
    if(json.id < 10) {
        document.getElementById("pokeID").innerHTML = "#00" + json.id;
    } else if (json.id < 100) {
        document.getElementById("pokeID").innerHTML = "#0" + json.id;
    } else {
        document.getElementById("pokeID").innerHTML = "#" + json.id;
    }
    
    document.getElementById("pokeImg").src = json.sprites.front_default;
    document.getElementById("type1").style.display = "none";
    document.getElementById("type2").style.display = "none";
    document.getElementById("weaknesses").innerHTML = "";
    
    console.log(json.id);
    showRegion(json.id);

    var types = [];
    //create an array of type names for finding weaknesses and display
    for (i = 0; i < json.types.length; i++) {
        types.push(json.types[i].type.name);
    }
    document.getElementById("weakTitle").style.visibility = "visible";
    localType(types);

    document.getElementById("loader").style.display = "none";
    
}

function localType(pTypes) {
    var allWeaknesses = [];
    for (i = 0; i < pTypes.length; i++) {
        var color;
        for (j = 0; j < typeJSON.types.length; j++) {
            var type = typeJSON.types[j];
            if (pTypes[i] === type.name) {
                color = type.color;
                for (k = 0; k < type.effects.weak_to.length; k++) {
                    allWeaknesses.push(type.effects.weak_to[k]);
                }
            }
        }
        if(i === 0) {
            var type = document.getElementById("type2");
            type.style.display = "block";
            type.innerHTML = pTypes[i];
            type.style.background = color;
        } else {
            var type = document.getElementById("type1");
            type.style.display = "block";
            type.innerHTML = pTypes[i];
            type.style.background = color;
        }
        
    }
    displayTypeWeaknesses(allWeaknesses);
}

function displayTypeWeaknesses(weaknesses) {
    var alreadyDisplayed = [];
    var pokeWeak = document.getElementById("weaknesses");
    for (i = 0; i < weaknesses.length; i++) {
        var found = false;
        for (j = 0; j < alreadyDisplayed.length; j++) {
            if (alreadyDisplayed[j] === weaknesses[i]) {
                found = true;
                break;
            }
        }
        if (!found) {
            alreadyDisplayed.push(weaknesses[i]);
            pokeWeak.innerHTML += weaknesses[i];
            if (!(i === weaknesses.length - 1)) {
                pokeWeak.innerHTML += "  ";
            }
        }
        
    }
}

function showRegion(id) {
    console.log("in region: " + id);
    var regionHolder = document.getElementById("region");
    var regionName = "";
    if (id < 152){
        regionName = regionNames[0];
    } else if (152 <= id && id < 252) {
        regionName = regionNames[1];
    } else if (252 <= id && id < 387) {
        regionName = regionNames[2];
    } else if (387 <= id && id < 494) {
        regionName = regionNames[3];
    } else if (494 <= id && id < 650) {
        regionName = regionNames[4];
    } else {
        regionName = regionNames[5];
    }
    regionHolder.innerHTML = regionName.capitalizeString();
    regionHolder.innerHTML += " REGION";
}

window.onload = function () {
    document.getElementById("searchButton").addEventListener("click", pokeSearch);
    document.getElementById("searchBar").addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            pokeSearch();
        }
    });
};

String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.lowerFirstLetter = function () {
    return this.charAt(0).toLowerCase() + this.slice(1);
};

String.prototype.capitalizeString = function () {
    var capString = "";
    for (i = 0; i < this.length; i++){
        capString += this.charAt(i).toUpperCase();
    }
    return capString;
};

var regionNames = ["Kanto", "Johto", "Hoenn", "Sinnoh", "Unova", "Kalos"];
/*
normal: #aaa
    fighting: #C25942
    flying: #B3BAE6
    poison: #A246E8
    ground: #D19F41
    rock: #946715
    bug: #92B368
    ghost: #291B3B
    steel: #DBDBDB
    fire: #F2452E
    water: #6B9DED
    grass: #94DB76
    electric: #E8E83F
    psychic: #E23FE8
    ice: #AAFAF2
    dragon: #032B63
    dark: #1D2024
    fairy: #F7B5EE
*/
var typeJSON = {"types": [{"name": "normal", "color": "#aaa", "effects": {"weak_to": ["fighting"], "resistant_to":[],"immune_to":["ghost"]}},
{"name":"fighting", "color": "#C25942", "effects":{"weak_to":["flying","psychic","fairy"],"resistant_to":["rock","bug","dark"],"immune_to":[]}},
{"name":"flying", "color": "#B3BAE6", "effects":{"weak_to":["rock","electric","ice"],"resistant_to":["fighting","bug","grass"],"immune_to":["ground"]}},
{"name":"poison", "color": "#A246E8", "effects":{"weak_to":["ground","psychic"],"resistant_to":["fighting","poison","bug","grass","fairy"],"immune_to":[]}},
{"name":"ground", "color": "#D19F41", "effects":{"weak_to":["water","grass","ice"],"resistant_to":["poison","rock"],"immune_to":["electric"]}},
{"name":"rock", "color": "#946715", "effects":{"weak_to":["fighting","ground","steel","water","grass"],"resistant_to":["normal","flying","poison","fire"],"immune_to":[]}},
{"name":"bug", "color": "#92B368", "effects":{"weak_to":["flying","rock","fire"],"resistant_to":["fighting","ground","grass"],"immune_to":[]}},
{"name":"ghost", "color": "#291B3B", "effects":{"weak_to":["ghost","dark"],"resistant_to":["poison","bug"],"immune_to":["normal","fighting"]}},
{"name":"steel", "color": "#DBDBDB", "effects":{"weak_to":["fighting","ground","fire"],"resistant_to":["normal","flying","rock","bug","steel","grass","psychic","ice","dragon","fairy"],"immune_to":["poison"]}},
{"name":"fire", "color": "#F2452E", "effects":{"weak_to":["ground","rock","water"],"resistant_to":["bug","steel","fire","grass","ice","fairy"],"immune_to":[]}},
{"name":"water", "color": "#6B9DED", "effects":{"weak_to":["grass","electric"],"resistant_to":["steel","fire","water","ice"],"immune_to":[]}},
{"name":"grass", "color": "#94DB76", "effects":{"weak_to":["flying","poison","bug","fire","ice"],"resistant_to":["ground","water","grass","electric"],"immune_to":[]}},
{"name":"electric", "color": "#E8E83F", "effects":{"weak_to":["ground"],"resistant_to":["flying","steel","electric"],"immune_to":[]}},
{"name":"psychic", "color": "#E23FE8", "effects":{"weak_to":["bug","ghost","dark"],"resistant_to":["fighting","psychic"],"immune_to":[]}},
{"name":"ice", "color": "#AAFAF2", "effects":{"weak_to":["fighting","rock","steel","fire"],"resistant_to":["ice"],"immune_to":[]}},
{"name":"dragon", "color": "#032B63", "effects":{"weak_to":["ice","dragon","fairy"],"resistant_to":["fire","water","grass","electric"],"immune_to":[]}},
{"name":"dark", "color": "#1D2024", "effects":{"weak_to":["fighting","bug","fairy"],"resistant_to":["ghost","dark"],"immune_to":["psychic"]}},
{"name":"fairy", "color": "F7B5EE", "effects":{"weak_to":["poison","steel"],"resistant_to":["fighting","bug","dark"],"immune_to":["dragon"]}}]};
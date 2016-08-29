/* TODO :
    *-add a check to not re-call pokeSearch if the name of the pokemon hasn't changed so spamming the button doesn't make multiple calls to the backend
    
    -add client side caching of pokemon they look up in a session so if they re-look them up it doesn't have to make extranious calls to the backend (web-storage)
    store: localstorage.setItem('key', JSON.stringify({name: 'value'}));
    get: JSON.parse(localStorage.getItem('key')).name;
    -set up JSON objects for each pokemon for storage
    {name: 'name', id: '', type: 'type', img: 'url'}
    
    -add section for what types they are good against
    
    *-remove overlapping types on pokemon weakness
    
    -some double pokemon show types they aren't weak against due to having types that are resistant to something as well as the other being weak to it, the algorithm needs to be expanded to include these
    
    
    UI UPDATE NOTES
    grey : #b7b7b7
    pick a color for all types
    make the top bar resize? look vs usabiltiy
    USE ALL CAPS ON ERRYTHING
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
        document.getElementById("pokeDisplay").style.display = "none";
        document.getElementById("errorDisplay").style.display = "none";
        document.getElementById("loader").style.display = "block";
        //make the full URL based on search
        var url = baseurl.concat(pokemon);
        url = url.concat("/");

        xmlhttp.open("GET", url, true);
        xmlhttp.onload = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                var json = JSON.parse(xmlhttp.responseText);
                pokeDisplay(json);
            } else {
                document.getElementById("errorMessage").innerHTML = pokemon + " can't be found!";
                document.getElementById("loader").style.display = "none";
                document.getElementById("errorDisplay").style.display = "block";
                console.error(xmlhttp.statusText);
            }
        };
        xmlhttp.send();
    }
}

//placing the data into the page
function pokeDisplay(json) {
    var name = json.name.capitalizeFirstLetter();
    var weaknesses = "";
    
    //var urls = [];
    var formattedTypes = [];
    //place information we already have
    document.getElementById("pokeDisplay").style.display = "block";
    document.getElementById("pokeName").innerHTML = name;
    document.getElementById("pokeID").innerHTML = "#" + json.id;
    document.getElementById("pokeImg").src = json.sprites.front_default;
    document.getElementById("pokeType").innerHTML = "";
    document.getElementById("pokeWeak").innerHTML = "";
    
    console.log(json.id);
    showRegion(json.id);

    var types = [];
    //create an array of type names for finding weaknesses and display
    for (i = 0; i < json.types.length; i++) {
        types.push(json.types[i].type.name);
    }
    document.getElementById("typeTitle").style.visibility = "visible";
    document.getElementById("weakTitle").style.visibility = "visible";
    localType(types);

    document.getElementById("loader").style.display = "none";
    
}

function localType(pTypes) {
    var allWeaknesses = [];
    for (i = 0; i < pTypes.length; i++) {
        document.getElementById("pokeType").innerHTML += pTypes[i];
        if (!(i === pTypes.length - 1)) {
            document.getElementById("pokeType").innerHTML += " / ";
        }
        for (j = 0; j < typeJSON.types.length; j++) {
            var type = typeJSON.types[j];
            if (pTypes[i] === type.name) {
                for (k = 0; k < type.effects.weak_to.length; k++) {
                    allWeaknesses.push(type.effects.weak_to[k]);
                }
            }
        }
    }
    displayTypeWeaknesses(allWeaknesses);
}

function displayTypeWeaknesses(weaknesses) {
    var alreadyDisplayed = [];
    var pokeWeak = document.getElementById("pokeWeak");
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
                pokeWeak.innerHTML += " / ";
            }
        }
        
    }
}

function showRegion(id) {
    console.log("in region: " + id);
    var regionHolder = document.getElementById("region");
    
    if (id < 152){
        regionHolder.innerHTML = regionNames[0];
    } else if (152 <= id && id < 252) {
        regionHolder.innerHTML = regionNames[1];
    } else if (252 <= id && id < 387) {
        regionHolder.innerHTML = regionNames[2];
    } else if (387 <= id && id < 494) {
        regionHolder.innerHTML = regionNames[3];
    } else if (494 <= id && id < 650) {
        regionHolder.innerHTML = regionNames[4];
    } else {
        regionHolder.innerHTML = regionNames[5];
    }
    
    regionHolder.innerHTML += " Region";
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

var regionNames = ["Kanto", "Johto", "Hoenn", "Sinnoh", "Unova", "Kalos"];

var typeJSON = {"types": [{"name": "normal", "effects": {"weak_to": ["fighting"], "resistant_to":[],"immune_to":["ghost"]}},
{"name":"fighting","effects":{"weak_to":["flying","psychic","fairy"],"resistant_to":["rock","bug","dark"],"immune_to":[]}},
{"name":"flying","effects":{"weak_to":["rock","electric","ice"],"resistant_to":["fighting","bug","grass"],"immune_to":["ground"]}},
{"name":"poison","effects":{"weak_to":["ground","psychic"],"resistant_to":["fighting","poison","bug","grass","fairy"],"immune_to":[]}},
{"name":"ground","effects":{"weak_to":["water","grass","ice"],"resistant_to":["poison","rock"],"immune_to":["electric"]}},
{"name":"rock","effects":{"weak_to":["fighting","ground","steel","water","grass"],"resistant_to":["normal","flying","poison","fire"],"immune_to":[]}},
{"name":"bug","effects":{"weak_to":["flying","rock","fire"],"resistant_to":["fighting","ground","grass"],"immune_to":[]}},
{"name":"ghost","effects":{"weak_to":["ghost","dark"],"resistant_to":["poison","bug"],"immune_to":["normal","fighting"]}},
{"name":"steel","effects":{"weak_to":["fighting","ground","fire"],"resistant_to":["normal","flying","rock","bug","steel","grass","psychic","ice","dragon","fairy"],"immune_to":["poison"]}},
{"name":"fire","effects":{"weak_to":["ground","rock","water"],"resistant_to":["bug","steel","fire","grass","ice","fairy"],"immune_to":[]}},
{"name":"water","effects":{"weak_to":["grass","electric"],"resistant_to":["steel","fire","water","ice"],"immune_to":[]}},
{"name":"grass","effects":{"weak_to":["flying","poison","bug","fire","ice"],"resistant_to":["ground","water","grass","electric"],"immune_to":[]}},
{"name":"electric","effects":{"weak_to":["ground"],"resistant_to":["flying","steel","electric"],"immune_to":[]}},
{"name":"psychic","effects":{"weak_to":["bug","ghost","dark"],"resistant_to":["fighting","psychic"],"immune_to":[]}},
{"name":"ice","effects":{"weak_to":["fighting","rock","steel","fire"],"resistant_to":["ice"],"immune_to":[]}},
{"name":"dragon","effects":{"weak_to":["ice","dragon","fairy"],"resistant_to":["fire","water","grass","electric"],"immune_to":[]}},
{"name":"dark","effects":{"weak_to":["fighting","bug","fairy"],"resistant_to":["ghost","dark"],"immune_to":["psychic"]}},
{"name":"fairy","effects":{"weak_to":["poison","steel"],"resistant_to":["fighting","bug","dark"],"immune_to":["dragon"]}}]};
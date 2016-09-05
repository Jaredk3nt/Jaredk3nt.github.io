/* TODO :
    -add client side caching of pokemon they look up in a session so if they re-look them up it doesn't have to make extranious calls to the backend (web-storage)
    store: localstorage.setItem('key', JSON.stringify({name: 'value'}));
    get: JSON.parse(localStorage.getItem('key')).name;
    -set up JSON objects for each pokemon for storage
    {name: 'name', id: '', type: 'type', img: 'url'}
    
    -add section for what types they are good against
    
    -suggesting pokemon based on what is typed or some system of "did you mean" if they put in an improper name
    
    -start turning json call back immediately into local side storable json so the display method can work on both with no mods
        also store before call to display
    {"name": "x", "id":"y", "sprite": "z", "types": ["name": "1","name": "1"]}
*/

var xmlhttp = new XMLHttpRequest();
var baseurl = "http://pokeapi.co/api/v2/pokemon/";
var localStorageBool = false;

window.onload = function () {
    if (typeof(Storage) !== "undefined") {
        localStorageBool = true;
    } 
    //setup event listeners for back and next arrows to call a modified pokeSearch
    document.getElementById("back").addEventListener("click", pokeSearch(1));
    document.getElementById("next").addEventListener("click", pokeSearch(2));
    document.getElementById("searchButton").addEventListener("click", pokeSearch(0));
    document.getElementById("searchBar").addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            pokeSearch();
        }
    });
};

//main method to search for pokemon
function pokeSearch(notifier) {
    //grab the pokemon they search for
    var pokemon = document.getElementById("searchBar").value.lowerString();
    var currentShowing = document.getElementById("pokeName").innerHTML.lowerString();
    //test if they are re-searching for whats already there to prevent another api call
    if (!(pokemon === currentShowing)) {
        //begin setup to bring in the new data
        document.getElementById("pokeDisplay").style.display = "none";
        document.getElementById("errorState").style.display = "none";
        document.getElementById("loader").style.display = "block";
        //check if there is local storage avaliable 
        if (localStorageBool) { 
            var storedPokemon = checkStorage(pokemon);
            //use stored data if found
            if (storedPokemon !== null) {
                console.log("pulling from local storage: " + storedPokemon + " typeof:" + typeof storedPokemon);
                var storedJSON = JSON.parse(storedPokemon);
                console.log("done parsing: " + storedJSON);
                pokeDisplay(storedJSON);
                return;
            }
        }
        console.log("API Call for " + pokemon);
        //make the full URL based on search
        var url = baseurl.concat(pokemon);
        url = url.concat("/");
        console.log("begin request");
        xmlhttp.open("GET", url, true);
        xmlhttp.onload = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                //console.log(xmlhttp.responseText);
                var json = JSON.parse(xmlhttp.responseText);
                console.log(json);
                console.log("end request");
                var storableJSON;
                //store the pokemon in local storage 
                if(json.types.length > 1){
                    storableJSON = {"name": json.name,"id": json.id, "sprite": json.sprites.front_default,"types": [{"name": json.types[0].type.name},{"name": json.types[1].type.name}]};
                } else {
                    storableJSON = {"name":json.name,"id":json.id,"sprite":json.sprites.front_default,"types":[{"name":json.types[0].type.name}]};
                }
                localStorage.setItem(pokemon, JSON.stringify(storableJSON));
                pokeDisplay(storableJSON);
            } else {
                //display callback error
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
    console.log(json.name);
    var name = json.name.capitalizeString();
    var weaknesses = "";
    
    //var urls = [];
    var formattedTypes = [];
    //place information we already have
    document.getElementById("pokeDisplay").style.display = "block";
    document.getElementById("pokeName").innerHTML = name;
    if(json.id < 10) {
        document.getElementById("pokeID").innerHTML = "#00" + json.id;
    } else if (json.id < 100) {
        document.getElementById("pokeID").innerHTML = "#0" + json.id;
    } else {
        document.getElementById("pokeID").innerHTML = "#" + json.id;
    }
    
    document.getElementById("pokeImg").src = json.sprite;
    document.getElementById("type1").style.display = "none";
    document.getElementById("type2").style.display = "none";
    document.getElementById("weaknessesUL").innerHTML = "";
    document.getElementById("pokeDisplay").style.height = "170px";
    
    showRegion(json.id);

    document.getElementById("weakTitle").style.visibility = "visible";
    localType(json.types);

    document.getElementById("loader").style.display = "none";
    
}

//handle all type calculation and display
function localType(pTypes) {
    var allWeaknesses = [];
    var resistances = [];
    var immunities = []
    //loop through the types the pokemon displays
    for (i = 0; i < pTypes.length; i++) {
        var color;
        //use JSON to gather more data on the type
        for (j = 0; j < typeJSON.types.length; j++) {
            var type = typeJSON.types[j];
            if (pTypes[i].name === type.name) {
                color = type.color;
                //gather the type weaknesses the pokemon displays
                for (w = 0; w < type.effects.weak_to.length; w++) {
                    allWeaknesses.push(type.effects.weak_to[w]);
                }
                //gather the type resistances the pokemon displays
                for(r = 0; r < type.effects.resistant_to.length; r++){ 
                    resistances.push(type.effects.resistant_to[r]);
                } 
                //gather the type immunities the pokemon displays
                for (im =0; im < type.effects.immune_to.length; im++) {
                    immunities.push(type.effects.immune_to[im]);
                }
            }
        }
        //display the main types on the page
        if(i === 0) {
            var type = document.getElementById("type2");
            type.style.display = "block";
            type.innerHTML = pTypes[i].name;
            type.style.background = color;
        } else {
            var type = document.getElementById("type1");
            type.style.display = "block";
            type.innerHTML = pTypes[i].name;
            type.style.background = color;
        }
        
    }
    displayTypeWeaknesses(allWeaknesses, resistances, immunities);
}

//calculate and display proper type weaknesses
function displayTypeWeaknesses(weaknesses, resistances, immunities) {
    var alreadyDisplayed = [];
    var showing = 0;
    //var pokeWeak = document.getElementById("weaknesses");
    //calculate which weaknesses will be displayed (mostly for 2 typed pokemon)
    for (i = 0; i < weaknesses.length; i++) {
        var found = false;
        //see if the type is overlapped b/w the pokemons types
        for (j = 0; j < alreadyDisplayed.length; j++) {
            if (alreadyDisplayed[j] === weaknesses[i]) {
                found = true;
                break;
            }
        }
        //if there is no overlap check to see if there is a resistance or immunity overlap
        if (!found) {
            var typeInconsistency = false;
            //note that we already checked this one whether we are resistant or not
            alreadyDisplayed.push(weaknesses[i]); 
            //loop through resistances and then immunities to filter out wrong weaknesses
            for (k = 0; k < resistances.length; k++) {
                if(weaknesses[i] === resistances[k]) {
                    typeInconsistency = true;
                }
            }
            for (im = 0; im < immunities.length; im++) {
                if(weaknesses[i] === immunities[im]) {
                    typeInconsistency = true;
                }
            }
            if(!typeInconsistency){
                var weaknessLI = document.createElement("li");
                weaknessLI.className = "type";
                weaknessLI.innerHTML = weaknesses[i];
                //weaknessLI.style.background = getTypeColor(weaknesses[i]);
                 for (c = 0; c < typeJSON.types.length; c++) {
                    if (typeJSON.types[c].name === weaknesses[i]) {
                        weaknessLI.style.background = typeJSON.types[c].color;
                    }
                }
                document.getElementById("weaknessesUL").appendChild(weaknessLI);
                showing++;
                if (showing > 6) {
                    document.getElementById("pokeDisplay").style.height = "200px";
                } else if (showing > 3) {
                    document.getElementById("pokeDisplay").style.height = "175px";
                }
            }
        }
    }
}

//display the home region of the pokemon based on id number
function showRegion(id) {
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

function checkStorage(name){
    if (localStorage.name !== null) {
        return localStorage.getItem(name);
    }
}

//String prototype helper methods for minimizing code
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

String.prototype.lowerString = function () {
    var lowString = "";
    for (i = 0; i < this.length; i++) {
        lowString += this.charAt(i).toLowerCase();
    }
    return lowString;
}

//stored data on type and region
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
{"name":"fairy", "color": "#F7B5EE", "effects":{"weak_to":["poison","steel"],"resistant_to":["fighting","bug","dark"],"immune_to":["dragon"]}}]};
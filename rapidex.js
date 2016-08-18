var xmlhttp = new XMLHttpRequest();
var baseurl = "http://pokeapi.co/api/v2/pokemon/";

function pokeSearch() {
    document.getElementById("loader").style.display = "block";
    console.log("loading...");
    //grab the pokemon they search for
    var pokemon = document.getElementById("searchBar").value.lowerFirstLetter();
    //make the full URL based on search
    var url = baseurl.concat(pokemon);
    url = url.concat("/");

    xmlhttp.open("GET", url, true);
    xmlhttp.onload = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var json = JSON.parse(xmlhttp.responseText);
            pokeDisplay(json);
        } else {
            console.error(xhrType.statusText);
        }
    }
    xmlhttp.send();
}

//placing the data into the page
function pokeDisplay(json) {
    console.log("In pokeDisplay");

    var name = json.name.capitalizeFirstLetter();
    document.getElementById("pokeName").innerHTML = name;
    document.getElementById("pokeID").innerHTML = "#" + json.id;
    document.getElementById("pokeImg").src = json.sprites.front_default;
    var types = json.types;
    document.getElementById("pokeType").innerHTML = "";

    var weaknesses = "";
    var urls = [];
    for (i = 0; i < types.length; i++) {
        if (i < types.length && i > 0) {
             document.getElementById("pokeType").innerHTML += " / ";
        }
        var typeObj = types[i];
        document.getElementById("pokeType").innerHTML += typeObj.type.name.capitalizeFirstLetter();
        urls.push(typeObj.type.url);
    }
    document.getElementById("typeTitle").style.visibility = "visible";
    document.getElementById("weakTitle").style.visibility = "visible";

    document.getElementById("pokeWeak").innerHTML = "";

    console.log("before call to displayWeaknesses");

    displayTypeWeakness(urls[0]);
    if(urls.length === 2) {
        document.getElementById("pokeWeak").innerHTML += " / ";
        displayTypeWeakness(urls[1]);
    }
    document.getElementById("loader").style.display = "none";
    console.log("done loading...");
}

function displayTypeWeakness(url) {
    //make http call to new url to get type info
    var xhrType = new XMLHttpRequest();

    xhrType.open("GET", url, true);
    xhrType.onload = function() {
        if (xhrType.readyState === 4) {
            if (xhrType.status === 200) {
                console.log("Inside weakness onload");
                var json = JSON.parse(xhrType.responseText);
                var weakness = json.damage_relations.double_damage_from;
                for (i = 0; i < weakness.length; i++) {
                    if (i < weakness.length && i > 0) {
                        document.getElementById("pokeWeak").innerHTML += " / ";
                    }
                    document.getElementById("pokeWeak").innerHTML += weakness[i].name.capitalizeFirstLetter();
                }
            } else {
                console.error(xhrType.statusText);
            }
        }
    }
    xhrType.send();
    return;
}

window.onload = function () {
    document.getElementById("searchButton").addEventListener("click", pokeSearch);
}

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.lowerFirstLetter = function() {
    return this.charAt(0).toLowerCase() + this.slice(1);
}
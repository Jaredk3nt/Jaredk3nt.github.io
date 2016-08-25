/* TODO :
    -add a check to not re-call pokeSearch if the name of the pokemon hasn't changed so spamming the button doesn't make multiple calls to the backend
    
    -add client side caching of pokemon they look up in a session so if they re-look them up it doesn't have to make extranious calls to the backend (web-storage)
    store: localstorage.setItem('key', JSON.stringify({name: 'value'}));
    get: alert(JSON.parse(localStorage.getItem('key')).name);
    -set up JSON objects for each pokemon for storage
    {name: 'name', id: '', type: 'type', img: 'url', weakness: ['','',..]}
    
    -add section for what types they are good against
*/

var xmlhttp = new XMLHttpRequest();
var baseurl = "http://pokeapi.co/api/v2/pokemon/";

function pokeSearch() {
    document.getElementById("pokeDisplay").style.display = "none";
    document.getElementById("errorDisplay").style.display = "none";
    document.getElementById("loader").style.display = "block";
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
            document.getElementById("errorMessage").innerHTML = pokemon + " can't be found!";
            document.getElementById("loader").style.display = "none";
            document.getElementById("errorDisplay").style.display = "block";
            console.error(xhrType.statusText);
        }
    }
    xmlhttp.send();
}

//placing the data into the page
function pokeDisplay(json) {
    var name = json.name.capitalizeFirstLetter();
    document.getElementById("pokeDisplay").style.display = "block";
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

    displayTypeWeakness(urls[0]);
    if(urls.length === 2) {
        displayTypeWeakness(urls[1]);
    }
    document.getElementById("loader").style.display = "none";
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
    document.getElementById("searchBar").addEventListener("keyup", function(event){
        event.preventDefault();
        if (event.keyCode == 13) {
            pokeSearch();
        }
    });
}

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.lowerFirstLetter = function() {
    return this.charAt(0).toLowerCase() + this.slice(1);
}
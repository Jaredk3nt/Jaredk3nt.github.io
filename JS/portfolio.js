/* class for the project, to hold all pertanent information */
function Project(title, description, img_link) { 
    this.title = title;
    this.description = description;
    this.img_link = img_link;
}

/* open the modal and display the appropriate information */
var modal_action = function (x) {
    var modal =  document.getElementById('pModal');
    var modal_content = document.getElementById('pContent');
    var title = document.getElementById('pTitle');
    var img = document.getElementById('pImg');
    var descrip = document.getElementById('pDescrip');
    
    /* declaring projects here until I can get database space to hold data before pulling,
    this is quite gross. */
    var cc = new Project("CheaterCheater", "Android mobile application I developed over the summer of 2015 to create all possible combinations of a Scrabble hand and show their values.", "../resources/projects/cc.png");
    
    var steam = new Project("Steam Redesign", "Personal project, redesigning the clucky UI of the steam desktop application to a more modern interface", "../resources/projects/Steam.png");
    
    var imdb = new Project("iMDB Redesign", "iMDB website redesign concept. Taking the outdated UI iMDB currently uses and transforming it into a simple material design.", "../resources/projects/imdb.png");
    
    var lol = new Project("League of Legends Champion Screen Redesign", "Taking a flat and modern approach to the champion shop screen on the League of Legends client", "../resources/projects/lol.png");
    
    /* switch over project options */
    switch(x){
        case 1:
            title.innerHTML = cc.title;
            img.src = cc.img_link;
            descrip.innerHTML = cc.description;
            break;
        case 2:
            title.innerHTML = steam.title;
            img.src = steam.img_link;
            descrip.innerHTML = steam.description;
            break;
        case 3:
            title.innerHTML = imdb.title;
            img.src = imdb.img_link;
            descrip.innerHTML = imdb.description;
            break;
        case 4:
            title.innerHTML = lol.title;
            img.src = lol.img_link;
            descrip.innerHTML = lol.description;
            break;
        default:
            title.innerHTML = "Default Title";
            img.src = steam.img_link;
            descrip.innerHTML = "default description text";
    }

    modal_content.style.height = img.height + 20;
    modal.style.display = "block";
};

var setTitleSizes = function () {
    var text = [], img = [], i;
    /*
    var cc_text = document.getElementById('cheatercheater-title');
    var cc_img = document.getElementById('cheatercheater-img');
    var steam_text = document.getElementById('steam-title');
    var steam_img = document.getElementById('steam-img');
    var imdb_text = document.getElementById('imdb-title');
    var imdb_img = document.getElementById('imdb-img');
    var lol_text = document.getElementById('lol-title');
    var lol_img = document.getElementById('lol-img');
    */

    /* for my simple alg to work you must push them on each
    list in the same order!!!! */
    text.push(document.getElementById('cheatercheater-title'));
    text.push(document.getElementById('steam-title'));
    text.push(document.getElementById('imdb-title'));
    text.push(document.getElementById('lol-title'));

    img.push(document.getElementById('cheatercheater-img'));
    img.push(document.getElementById('steam-img'));
    img.push(document.getElementById('imdb-img'));
    img.push(document.getElementById('lol-img'));

    for (i = 0; i < text.length; i++) {
        var width = img[i].width, wpx = width.toString() + "px";
        console.log(wpx);
        text[i].style.width = wpx;    
    }
};

/* set the sizes for the title hovers on window load */
window.onload = function () {
    setTitleSizes();
};

/* close onclick outside of the modal */
window.onclick = function (event) {
    if (event.target === document.getElementById('pModal')) {
        document.getElementById('pModal').style.display = "none";
    }
};
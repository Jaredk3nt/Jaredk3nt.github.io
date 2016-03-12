function Project(title, description, img_link){ 
    this.title = title;
    this.description = description;
    this.img_link = img_link;
}

var cc = new Project("CheaterCheater", "Android mobile application I developed over the summer of 2015 to create all possible combinations of a Scrabble hand and show their values.", "../resources/projects/cc.png");

var modal_action = function (x) {
    var modal =  document.getElementById('pModal');
    if (x === 1) {
        document.getElementById('pTitle').innerHTML = cc.title;
        document.getElementById('pImg').src = cc.img_link;
        document.getElementById('pDescrip').innerHTML = cc.description;
    }
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
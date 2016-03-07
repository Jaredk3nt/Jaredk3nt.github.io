var setTitleSizes = function() {
  var text = [];
  var img = [];
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

  for(var i = 0; i < text.length; i++){
    var width = img[i].width;
    var wpx = width.toString() + "px";
    console.log(wpx);
    text[i].style.width = wpx;    
  }
}

window.onload =function(){
  setTitleSizes();
}

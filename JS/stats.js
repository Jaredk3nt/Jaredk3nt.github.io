var Irelia = require('irelia');
var irelia = new Irelia({
  secure:true,
  host: 'prod.api.pvp.net',
  path: '/api/lol/',
  key: '',
  debug:true
});



irelia.getChampions('na', true, function(err, summoner){
  if(err){
    if(err.status.code == 429){
                console.log(err.status.message);
            } else if(err.status.code == 404){
                console.log(err.status.message);
            } else if(err.status.code == 500){
                console.log(err.status.message);
            } else {
                console.log('Unknown error code');
            }
        } else {
            console.log(err); // Non http error
        }
  }else{
    document.getElementById("champs").innerText = ('Free champions: ' + champions.join(', ');
  }
});

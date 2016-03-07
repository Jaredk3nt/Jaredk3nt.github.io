var Irelia = require('irelia');
var irelia = new Irelia({
  secure:true,
  host: 'prod.api.pvp.net',
  path: '/api/lol/',
  key: '',
  debug:true
});

var data = [
  {
    value:75,
    color:"#262626",
    highlight: "#505050",
    lable:""
  },
  {
    value:25,
    color:"#ffffff",
    highlight: "#ffffff",
    lable:""
  }
];

var options = {};

var ctx = document.getElementById("champChart").getContext("2d");
var champChart = new Chart(ctx).Doughnut(data,options);

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

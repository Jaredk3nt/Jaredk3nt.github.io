
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

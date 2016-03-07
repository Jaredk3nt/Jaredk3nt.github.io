
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

var showGraph = function() {
  var ctx = document.getElementById("python").getContext("2d");
  var pyChart = new Chart(ctx).Doughnut(data,options);
  ctx = document.getElementById("java").getContext("2d");
  var javaChart = new Chart(ctx).Doughnut(data,options);
}

window.onload = function() {
  showGraph();
}

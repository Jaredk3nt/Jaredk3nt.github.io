var playgroundApp = angular.module('playgroundApp', []);

let namesList = ["Jared", "Madeline"];

playgroundApp.controller('NameListController', 
  function NameListController($scope) {
    $scope.names = namesList;
    $scope.addName = function() {
      $scope.names.push($scope.newName);
    }
  }
);


namesList.push("Matt");
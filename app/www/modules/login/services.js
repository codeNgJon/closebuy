angular.module('login.services', [])

.factory('Auth', function($state, GeoData) {
  // Login existing user in Parse database
  var loginUser = function(user) {
    Parse.User.logIn(user.username, user.password, {
      // If successful in logging user in, make them current user by giving them a session token
      success: function(user) {
        var token = Parse.User.current().getSessionToken();
        Parse.User.become(token, {
          // If successful in authorizing user with token, take them to the 'sellbuy' screen
          success: function(user) {
            $state.go('sellbuy');
          }, 
          error: function(error) {
            //
          }
        });
      },
      error: function(user) {
        //
      }
    });
  };

  var geoData = function(user){
    GeoData.getData().then(function(position){
      console.log("getData successful: position - ", position);
      // when geodata call is successful and position is accessible, invoke signupUser and pass in location and user data
      signupUser(user, position);
    }, function(err) {
      console.log(err);
    });
  };

  // Create new user in Parse database

  var signupUser = function(user, position) {

    // create a new Parse GeoPoint using the coordinates from the geoData call

    var point = new Parse.GeoPoint(position.coords.latitude, position.coords.longitude);

    var newUser = new Parse.User();
    newUser.set("username", user.username);
    newUser.set("password", user.password);
    newUser.set("location", point);
    newUser.set("skippedImages", []);

    newUser.signUp(null, {
      // If successful in creating new user, make them current user by giving them a session token
      success: function(user) {
        var token = Parse.User.current().getSessionToken();
        Parse.User.become(token, {
          // If successful in authorizing user with token, take them to the 'sellbuy' screen
          success: function(user) {
            $state.go('sellbuy');
          }, 
          error: function(error) {
            //
          }
        });
      },
      error: function(err) {
        //
      }
    });
  };

  var logoutUser = function() {
    Parse.User.logOut();
    $state.go('login');
  };

  return {
    loginUser: loginUser,
    signupUser: signupUser,
    logoutUser: logoutUser,
    geoData: geoData
  };
})

.factory('GeoData', ['$q', function($q){

  var getData = function() {
    // this function uses promises, similar to the camera factory
    
    var q = $q.defer();
    
    navigator.geolocation.getCurrentPosition(
      function(position) {
        q.resolve(position);
      },
      function(err) {
        q.reject(err);
      });
    
    return q.promise;
    
    };

  return {
    getData: getData
  };

}]);